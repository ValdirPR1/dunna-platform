"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gerarInsights } from "@/features/advisor/services/advisor.service";
import { contarOportunidadesAtivas } from "@/features/crm/services/oportunidades.service";
import { contarTarefasDeHoje } from "@/features/agenda/services/tarefas.service";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
  UserCog,
  Building2,
  Home,
  Sparkles,
  LineChart,
  Globe,
  Megaphone,
  Wallet,
  FileText,
  FileDown,
  ClipboardList,
  Trash2,
  Settings,
  ChevronRight,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
  apenasMaster?: boolean;
  novaAba?: boolean;
};

type MenuSection = {
  title: string;
  apenasMaster?: boolean;
  items: MenuItem[];
};

const sections: MenuSection[] = [
  {
    title: "PAINEL",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
    ],
  },

  {
    title: "CRM",
    items: [
      {
        icon: Users,
        label: "Leads",
        href: "/crm/leads",
      },
      {
        icon: UserRound,
        label: "Clientes",
        href: "/crm/clientes",
      },
      {
        icon: CalendarDays,
        label: "Agenda",
        href: "/agenda",
      },
      {
        icon: FileDown,
        label: "Propostas",
        href: "/propostas/nova",
      },
      {
        icon: FileText,
        label: "Contratos",
        href: "/contratos/novo",
      },
      {
        icon: Trash2,
        label: "Leads Perdidos",
        href: "/crm/leads-perdidos",
        apenasMaster: true,
      },
      {
        icon: UserCog,
        label: "Corretores",
        href: "/corretores",
        apenasMaster: true,
      },
    ],
  },

  {
    title: "IMÓVEIS",
    items: [
      {
        icon: Building2,
        label: "Empreendimentos",
        href: "/empreendimentos",
      },
      {
        icon: Home,
        label: "Imóvel",
        href: "/imoveis",
      },
      {
        icon: ClipboardList,
        label: "Captações",
        href: "/captacoes",
      },
    ],
  },

  {
    title: "INTELIGÊNCIA",
    apenasMaster: true,
    items: [
      {
        icon: Sparkles,
        label: "Advisor IA",
        href: "/advisor",
      },
      {
        icon: LineChart,
        label: "Radar Mercado",
        href: "/mercado",
      },
    ],
  },

  {
    title: "MARKETING",
    apenasMaster: true,
    items: [
      {
        icon: Globe,
        label: "Site",
        href: "/site",
        novaAba: true,
      },
      {
        icon: Megaphone,
        label: "Campanhas",
        href: "/marketing/campanhas",
      },
      {
        icon: Megaphone,
        label: "Landing Pages",
        href: "/landing-pages",
      },
      {
        icon: Megaphone,
        label: "Blog",
        href: "/blog",
      },
    ],
  },

  {
    title: "FINANCEIRO",
    apenasMaster: true,
    items: [
      {
        icon: Wallet,
        label: "Financeiro",
        href: "/financeiro",
      },
      {
        icon: FileText,
        label: "Contratos",
        href: "/contratos",
      },
    ],
  },

  {
    title: "CONFIGURAÇÕES",
    apenasMaster: true,
    items: [
      {
        icon: Settings,
        label: "Configurações",
        href: "/configuracoes",
      },
    ],
  },
];

interface Props {
  papel?: "master" | "corretor";
  aberto?: boolean;
  onFechar?: () => void;
}

