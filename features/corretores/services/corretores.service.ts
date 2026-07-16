import { supabase } from "@/lib/supabase";

export interface Corretor {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  creci: string | null;
  foto: string | null;
  ativo: boolean | null;
}

export async function listarCorretores(): Promise<Corretor[]> {
  const { data, error } = await supabase
    .from("corretores")
    .select("*")
    .order("nome");

  if (error) return [];
  return data as Corretor[];
}

export interface CorretorInput {
  nome: string;
  telefone: string;
  email: string;
  creci: string;
}

export async function criarCorretor(form: CorretorInput) {
  const { error } = await supabase.from("corretores").insert({
    nome: form.nome,
    telefone: form.telefone || null,
    email: form.email || null,
    creci: form.creci || null,
    ativo: true,
  });

  if (error) throw error;
}

export async function atualizarCorretor(
  id: string,
  form: Partial<CorretorInput>
) {
  const { error } = await supabase
    .from("corretores")
    .update(form)
    .eq("id", id);

  if (error) throw error;
}

export async function alternarAtivoCorretor(id: string, ativo: boolean) {
  const { error } = await supabase
    .from("corretores")
    .update({ ativo })
    .eq("id", id);

  if (error) throw error;
}

export interface DesempenhoCorretor {
  totalOportunidades: number;
  emAndamento: number;
  fechados: number;
  temLogin: boolean;
}

export async function buscarDesempenhoCorretores(): Promise<
  Record<string, DesempenhoCorretor>
> {
  const [oportunidadesResp, usuariosResp] = await Promise.all([
    supabase.from("oportunidades").select("corretor_id, etapa"),
    supabase.from("usuarios").select("corretor_id"),
  ]);

  const oportunidades = oportunidadesResp.data ?? [];
  const usuarios = usuariosResp.data ?? [];

  const etapasFechadas = ["Contrato", "Pós-venda"];
  const mapa: Record<string, DesempenhoCorretor> = {};

  for (const op of oportunidades as any[]) {
    if (!op.corretor_id) continue;

    if (!mapa[op.corretor_id]) {
      mapa[op.corretor_id] = {
        totalOportunidades: 0,
        emAndamento: 0,
        fechados: 0,
        temLogin: false,
      };
    }

    mapa[op.corretor_id].totalOportunidades += 1;

    if (etapasFechadas.includes(op.etapa)) {
      mapa[op.corretor_id].fechados += 1;
    } else {
      mapa[op.corretor_id].emAndamento += 1;
    }
  }

  for (const u of usuarios as any[]) {
    if (!u.corretor_id) continue;

    if (!mapa[u.corretor_id]) {
      mapa[u.corretor_id] = {
        totalOportunidades: 0,
        emAndamento: 0,
        fechados: 0,
        temLogin: false,
      };
    }

    mapa[u.corretor_id].temLogin = true;
  }

  return mapa;
}
