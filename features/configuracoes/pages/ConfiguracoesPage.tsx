"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { useAuth } from "@/features/core/auth/useAuth";
import {
  Usuario,
  atualizarMeuNome,
  atualizarUsuario,
  listarUsuarios,
  obterConfiguracoes,
  salvarConfiguracao,
  trocarMinhaSenha,
} from "../services/configuracoes.service";
import NovoUsuarioModal from "../components/NovoUsuarioModal";

const ABAS = ["Usuários", "Empresa", "Minha Conta", "Integrações"] as const;
type Aba = (typeof ABAS)[number];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold";

export default function ConfiguracoesPage() {
  const { usuario } = useAuth();
  const [aba, setAba] = useState<Aba>("Usuários");

  return (
    <div>

      <h1 className="font-display text-3xl font-bold text-navy">
        Configurações
      </h1>

      <p className="mt-2 font-sans text-slate-500">
        Gerencie usuários, dados da empresa e preferências do sistema.
      </p>

      <div className="mt-8 flex gap-2 border-b border-slate-200">

        {ABAS.map((item) => (
          <button
            key={item}
            onClick={() => setAba(item)}
            className={`px-5 py-3 font-sans font-semibold transition ${
              aba === item
                ? "border-b-2 border-gold text-navy"
                : "text-slate-400 hover:text-navy"
            }`}
          >
            {item}
          </button>
        ))}

      </div>

      <div className="mt-8">

        {aba === "Usuários" && <AbaUsuarios />}
        {aba === "Empresa" && <AbaEmpresa />}
        {aba === "Minha Conta" && usuario && <AbaMinhaConta usuario={usuario} />}
        {aba === "Integrações" && <AbaIntegracoes />}

      </div>

    </div>
  );
}

// ===== Aba Usuários =====

function AbaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const dados = await listarUsuarios();
      setUsuarios(dados);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function alternarAtivo(u: Usuario) {
    try {
      await atualizarUsuario(u.id, { ativo: !u.ativo });
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o usuário.");
    }
  }

  async function alterarPapel(u: Usuario, papel: string) {
    try {
      await atualizarUsuario(u.id, { papel });
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o papel.");
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="font-display text-xl font-bold text-navy">
          Usuários com acesso
        </h2>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          <Plus size={18} />
          Novo Usuário
        </button>

      </div>

      {loading ? (
        <p className="font-sans text-slate-400">Carregando...</p>
      ) : usuarios.length === 0 ? (
        <p className="font-sans text-slate-400">Nenhum usuário cadastrado.</p>
      ) : (

        <div className="overflow-hidden rounded-2xl border border-slate-200">

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left font-sans text-slate-500">Nome</th>
                <th className="px-5 py-4 text-left font-sans text-slate-500">E-mail</th>
                <th className="px-5 py-4 text-left font-sans text-slate-500">Papel</th>
                <th className="px-5 py-4 text-center font-sans text-slate-500">Ativo</th>
              </tr>
            </thead>

            <tbody>

              {usuarios.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">

                  <td className="px-5 py-4 font-sans text-navy">{u.nome}</td>

                  <td className="px-5 py-4 font-sans text-slate-500">{u.email}</td>

                  <td className="px-5 py-4">
                    <select
                      value={u.papel}
                      onChange={(e) => alterarPapel(u, e.target.value)}
                      className="rounded-lg border border-slate-200 p-2 font-sans text-sm"
                    >
                      <option value="corretor">Corretor</option>
                      <option value="master">Master</option>
                    </select>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => alternarAtivo(u)}
                      className={`rounded-full px-4 py-1 font-sans text-xs font-semibold ${
                        u.ativo
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {u.ativo ? "Ativo" : "Inativo"}
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      )}

      <NovoUsuarioModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSaved={carregar}
      />

    </div>
  );
}

// ===== Aba Empresa =====

function AbaEmpresa() {
  const [form, setForm] = useState({
    empresa_whatsapp: "",
    empresa_endereco: "",
    empresa_instagram: "",
    empresa_email: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obterConfiguracoes().then((dados) => {
      setForm({
        empresa_whatsapp: dados.empresa_whatsapp ?? "",
        empresa_endereco: dados.empresa_endereco ?? "",
        empresa_instagram: dados.empresa_instagram ?? "",
        empresa_email: dados.empresa_email ?? "",
      });
      setLoading(false);
    });
  }, []);

  async function salvar() {
    setSalvando(true);
    try {
      await Promise.all(
        Object.entries(form).map(([chave, valor]) =>
          salvarConfiguracao(chave, valor)
        )
      );
      toast.success("Dados da empresa salvos!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <p className="font-sans text-slate-400">Carregando...</p>;

  return (
    <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="font-display text-xl font-bold text-navy">
        Dados da empresa
      </h2>

      <p className="mt-2 font-sans text-sm text-slate-500">
        Usados no site público e nos botões de contato.
      </p>

      <div className="mt-6 space-y-4">

        <input
          value={form.empresa_whatsapp}
          onChange={(e) => setForm({ ...form, empresa_whatsapp: e.target.value })}
          placeholder="WhatsApp (com DDI, ex: 5581999999999)"
          className={inputClass}
        />

        <input
          value={form.empresa_email}
          onChange={(e) => setForm({ ...form, empresa_email: e.target.value })}
          placeholder="E-mail de contato"
          className={inputClass}
        />

        <input
          value={form.empresa_endereco}
          onChange={(e) => setForm({ ...form, empresa_endereco: e.target.value })}
          placeholder="Endereço do escritório"
          className={inputClass}
        />

        <input
          value={form.empresa_instagram}
          onChange={(e) => setForm({ ...form, empresa_instagram: e.target.value })}
          placeholder="Instagram (ex: @dunnaplatform)"
          className={inputClass}
        />

      </div>

      <button
        onClick={salvar}
        disabled={salvando}
        className="mt-8 rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Salvar Alterações"}
      </button>

    </div>
  );
}

// ===== Aba Minha Conta =====

function AbaMinhaConta({ usuario }: { usuario: { id: string; nome: string } }) {
  const [nome, setNome] = useState(usuario.nome);
  const [novaSenha, setNovaSenha] = useState("");
  const [salvandoNome, setSalvandoNome] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  async function salvarNome() {
    setSalvandoNome(true);
    try {
      await atualizarMeuNome(usuario.id, nome);
      toast.success("Nome atualizado!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o nome.");
    } finally {
      setSalvandoNome(false);
    }
  }

  async function salvarSenha() {
    if (novaSenha.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setSalvandoSenha(true);
    try {
      await trocarMinhaSenha(novaSenha);
      toast.success("Senha atualizada!");
      setNovaSenha("");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível trocar a senha.");
    } finally {
      setSalvandoSenha(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Meu nome
        </h2>

        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={inputClass + " mt-4"}
        />

        <button
          onClick={salvarNome}
          disabled={salvandoNome}
          className="mt-4 rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
        >
          {salvandoNome ? "Salvando..." : "Salvar Nome"}
        </button>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Trocar senha
        </h2>

        <input
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          type="password"
          placeholder="Nova senha"
          className={inputClass + " mt-4"}
        />

        <button
          onClick={salvarSenha}
          disabled={salvandoSenha}
          className="mt-4 rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
        >
          {salvandoSenha ? "Salvando..." : "Trocar Senha"}
        </button>

      </div>

    </div>
  );
}

// ===== Aba Integrações =====

function AbaIntegracoes() {
  const [chave, setChave] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obterConfiguracoes().then((dados) => {
      setChave(dados.google_maps_api_key ?? "");
      setLoading(false);
    });
  }, []);

  async function salvar() {
    setSalvando(true);
    try {
      await salvarConfiguracao("google_maps_api_key", chave);
      toast.success("Integração salva!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <p className="font-sans text-slate-400">Carregando...</p>;

  return (
    <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="font-display text-xl font-bold text-navy">
        Google Maps
      </h2>

      <p className="mt-2 font-sans text-sm text-slate-500">
        Chave de API pra mapas interativos (opcional — sem ela, o
        sistema usa um mapa simples que já funciona).
      </p>

      <input
        value={chave}
        onChange={(e) => setChave(e.target.value)}
        placeholder="Cole a chave da API aqui"
        className={inputClass + " mt-4"}
      />

      <button
        onClick={salvar}
        disabled={salvando}
        className="mt-4 rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Salvar"}
      </button>

    </div>
  );
}
