"use client";

interface Props {
  unidades: any[];
}

export default function KPIs({
  unidades,
}: Props) {

  const total = unidades.length;

  const disponiveis =
    unidades.filter(
      u => u.status === "Disponível"
    ).length;

  const reservadas =
    unidades.filter(
      u => u.status === "Reservada"
    ).length;

  const vendidas =
    unidades.filter(
      u => u.status === "Vendida"
    ).length;

  const vgvTotal =
    unidades.reduce(
      (t,u)=>
        t+
        Number(
          u.preco_tabela||0
        ),
      0
    );

  const vgvDisponivel =
    unidades
      .filter(
        u=>u.status==="Disponível"
      )
      .reduce(
        (t,u)=>
          t+
          Number(
            u.preco_tabela||0
          ),
        0
      );

  const ticket =
    total
      ? vgvTotal/total
      :0;

  const venda =
    total
      ? (vendidas/total)*100
      :0;

  return(

<div className="grid grid-cols-6 gap-5">

<Card
titulo="Total"
valor={String(total)}
/>

<Card
titulo="Disponíveis"
valor={String(disponiveis)}
/>

<Card
titulo="Reservadas"
valor={String(reservadas)}
/>

<Card
titulo="Vendidas"
valor={String(vendidas)}
/>

<Card
titulo="VGV"
valor={vgvTotal.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL",
}
)}
/>

<Card
titulo="Venda"
valor={`${venda.toFixed(1)}%`}
/>

</div>

  )

}

function Card({
titulo,
valor,
}:{
titulo:string;
valor:string;
}){

return(

<div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

<p className="text-sm text-zinc-500">

{titulo}

</p>

<h3 className="mt-3 text-2xl font-bold text-white">

{valor}

</h3>

</div>

)

}