import { supabase } from "@/lib/supabase";

export interface LandingPage {
  id: string;
  empreendimento_id: string | null;
  titulo: string;
  slug: string;
  headline: string | null;
  subheadline: string | null;
  video_url: string | null;
  ativa: boolean;
  visitas: number;
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

export async function listarLandingPages(): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as LandingPage[];
}

export async function buscarLandingPage(id: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as LandingPage;
}

export async function buscarLandingPagePorSlug(
  slug: string
): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", slug)
    .eq("ativa", true)
    .single();

  if (error || !data) return null;
  return data as LandingPage;
}

export async function criarLandingPage(dados: {
  empreendimento_id: string;
  titulo: string;
  headline?: string;
  subheadline?: string;
  video_url?: string;
}) {
  const { data, error } = await supabase
    .from("landing_pages")
    .insert({
      empreendimento_id: dados.empreendimento_id,
      titulo: dados.titulo,
      slug: gerarSlug(dados.titulo) + "-" + Date.now().toString().slice(-5),
      headline: dados.headline ?? null,
      subheadline: dados.subheadline ?? null,
      video_url: dados.video_url ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as LandingPage;
}

export async function atualizarLandingPage(
  id: string,
  dados: Partial<{
    titulo: string;
    headline: string;
    subheadline: string;
    video_url: string;
    ativa: boolean;
  }>
) {
  const { error } = await supabase
    .from("landing_pages")
    .update(dados)
    .eq("id", id);

  if (error) throw error;
}

export async function excluirLandingPage(id: string) {
  const { error } = await supabase.from("landing_pages").delete().eq("id", id);
  if (error) throw error;
}

export async function registrarVisitaLandingPage(id: string) {
  await supabase.rpc("incrementar_visita_landing_page", { p_id: id });
}
