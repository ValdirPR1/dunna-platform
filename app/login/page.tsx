"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { login } from "@/features/core/auth/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function handleEntrar(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !senha) {
      toast.error("Preencha e-mail e senha.");
      return;
    }

    setEntrando(true);

    try {
      await login(email, senha);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("E-mail ou senha incorretos.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#101828] p-10 shadow-xl">

        <div className="flex justify-center">
          <Image
            src="/logo/dunna-platform.png"
            alt="Dunna Platform"
            width={190}
            height={55}
            priority
          />
        </div>

        <h1 className="mt-8 text-center font-display text-2xl font-bold text-white">
          Entrar no sistema
        </h1>

        <form onSubmit={handleEntrar} className="mt-8 space-y-4">

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-4 font-sans text-white placeholder:text-slate-500 outline-none focus:border-gold"
          />

          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="Senha"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-4 font-sans text-white placeholder:text-slate-500 outline-none focus:border-gold"
          />

          <button
            type="submit"
            disabled={entrando}
            className="w-full rounded-xl bg-gold py-4 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {entrando ? "Entrando..." : "Entrar"}
          </button>

        </form>

      </div>

    </div>
  );
}
