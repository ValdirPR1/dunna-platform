import { supabase } from "@/lib/supabase";

export async function carregarDashboard() {

  const [
    imoveis,
    imoveisPublicados,
    empreendimentos,
    empreendimentosAtivos,
    clientes,
    leads,
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

    supabase
      .from("pessoa_papeis")
      .select("*", { count: "exact", head: true })
      .eq("papel", "cliente"),

    supabase
      .from("pessoa_papeis")
      .select("*", { count: "exact", head: true })
      .eq("papel", "lead"),

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

    totalClientes:
      clientes.count ?? 0,

    totalLeads:
      leads.count ?? 0,

    vgv: totalVGV,

  };

}