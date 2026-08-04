import { Periodicidade } from "../types/meta";

function paraDataLocal(data: Date) {
  // Zera hora/minuto/segundo pra evitar problema de fuso na hora de
  // converter pra string (toISOString usa UTC e pode "voltar" um dia)
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatarData(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// Segunda-feira da semana de "data"
function inicioDaSemana(data: Date) {
  const d = paraDataLocal(data);
  const diaSemana = d.getDay(); // 0 = domingo
  const deslocamento = diaSemana === 0 ? -6 : 1 - diaSemana;
  d.setDate(d.getDate() + deslocamento);
  return d;
}

function fimDaSemana(inicio: Date) {
  const d = new Date(inicio);
  d.setDate(d.getDate() + 6);
  return d;
}

function inicioDoMes(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), 1);
}

function fimDoMes(data: Date) {
  return new Date(data.getFullYear(), data.getMonth() + 1, 0);
}

export interface Periodo {
  inicio: string;
  fim: string;
  rotulo: string;
}

// Devolve o período (semana ou mês) que contém "referencia" (hoje,
// por padrão), já formatado pra salvar no banco e pra mostrar na tela.
export function obterPeriodoAtual(
  periodicidade: Periodicidade,
  referencia: Date = new Date()
): Periodo {
  if (periodicidade === "semanal") {
    const inicio = inicioDaSemana(referencia);
    const fim = fimDaSemana(inicio);
    return {
      inicio: formatarData(inicio),
      fim: formatarData(fim),
      rotulo: `${inicio.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} a ${fim.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`,
    };
  }

  const inicio = inicioDoMes(referencia);
  const fim = fimDoMes(referencia);
  return {
    inicio: formatarData(inicio),
    fim: formatarData(fim),
    rotulo: inicio.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  };
}

// Últimos N períodos ANTERIORES ao atual (não inclui o período em
// andamento), do mais recente pro mais antigo — usado no histórico.
export function obterPeriodosAnteriores(
  periodicidade: Periodicidade,
  quantidade: number
): Periodo[] {
  const periodos: Periodo[] = [];
  const hoje = new Date();

  for (let i = 1; i <= quantidade; i++) {
    const referencia = new Date(hoje);
    if (periodicidade === "semanal") {
      referencia.setDate(referencia.getDate() - 7 * i);
    } else {
      referencia.setMonth(referencia.getMonth() - i);
    }
    periodos.push(obterPeriodoAtual(periodicidade, referencia));
  }

  return periodos;
}

export function formatarRotuloPeriodo(periodoInicio: string, periodicidade: Periodicidade) {
  // periodoInicio vem no formato YYYY-MM-DD
  const [ano, mes, dia] = periodoInicio.split("-").map(Number);
  const inicio = new Date(ano, mes - 1, dia);

  if (periodicidade === "semanal") {
    const fim = fimDaSemana(inicio);
    return `${inicio.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} a ${fim.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
  }

  return inicio.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}
