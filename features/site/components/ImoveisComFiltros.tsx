"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { List, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { ImovelSite } from "../types/imovel";
import ImovelMosaico from "./ImovelMosaico";
import ImoveisIntro from "./ImoveisIntro";

const MapaImoveis = dynamic(() => import("./MapaImoveis"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center bg-slate-50">
      <p className="font-sans text-slate-400">Carregando mapa...</p>
    </div>
  ),
});

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const REGIOES = [
  "Porto de Galinhas",
  "Muro Alto",
  "Praia dos Carneiros",
  "Tamandaré",
  "São Miguel dos Milagres",
];

const FAIXAS_PRECO = [
  300000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000,
];

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

interface Props {
  imoveis: ImovelSite[];
  inicial: {
    regiao?: string;
    tipo?: string;
    quartos?: string;
    valor?: string;
  };
}

const classeSelect =
  "w-full border border-slate-200 bg-white p-4 font-sans text-base text-slate-700 outline-none transition focus:border-gold";

const classeRotulo = "rotulo-luxo mb-3 block text-slate-500";

export default function ImoveisComFiltros({ imoveis, inicial }: Props) {
  const regiaoInicial = (() => {
    if (!inicial.regiao) return "";
    const termo = normalizar(inicial.regiao.replace(/-/g, " "));
    const achada = REGIOES.find((r) => {
      const n = normalizar(r);
      return n === termo || n.includes(termo) || termo.includes(n);
    });
    return achada ? normalizar(achada) : termo;
  })();

  const [regiao, setRegiao] = useState(regiaoInicial);
  const [tipo, setTipo] = useState(inicial.tipo ?? "");
  const [quartos, setQuartos] = useState(inicial.quartos ?? "");
  const [precoMin, setPrecoMin] = useState(
    inicial.valor ? inicial.valor.split("-")[0] || "" : ""
  );
  const [precoMax, setPrecoMax] = useState(
    inicial.valor ? inicial.valor.split("-")[1] || "" : ""
  );
  const [modo, setModo] = useState<"lista" | "mapa">("lista");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const tipos = useMemo(
    () =>
      Array.from(
        new Set(imoveis.map((i) => i.tipo).filter((t): t is string => Boolean(t)))
      ).sort(),
    [imoveis]
  );

  const filtrados = useMemo(() => {
    return imoveis.filter((item) => {
      if (regiao) {
        const texto = normalizar(`${item.cidade ?? ""} ${item.bairro ?? ""}`);
        if (!texto.includes(regiao)) return false;
      }
      if (tipo && item.tipo?.toLowerCase() !== tipo.toLowerCase()) return false;
      if (quartos && (item.quartos ?? 0) < Number(quartos)) return false;
      if (precoMin && item.preco < Number(precoMin)) return false;
      if (precoMax && item.preco > Number(precoMax)) return false;
      return true;
    });
  }, [imoveis, regiao, tipo, quartos, precoMin, precoMax]);

  const temFiltro = Boolean(regiao || tipo || quartos || precoMin || precoMax);

  function limpar() {
    setRegiao("");
    setTipo("");
    setQuartos("");
    setPrecoMin("");
    setPrecoMax("");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">

      <ImoveisIntro semResultado={filtrados.length === 0} temFiltro={temFiltro} />

      <div className="mt-12 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-12">

        {/* Filtros */}

        <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">

          <button
            type="button"
            onClick={() => setFiltrosAbertos((v) => !v)}
            className="rotulo-luxo flex w-full items-center justify-between border border-slate-200 bg-white px-5 py-4 text-navy lg:hidden"
          >
            <span className="flex items-center gap-3">
              <SlidersHorizontal size={16} />
              Filtrar imóveis
            </span>
            <span>{filtrados.length}</span>
          </button>

          <div className={`${filtrosAbertos ? "block" : "hidden"} lg:block`}>

            <p className="rotulo-luxo mb-5 mt-6 hidden items-center gap-3 text-navy lg:flex">
              <SlidersHorizontal size={16} />
              Filtrar imóveis
            </p>

            <div className="space-y-6 border border-slate-200 bg-white p-6 lg:mt-0">

              <div>
                <label className={classeRotulo}>Localização</label>
                <select
                  value={regiao}
                  onChange={(e) => setRegiao(e.target.value)}
                  className={classeSelect}
                >
                  <option value="">Todas</option>
                  {REGIOES.map((r) => (
                    <option key={r} value={normalizar(r)}>
                      {r}
                    </option>
                  ))}
                  {regiao && !REGIOES.some((r) => normalizar(r) === regiao) && (
                    <option value={regiao}>{regiao}</option>
                  )}
                </select>
              </div>

              <div>
                <label className={classeRotulo}>Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className={classeSelect}
                >
                  <option value="">Todos</option>
                  {tipos.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  {tipo && !tipos.some((t) => t.toLowerCase() === tipo.toLowerCase()) && (
                    <option value={tipo}>{tipo}</option>
                  )}
                </select>
              </div>

              <div>
                <label className={classeRotulo}>Quartos (mín.)</label>
                <select
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value)}
                  className={classeSelect}
                >
                  <option value="">Qualquer</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className={classeRotulo}>Preço mín.</label>
                <select
                  value={precoMin}
                  onChange={(e) => setPrecoMin(e.target.value)}
                  className={classeSelect}
                >
                  <option value="">Sem mínimo</option>
                  {FAIXAS_PRECO.map((v) => (
                    <option key={v} value={v}>
                      {formatarPreco(v)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={classeRotulo}>Preço máx.</label>
                <select
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                  className={classeSelect}
                >
                  <option value="">Sem máximo</option>
                  {FAIXAS_PRECO.map((v) => (
                    <option key={v} value={v}>
                      {formatarPreco(v)}
                    </option>
                  ))}
                </select>
              </div>

              {temFiltro && (
                <button
                  type="button"
                  onClick={limpar}
                  className="rotulo-luxo w-full border border-slate-300 py-4 text-slate-600 transition hover:border-gold hover:text-gold-dark"
                >
                  Limpar filtros
                </button>
              )}

            </div>
          </div>

        </aside>

        {/* Resultados */}

        <div>

          <div className="mb-6 flex items-center justify-between gap-4">

            <p className="rotulo-luxo text-slate-500">
              {filtrados.length} {filtrados.length === 1 ? "imóvel" : "imóveis"}
            </p>

            <div className="inline-flex border border-slate-200 bg-white p-1">

              <button
                onClick={() => setModo("lista")}
                className={`rotulo-luxo flex items-center gap-2 px-4 py-2.5 transition ${
                  modo === "lista"
                    ? "bg-navy text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <List size={16} />
                Lista
              </button>

              <button
                onClick={() => setModo("mapa")}
                className={`rotulo-luxo flex items-center gap-2 px-4 py-2.5 transition ${
                  modo === "mapa"
                    ? "bg-navy text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <MapIcon size={16} />
                Mapa
              </button>

            </div>

          </div>

          {modo === "lista" ? (
            <ImovelMosaico imoveis={filtrados} uniforme />
          ) : (
            <MapaImoveis imoveis={filtrados} />
          )}

        </div>

      </div>

    </div>
  );
}
