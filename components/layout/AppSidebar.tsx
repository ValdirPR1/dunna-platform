"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Building2,
    Home,
    Users,
    CalendarDays,
    Wallet,
    Megaphone,
    BrainCircuit,
    Settings,
    ChevronRight
} from "lucide-react";

const menu = [

{
label:"Painel",
href:"/dashboard",
icon:LayoutDashboard
},

{
label:"Inventário",
href:"/imoveis",
icon:Home
},

{
label:"Empreendimentos",
href:"/empreendimentos",
icon:Building2
},

{
label:"Pessoas",
href:"/pessoas",
icon:Users
},

{
label:"Agenda",
href:"/agenda",
icon:CalendarDays
},

{
label:"Financeiro",
href:"/financeiro",
icon:Wallet
},

{
label:"Marketing",
href:"/marketing",
icon:Megaphone
},

{
label:"Advisor IA",
href:"/advisor",
icon:BrainCircuit
}

];

export default function AppSidebar(){

const pathname=usePathname();

return(

<aside className="flex w-[270px] flex-col bg-[#101828] text-white">

<div className="border-b border-white/10 p-8">

<Image

src="/logo/dunna-platform.png"

width={180}

height={50}

alt="Dunna"

/>

</div>

<nav className="flex-1 px-4 py-8">

{menu.map((item)=>{

const Icon=item.icon;

const active=
pathname===item.href||
pathname.startsWith(item.href+"/");

return(

<Link

key={item.href}

href={item.href}

className={`mb-2 flex items-center gap-4 rounded-xl px-4 py-3 transition

${

active

?

"bg-[#C8A96A] text-black shadow"

:

"text-slate-300 hover:bg-white/5"

}

`}

>

<Icon size={20}/>

<span className="font-medium">

{item.label}

</span>

</Link>

);

})}

</nav>

<div className="border-t border-white/10 p-5">

<button className="flex w-full items-center gap-3 rounded-xl p-3 text-slate-300 hover:bg-white/5">

<Settings size={20}/>

Configurações

</button>

</div>

</aside>

);

}