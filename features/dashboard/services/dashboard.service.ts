import { supabase } from "@/lib/supabase";

export async function carregarDashboard() {

  const [
    imoveis,
    empreendimentos,
  ] = await Promise.all([

    supabase
      .from("imoveis")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("empreendimentos")
      .select("*", {
        count: "exact",
        head: true,
      }),

  ]);

  const { data: vgvData } = await supabase
    .from("imoveis")
    .select("preco");

  const totalVGV =
    (vgvData ?? []).reduce(
      (total: number, item: any) =>
        total + Number(item.preco || 0),
      0
    );

  return {

    totalImoveis:
      imoveis.count ?? 0,

    totalEmpreendimentos:
      empreendimentos.count ?? 0,

    totalLeads: 0,

    vgv: totalVGV,

  };

}