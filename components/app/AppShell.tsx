"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/features/core/auth/useAuth";

interface Props {
  children: ReactNode;
  somenteMaster?: boolean;
}

export default function AppShell({ children, somenteMaster }: Props) {
  const router = useRouter();
  const { usuario, loading } = useAuth();

  useEffect(() => {
    if (!loading && !usuario) {
      router.push("/login");
    }
  }, [loading, usuario, router]);

  useEffect(() => {
    if (!loading && usuario && somenteMaster && usuario.papel !== "master") {
      router.push("/dashboard");
    }
  }, [loading, usuario, somenteMaster, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <p className="font-sans text-slate-400">Carregando...</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  if (somenteMaster && usuario.papel !== "master") {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar papel={usuario.papel} />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header usuario={usuario} />

        <main className="flex-1 overflow-y-auto bg-slate-100 p-8">

          {children}

        </main>

      </div>

    </div>
  );
}
