"use client";

import {

Search,

Bell,

Command,

} from "lucide-react";

export default function Header(){

    return(

        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#ECEEF3] bg-white px-10">

            <div className="flex items-center gap-4">

                <div className="flex h-12 w-[420px] items-center rounded-2xl border border-[#E4E7EC] bg-[#F8F9FB] px-4">

                    <Search

                        size={18}

                        className="text-slate-400"

                    />

                    <input

                        placeholder="Pesquisar imóveis, clientes, empreendimentos..."

                        className="ml-3 flex-1 bg-transparent outline-none"

                    />

                    <Command

                        size={16}

                        className="text-slate-400"

                    />

                </div>

            </div>

            <div className="flex items-center gap-5">

                <button className="relative">

                    <Bell size={22}/>

                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"/>

                </button>

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C8A96A] font-semibold text-white">

                        VP

                    </div>

                    <div>

                        <p className="font-semibold">

                            Valdir Pereira

                        </p>

                        <p className="text-sm text-slate-500">

                            CEO • Dunna

                        </p>

                    </div>

                </div>

            </div>

        </header>

    );

}