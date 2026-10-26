"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, CalendarCheck, Handshake, Users, Wallet } from "lucide-react";
import { ClienteCrm, COR_ETAPA, ETAPAS, TarefaCrm } from "../types";
import { formatarMoeda, inicioDoDia, mesmoDia } from "../utils";

const CORES_ORIGEM = ["#b8975a", "#0ea5e9", "#8b5cf6", "#16a34a", "#f97316", "#64748b", "#dc2626"];

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function Card({ icon: Icon, titulo, valor, sub, destaque }: {
  icon: typeof Users;
  titulo: string;
  valor: string | number;
  sub?: string;
  destaque?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${destaque ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center gap-2 font-sans text-sm text-slate-500">
        <Icon size={16} className={destaque ? "text-red-500" : "text-gold"} />
        {titulo}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-navy">{valor}</p>
      {sub && <p className="mt-1 font-sans text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function Caixa({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-sans font-semibold text-navy">{titulo}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}

function Vazio() {
  return (
    <div className="flex h-full items-center justify-center font-sans text-sm text-slate-400">
      Sem dados ainda.
    </div>
  );
}

export default function PainelGraficos({
  clientes,
  tarefas,
}: {
  clientes: ClienteCrm[];
  tarefas: TarefaCrm[];
}) {
  const dados = useMemo(() => {
    const hoje = new Date();
    const inicioHoje = inicioDoDia(hoje).getTime();

    const funil = ETAPAS.map((e) => ({
      etapa: e,
      total: clientes.filter((c) => c.etapa === e).length,
    }));

    const porOrigemMapa = new Map<string, number>();
    clientes.forEach((c) => porOrigemMapa.set(c.origem, (porOrigemMapa.get(c.origem) ?? 0) + 1));
    const porOrigem = [...porOrigemMapa.entries()].map(([nome, valor]) => ({ nome, valor }));

    // Últimos 6 meses
    const porMes = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - i), 1);
      const total = clientes.filter((c) => {
        const cr = new Date(c.criado_em);
        return cr.getFullYear() === d.getFullYear() && cr.getMonth() === d.getMonth();
      }).length;
      const fechados = clientes.filter((c) => {
        const at = new Date(c.atualizado_em);
        return c.etapa === "Fechado" && at.getFullYear() === d.getFullYear() && at.getMonth() === d.getMonth();
      }).length;
      return { mes: MESES[d.getMonth()], novos: total, fechados };
    });

    // Tarefas dos últimos 7 dias (concluídas x pendentes que venceram)
    const ultimos7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() - (6 - i));
      const doDia = tarefas.filter((t) => mesmoDia(new Date(t.data_hora), d));
      return {
        dia: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
        concluidas: doDia.filter((t) => t.concluida).length,
        pendentes: doDia.filter((t) => !t.concluida).length,
      };
    });

    const ativos = clientes.filter((c) => c.etapa !== "Fechado" && c.etapa !== "Perdido");
    const emNegociacao = ativos.reduce((s, c) => s + (c.valor_estimado ?? 0), 0);
    const fechadosMes = clientes.filter((c) => {
      const at = new Date(c.atualizado_em);
      return c.etapa === "Fechado" && at.getMonth() === hoje.getMonth() && at.getFullYear() === hoje.getFullYear();
    }).length;
    const abertas = tarefas.filter((t) => !t.concluida);
    const atrasadas = abertas.filter((t) => new Date(t.data_hora).getTime() < Date.now()).length;
    const hojeQtd = abertas.filter((t) => {
      const d = new Date(t.data_hora);
      return mesmoDia(d, hoje) && d.getTime() >= inicioHoje;
    }).length;

    return { funil, porOrigem, porMes, ultimos7, ativos: ativos.length, emNegociacao, fechadosMes, atrasadas, hojeQtd };
  }, [clientes, tarefas]);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card icon={Users} titulo="Clientes ativos" valor={dados.ativos} sub={`${clientes.length} no total`} />
        <Card icon={Wallet} titulo="Em negociação" valor={formatarMoeda(dados.emNegociacao)} sub="valor estimado" />
        <Card icon={Handshake} titulo="Fechados no mês" valor={dados.fechadosMes} />
        <Card icon={CalendarCheck} titulo="Tarefas hoje" valor={dados.hojeQtd} />
        <Card icon={AlertTriangle} titulo="Atrasadas" valor={dados.atrasadas} destaque={dados.atrasadas > 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <Caixa titulo="Funil por etapa">
          {clientes.length === 0 ? <Vazio /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.funil} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="etapa" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" name="Clientes" radius={[0, 6, 6, 0]}>
                  {dados.funil.map((d) => <Cell key={d.etapa} fill={COR_ETAPA[d.etapa]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Caixa>

        <Caixa titulo="De onde vêm os clientes">
          {dados.porOrigem.length === 0 ? <Vazio /> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dados.porOrigem} dataKey="valor" nameKey="nome" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {dados.porOrigem.map((_, i) => <Cell key={i} fill={CORES_ORIGEM[i % CORES_ORIGEM.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Caixa>

        <Caixa titulo="Novos clientes e fechamentos (6 meses)">
          {clientes.length === 0 ? <Vazio /> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados.porMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="novos" name="Novos" stroke="#b8975a" strokeWidth={3} />
                <Line type="monotone" dataKey="fechados" name="Fechados" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Caixa>

        <Caixa titulo="Tarefas dos últimos 7 dias">
          {tarefas.length === 0 ? <Vazio /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.ultimos7}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="concluidas" name="Concluídas" stackId="a" fill="#16a34a" />
                <Bar dataKey="pendentes" name="Pendentes" stackId="a" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Caixa>

      </div>
    </div>
  );
}