export default function Sidebar({
  papel = "master",
  aberto = false,
  onFechar,
}: Props) {
  const pathname = usePathname();
  const [totalAlertas, setTotalAlertas] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalTarefasHoje, setTotalTarefasHoje] = useState(0);

  useEffect(() => {
    if (papel !== "master") return;
    gerarInsights().then((dados) => setTotalAlertas(dados.length));
  }, [papel]);

  // Contagens de Leads e Agenda vêm do banco de verdade — refaz a
  // busca a cada navegação e periodicamente, pra não ficar com
  // número desatualizado enquanto o usuário navega pelo sistema
  useEffect(() => {
    let ativo = true;

    async function atualizarContagens() {
      const [leads, tarefas] = await Promise.all([
        contarOportunidadesAtivas().catch(() => 0),
        contarTarefasDeHoje().catch(() => 0),
      ]);

      if (ativo) {
        setTotalLeads(leads);
        setTotalTarefasHoje(tarefas);
      }
    }

    atualizarContagens();
    const intervalo = setInterval(atualizarContagens, 60000);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [pathname]);

  const badgesDinamicos: Record<string, number> = {
    "/advisor": totalAlertas,
    "/crm/leads": totalLeads,
    "/agenda": totalTarefasHoje,
  };

  const secoesVisiveis = sections
    .filter((secao) => papel === "master" || !secao.apenasMaster)
    .map((secao) => ({
      ...secao,
      items: secao.items.filter(
        (item) => papel === "master" || !item.apenasMaster
      ),
    }));

  return (
    <>

      {/* Fundo escuro atrás do menu, só no celular/tablet, quando aberto */}
      {aberto && (
        <div
          onClick={onFechar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 z-50 flex h-screen w-[290px] shrink-0 flex-col border-r border-slate-800 bg-[#101828] text-white transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          aberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* LOGO */}

      <div className="border-b border-slate-800 px-6 py-6 lg:px-8 lg:py-10">

        <div className="flex justify-center transition duration-300 hover:scale-[1.02]">

          <Image
            src="/logo/dunna-platform.png"
            alt="Dunna Platform"
            width={160}
            height={48}
            style={{ width: "160px", height: "auto" }}
            className="lg:hidden"
            priority
          />

          <Image
            src="/logo/dunna-platform.png"
            alt="Dunna Platform"
            width={200}
            height={60}
            style={{ width: "auto", height: "auto" }}
            className="hidden lg:block"
            priority
          />

        </div>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-3">

          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-sm font-medium text-emerald-300">

            Sistema Online

          </span>

        </div>

      </div>

      {/* MENU */}

      <div className="flex-1 overflow-y-auto px-5 py-8">

        {secoesVisiveis.map((section) => (

          <div key={section.title} className="mb-10">

            <p className="mb-4 px-4 text-[11px] font-bold uppercase tracking-[0.35em] text-slate-500">

              {section.title}

            </p>

            {section.items.map((item) => {

              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (

               <Link
  key={item.href}
  href={item.href}
  target={item.novaAba ? "_blank" : undefined}
  rel={item.novaAba ? "noopener noreferrer" : undefined}
  onClick={onFechar}
  className={`group relative mb-2 flex items-center rounded-2xl px-4 py-3 transition-all duration-300 ${
    active
      ? "bg-slate-800 text-white shadow-lg"
      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
  }`}
>

  {active && (
    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#C8A96A]" />
  )}

  <Icon
    size={18}
    strokeWidth={1.8}
    className={`mr-4 transition-all duration-300 ${
      active
        ? "text-[#C8A96A]"
        : "group-hover:text-[#C8A96A]"
    }`}
  />

  <span className="flex-1 text-[15px] font-semibold tracking-tight">

    {item.label}

  </span>

  {(item.href in badgesDinamicos
    ? badgesDinamicos[item.href]
    : item.badge) ? (
    <div className="flex h-6 min-w-[26px] items-center justify-center rounded-full bg-slate-700 px-2 text-[11px] font-bold text-white">

      {item.href in badgesDinamicos
        ? badgesDinamicos[item.href]
        : item.badge}

    </div>
  ) : null}

  <ChevronRight
    size={16}
    className={`ml-3 transition-all duration-300 ${
      active
        ? "opacity-100 text-[#C8A96A]"
        : "opacity-0 group-hover:opacity-50"
    }`}
  />

</Link>

              );

            })}

          </div>

        ))}

      </div>

      {/* RODAPÉ */}

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur">

          <div className="flex items-center justify-between">

            <p className="text-[11px] font-semibold uppercase tracking-[0.30em] text-slate-500">

              Advisor IA

            </p>

            <Sparkles
              size={16}
              className="text-[#C8A96A]"
            />

          </div>

          <p className="mt-4 text-sm font-medium text-white">

            Sistema saudável

          </p>

          <p className="mt-2 text-xs text-slate-400">

            Nenhum alerta crítico encontrado.

          </p>

          <div className="mt-5 flex items-center">

            <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs text-emerald-300">

              Última sincronização • Agora

            </span>

          </div>

        </div>

        <p className="mt-5 text-center text-xs tracking-wide text-slate-500">

          Dunna Platform v1.0

        </p>

      </div>

    </aside>

    </>
  );
}
