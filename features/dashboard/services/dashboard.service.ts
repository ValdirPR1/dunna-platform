import { supabase } from "@/lib/supabase";

// Conta pessoas por papel (cliente/lead) passando pela tabela
// "pessoas" — que já tem RLS restringindo por corretor — em vez de
// contar direto em "pessoa_papeis" (sem RLS), que sempre trazia o
// total da empresa inteira mesmo pro corretor.
async function contarPessoasPorPapel(papel: string): Promise<number> {
  const { data: papeis } = await supabase
    .from("pessoa_papeis")
    .select("pessoa_id")
    .eq("papel", papel);

  const pessoaIds = [
    ...new Set((papeis ?? []).map((p: any) => p.pessoa_id)),
  ];

  if (pessoaIds.length === 0) return 0;

  const { count } = await supabase
    .from("pessoas")
    .select("id", { count: "exact", head: true })
    .in("id", pessoaIds);

  return count ?? 0;
}

export async function carregarDashboard() {

  const [
    imoveis,
    imoveisPublicados,
    empreendimentos,
    empreendimentosAtivos,
    totalClientes,
    totalLeads,
  ] = await Promise.all([

    supabase
      .from("imoveis")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("imoveis")
      .select("*", { count: "exact", head: true })
      .eq("publicado", true),

    supabase
      .from("empreendimentos")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("empreendimentos")
      .select("*", { count: "exact", head: true })
      .eq("ativo", true),

    contarPessoasPorPapel("cliente"),

    contarPessoasPorPapel("lead"),

  ]);

  const { data: vgvData } = await supabase
    .from("imoveis")
    .select("preco")
    .eq("publicado", true);

  const totalVGV =
    (vgvData ?? []).reduce(
      (total: number, item: any) =>
        total + Number(item.preco || 0),
      0
    );

  return {

    totalImoveis:
      imoveis.count ?? 0,

    totalImoveisPublicados:
      imoveisPublicados.count ?? 0,

    totalEmpreendimentos:
      empreendimentos.count ?? 0,

    totalEmpreendimentosAtivos:
      empreendimentosAtivos.count ?? 0,

    totalClientes,

    totalLeads,

    vgv: totalVGV,

  };

}