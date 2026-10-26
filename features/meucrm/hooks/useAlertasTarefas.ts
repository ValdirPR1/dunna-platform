"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { TarefaCrm } from "../types";

// Enquanto o Meu CRM estiver aberto, confere a cada 30s se alguma
// tarefa está chegando (próximos 10 min) ou acabou de vencer, e avisa
// na tela e, se a pessoa permitiu, com notificação do navegador.
// (Com o sistema fechado, o aviso vem pelo push da manhã — ver cron.)
export function useAlertasTarefas(tarefas: TarefaCrm[]) {
  const avisadas = useRef<Set<string>>(new Set());

  useEffect(() => {
    function checar() {
      const agora = Date.now();
      for (const t of tarefas) {
        if (t.concluida || avisadas.current.has(t.id)) continue;
        const quando = new Date(t.data_hora).getTime();
        const faltam = quando - agora;
        // de 10 min antes até 2 h depois do horário
        if (faltam <= 10 * 60000 && faltam >= -2 * 60 * 60000) {
          avisadas.current.add(t.id);
          const hora = new Date(t.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          const texto = faltam > 0 ? `Em breve (${hora}): ${t.titulo}` : `Tarefa atrasada (${hora}): ${t.titulo}`;
          toast(texto, { icon: "⏰", duration: 12000 });
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("Meu CRM", { body: texto });
          }
        }
      }
    }

    checar();
    const id = setInterval(checar, 30000);
    return () => clearInterval(id);
  }, [tarefas]);
}
