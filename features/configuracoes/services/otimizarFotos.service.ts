import { supabase } from "@/lib/supabase";
import { comprimirImagem } from "@/lib/comprimirImagem";

export interface FotoParaOtimizar {
  id: string;
  url: string;
  tabela: "imovel_fotos" | "empreendimento_imagens" | "empreendimento_planta_fotos";
  bucket: "imoveis" | "empreendimentos";
  descricao: string;
}

export async function listarTodasAsFotos(): Promise<FotoParaOtimizar[]> {
  const [fotosImoveis, fotosEmpreendimentos, fotosPlantas] =
    await Promise.all([
      supabase.from("imovel_fotos").select("id, url, imovel_id"),
      supabase
        .from("empreendimento_imagens")
        .select("id, url, empreendimento_id"),
      supabase.from("empreendimento_planta_fotos").select("id, url"),
    ]);

  const lista: FotoParaOtimizar[] = [];

  for (const item of (fotosImoveis.data ?? []) as any[]) {
    lista.push({
      id: item.id,
      url: item.url,
      tabela: "imovel_fotos",
      bucket: "imoveis",
      descricao: "Foto de imóvel",
    });
  }

  for (const item of (fotosEmpreendimentos.data ?? []) as any[]) {
    lista.push({
      id: item.id,
      url: item.url,
      tabela: "empreendimento_imagens",
      bucket: "empreendimentos",
      descricao: "Foto de empreendimento",
    });
  }

  for (const item of (fotosPlantas.data ?? []) as any[]) {
    lista.push({
      id: item.id,
      url: item.url,
      tabela: "empreendimento_planta_fotos",
      bucket: "empreendimentos",
      descricao: "Foto de planta/tipologia",
    });
  }

  return lista;
}

export async function otimizarFoto(
  foto: FotoParaOtimizar,
  comMarcaDagua: boolean
): Promise<{ economizado: number }> {
  // Baixa a foto atual
  const resposta = await fetch(foto.url);
  const blobOriginal = await resposta.blob();
  const tamanhoOriginal = blobOriginal.size;

  const nomeArquivo = foto.url.split("/").pop() ?? "foto.jpg";
  const arquivoOriginal = new File([blobOriginal], nomeArquivo, {
    type: blobOriginal.type,
  });

  // Comprime (e aplica marca d'água, se ativado)
  const arquivoOtimizado = await comprimirImagem(arquivoOriginal, {
    comMarcaDagua,
  });

  // Sobe a versão otimizada num novo arquivo
  const caminhoNovo = `otimizadas/${crypto.randomUUID()}.jpg`;

  const { error: erroUpload } = await supabase.storage
    .from(foto.bucket)
    .upload(caminhoNovo, arquivoOtimizado);

  if (erroUpload) throw erroUpload;

  const { data } = supabase.storage
    .from(foto.bucket)
    .getPublicUrl(caminhoNovo);

  // Atualiza o registro no banco pra apontar pra nova foto
  const { error: erroUpdate } = await supabase
    .from(foto.tabela)
    .update({ url: data.publicUrl })
    .eq("id", foto.id);

  if (erroUpdate) throw erroUpdate;

  return {
    economizado: tamanhoOriginal - arquivoOtimizado.size,
  };
}
