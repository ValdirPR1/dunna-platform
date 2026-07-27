import { supabase } from "@/lib/supabase";
import { sanitizarNomeArquivo } from "@/lib/sanitizarNomeArquivo";

export interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo_html: string | null;
  imagem_capa: string | null;
  categoria: string | null;
  autor: string | null;
  publicado: boolean;
  created_at: string;
}

function gerarSlug(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listarPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as BlogPost[];
}

export async function listarPostsPublicados(
  limite?: number
): Promise<BlogPost[]> {
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false });

  if (limite) query = query.limit(limite);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as BlogPost[];
}

export async function buscarPost(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as BlogPost;
}

export async function buscarPostPorSlug(
  slug: string
): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (error || !data) return null;
  return data as BlogPost;
}

export async function criarPost(dados: {
  titulo: string;
  resumo?: string;
  conteudo_html?: string;
  imagem_capa?: string;
  categoria?: string;
}) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      titulo: dados.titulo,
      slug: gerarSlug(dados.titulo) + "-" + Date.now().toString().slice(-5),
      resumo: dados.resumo ?? null,
      conteudo_html: dados.conteudo_html ?? null,
      imagem_capa: dados.imagem_capa ?? null,
      categoria: dados.categoria ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function atualizarPost(
  id: string,
  dados: Partial<{
    titulo: string;
    resumo: string;
    conteudo_html: string;
    imagem_capa: string;
    categoria: string;
    publicado: boolean;
  }>
) {
  const { error } = await supabase
    .from("blog_posts")
    .update(dados)
    .eq("id", id);

  if (error) throw error;
}

export async function excluirPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadImagemCapa(file: File): Promise<string> {
  const nomeArquivo = `capas/${crypto.randomUUID()}-${sanitizarNomeArquivo(file.name)}`;

  const { error } = await supabase.storage
    .from("blog")
    .upload(nomeArquivo, file);

  if (error) throw error;

  const { data } = supabase.storage.from("blog").getPublicUrl(nomeArquivo);
  return data.publicUrl;
}
