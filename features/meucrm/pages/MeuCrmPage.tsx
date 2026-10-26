"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3, Bell, CalendarDays, CheckSquare, Users } from "lucide-react";
import { ClienteCrm, TarefaCrm } from "../types";
import { listarClientes, listarTarefas } from "../services/meucrm.service";
import { useAlertasTarefas } from "../hooks/useAlertasTarefas";
import PainelGraficos from "../components/PainelGraficos";
import ListaClientes from "../components/ListaClientes";
import ListaTarefas from "../components/ListaTarefas";
import AgendaMes from "../components/AgendaMes";
import ClienteModal from "../components/ClienteModal";
import ClienteDetalhe from "../components/ClienteDetalhe";
import TarefaModal from "../components/TarefaModal";

type Aba = "painel" | "clientes" | "agenda" | "tarefas";

const ABAS: { id: Aba; label: string; icon: typeof Users }[] = [
  { id: "painel", label: "Painel", icon: BarChart3 },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "tarefas", label: "Tarefas", icon: CheckSquare },
];

export default function MeuCrmPage() {
  const [aba, setAba] = useState<Aba>("painel");
  const [clientes, setClientes] = useState<ClienteCrm[]>([]);
  const [tarefas, setTarefas] = useState<TarefaCrm[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [clienteModal, setClienteModal] = useState<{ aberto: boolean; cliente: ClienteCrm | null }>({ aberto: false, cliente: null });
  const [detalhe, setDetalhe] = useState<ClienteCrm | null>(null);
  const [tarefaModal, setTarefaModal] = useState<{
    aberto: boolean;
    tarefa: TarefaCrm | null;
    clienteId: string | null;
    data: Date | null;
  }>({ aberto: false, tarefa: null, clienteId: null, data: null });

  const [permissao, setPermissao] = useState<string>("default");

  const carregar = useCallback(async () => {
    try {
      const [c, t] = await Promise.all([listarClientes(), listarTarefas()]);
      setClientes(c);
      setTarefas(t);
      // mantém o painel lateral do cliente atualizado
      setDetalhe((atual) => (atual ? c.find((x) => x.id === atual.id) ?? null : null));
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível carregar. Rodou a migração do Meu CRM no Supabase?");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    if (typeof Notification !== "undefined") setPermissao(Notification.permission);
  }, [carregar]);

  useAlertasTarefas(tarefas);

  async function ativarAlertas() {
    if (typeof Notification === "undefined") {
      toast.error("Este navegador não suporta notificações.");
      return;
    }
    const r = await Notification.requestPermission();
    setPermissao(r);
    if (r === "granted") toast.success("Alertas ativados neste navegador!");
  }

  const abertas = tarefas.filter((t) => !t.concluida);
  const atrasadas = abertas.filter((t) => new Date(t.data_hora).getTime() < Date.now()).length;

  return (
    <div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Meu CRM</h1>
          <p className="font-sans text-sm text-slate-500">
            Só você vê estes clientes — separados do CRM da Dunna.
          </p>
        </div>

        {permissao !== "granted" && (
          <button onClick={ativarAlertas} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-sans text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Bell size={16} /> Ativar alertas no navegador
          </button>
        )}
      </div>

      {atrasadas > 0 && (
        <button onClick={() => setAba("tarefas")} className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 p-3 text-left font-sans text-sm font-medium text-red-700">
          ⚠️ Você tem {atrasadas} {atrasadas === 1 ? "tarefa atrasada" : "tarefas atrasadas"}. Clique para ver.
        </button>
      )}

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-200">
        {ABAS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 font-sans text-sm font-semibold transition ${
              aba === a.id ? "border-gold text-navy" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <a.icon size={16} />
            {a.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {carregando ? (
          <p className="font-sans text-slate-400">Carregando...</p>
        ) : (
          <>
            {aba === "painel" && <PainelGraficos clientes={clientes} tarefas={tarefas} />}

            {aba === "clientes" && (
              <ListaClientes
                clientes={clientes}
                onNovo={() => setClienteModal({ aberto: true, cliente: null })}
                onAbrir={setDetalhe}
              />
            )}

            {aba === "agenda" && (
              <AgendaMes
                tarefas={tarefas}
                clientes={clientes}
                onNovaNoDia={(d) => setTarefaModal({ aberto: true, tarefa: null, clienteId: null, data: d })}
                onEditar={(t) => setTarefaModal({ aberto: true, tarefa: t, clienteId: null, data: null })}
              />
            )}

            {aba === "tarefas" && (
              <ListaTarefas
                tarefas={tarefas}
                clientes={clientes}
                onNova={() => setTarefaModal({ aberto: true, tarefa: null, clienteId: null, data: null })}
                onEditar={(t) => setTarefaModal({ aberto: true, tarefa: t, clienteId: null, data: null })}
                onMudou={carregar}
              />
            )}
          </>
        )}
      </div>

      <ClienteDetalhe
        cliente={detalhe}
        tarefas={tarefas}
        onFechar={() => setDetalhe(null)}
        onEditar={(c) => setClienteModal({ aberto: true, cliente: c })}
        onNovaTarefa={(c) => setTarefaModal({ aberto: true, tarefa: null, clienteId: c.id, data: null })}
        onMudou={carregar}
      />

      <ClienteModal
        aberto={clienteModal.aberto}
        cliente={clienteModal.cliente}
        onFechar={() => setClienteModal({ aberto: false, cliente: null })}
        onSalvo={carregar}
      />

      <TarefaModal
        aberto={tarefaModal.aberto}
        tarefa={tarefaModal.tarefa}
        clientes={clientes}
        clientePadraoId={tarefaModal.clienteId}
        dataInicial={tarefaModal.data}
        onFechar={() => setTarefaModal({ aberto: false, tarefa: null, clienteId: null, data: null })}
        onSalvo={carregar}
      />

    </div>
  );
}
