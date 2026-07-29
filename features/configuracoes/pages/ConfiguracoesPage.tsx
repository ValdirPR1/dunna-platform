"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bell, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/features/core/auth/useAuth";
import {
  Usuario,
  atualizarMeuNome,
  atualizarUsuario,
  excluirUsuario,
  listarUsuarios,
  obterConfiguracoes,
  salvarConfiguracao,
  trocarMinhaSenha,
} from "../services/configuracoes.service";
import NovoUsuarioModal from "../components/NovoUsuarioModal";
import OtimizarFotosPainel from "../components/OtimizarFotosPainel";
import {
  ativarNotificacoesPush,
  desativarNotificacoesPush,
  dispositivoJaInscrito,
  pushEstaDisponivel,
} from "@/features/notificacoes/services/pushCliente.service";

const ABAS = [
  "Usuários",
  "Empresa",
  "Minha Conta",
  "Integrações",
  "Otimizar Fotos",
] as const;
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

      <div
        className="mt-8 flex gap-2 overflow-x-auto border-b border-slate-200 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >

        {ABAS.map((item) => (
          <button
            key={item}
            onClick={() => setAba(item)}
            className={`shrink-0 whitespace-nowrap px-5 py-3 font-sans font-semibold transition ${
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

        {aba === "Usuários" && <AbaUsuarios usuarioLogadoId={usuario?.id ?? null} />}
        {aba === "Empresa" && <AbaEmpresa />}
        {aba === "Minha Conta" && usuario && <AbaMinhaConta usuario={usuario} />}
        {aba === "Integrações" && <AbaIntegracoes />}
        {aba === "Otimizar Fotos" && <OtimizarFotosPainel />}

      </div>

    </div>
  );
}

// ===== Aba Usuários =====

function AbaUsuarios({
  usuarioLogadoId,
}: {
  usuarioLogadoId: string | null;
}) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeEditando, setNomeEditando] = useState<Record<string, string>>({});
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

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

  async function salvarNome(u: Usuario) {
    const novoNome = (nomeEditando[u.id] ?? u.nome).trim();

    if (!novoNome || novoNome === u.nome) return;

    try {
      await atualizarUsuario(u.id, { nome: novoNome });
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o nome.");
    }
  }

  async function handleExcluir(u: Usuario) {
    if (u.id === usuarioLogadoId) {
      toast.error("Você não pode excluir o próprio usuário.");
      return;
    }

    const confirmado = window.confirm(
      `Remover o acesso de "${u.nome}"? Essa pessoa não vai mais conseguir fazer login. Essa ação não pode ser desfeita.`
    );
    if (!confirmado) return;

    setExcluindoId(u.id);
    try {
      await excluirUsuario(u.id);
      toast.success("Usuário removido.");
      carregar();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message ?? "Não foi possível excluir o usuário.");
    } finally {
      setExcluindoId(null);
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

        <div className="overflow-x-auto rounded-2xl border border-slate-200">

          <table className="w-full min-w-[600px]">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left font-sans text-slate-500">Nome</th>
                <th className="px-5 py-4 text-left font-sans text-slate-500">E-mail</th>
                <th className="px-5 py-4 text-left font-sans text-slate-500">Papel</th>
                <th className="px-5 py-4 text-center font-sans text-slate-500">Ativo</th>
                <th className="px-5 py-4 text-center font-sans text-slate-500" />
              </tr>
            </thead>

            <tbody>

              {usuarios.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">

                  <td className="px-5 py-4">
                    <input
                      value={nomeEditando[u.id] ?? u.nome}
                      onChange={(e) =>
                        setNomeEditando((atual) => ({
                          ...atual,
                          [u.id]: e.target.value,
                        }))
                      }
                      onBlur={() => salvarNome(u)}
                      className="w-full rounded-lg border border-transparent bg-transparent p-2 font-sans text-navy outline-none transition hover:border-slate-200 focus:border-gold focus:bg-slate-50"
                    />
                  </td>

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

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleExcluir(u)}
                      disabled={excluindoId === u.id || u.id === usuarioLogadoId}
                      title={
                        u.id === usuarioLogadoId
                          ? "Você não pode excluir o próprio usuário"
                          : "Excluir usuário"
                      }
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Trash2 size={16} />
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
    empresa_youtube: "",
    empresa_email: "",
    marca_dagua_ativa: "false",
    email_notificacao_master: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obterConfiguracoes().then((dados) => {
      setForm({
        empresa_whatsapp: dados.empresa_whatsapp ?? "",
        empresa_endereco: dados.empresa_endereco ?? "",
        empresa_instagram: dados.empresa_instagram ?? "",
        empresa_youtube: dados.empresa_youtube ?? "",
        empresa_email: dados.empresa_email ?? "",
        marca_dagua_ativa: dados.marca_dagua_ativa ?? "false",
        email_notificacao_master: dados.email_notificacao_master ?? "",
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

        <input
          value={form.empresa_youtube}
          onChange={(e) => setForm({ ...form, empresa_youtube: e.target.value })}
          placeholder="YouTube (ex: @dunnaimob ou link do canal)"
          className={inputClass}
        />

      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">

        <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={form.marca_dagua_ativa === "true"}
            onChange={(e) =>
              setForm({
                ...form,
                marca_dagua_ativa: e.target.checked ? "true" : "false",
              })
            }
            className="mt-1 h-5 w-5 accent-gold"
          />
          <span>
            <span className="block font-sans font-semibold text-navy">
              Aplicar marca d'água nas fotos
            </span>
            <span className="block font-sans text-sm text-slate-500">
              Coloca a logo discretamente no canto de toda foto nova
              enviada (imóveis, empreendimentos e plantas). Não afeta
              fotos já cadastradas.
            </span>
          </span>
        </label>

      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">

        <label className="mb-2 block font-sans font-semibold text-navy">
          E-mail pra receber aviso de leads novos
        </label>

        <p className="mb-3 font-sans text-sm text-slate-500">
          Toda vez que um lead novo entrar (pelo site ou cadastrado
          manualmente), esse e-mail recebe um aviso.
        </p>

        <input
          value={form.email_notificacao_master}
          onChange={(e) =>
            setForm({ ...form, email_notificacao_master: e.target.value })
          }
          type="email"
          placeholder="seuemail@exemplo.com"
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
  return (
    <div className="max-w-2xl space-y-6">
      <NotificacoesPushCard usuarioId={usuario.id} />
      <MinhaContaCampos usuario={usuario} />
    </div>
  );
}

// ===== Notificações push (dispositivo) =====

function NotificacoesPushCard({ usuarioId }: { usuarioId: string }) {
  const [suportado, setSuportado] = useState(true);
  const [inscrito, setInscrito] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const disponivel = pushEstaDisponivel();
    setSuportado(disponivel);

    if (!disponivel) {
      setCarregando(false);
      return;
    }

    dispositivoJaInscrito()
      .then(setInscrito)
      .finally(() => setCarregando(false));
  }, []);

  async function ativar() {
    setProcessando(true);
    try {
      const resultado = await ativarNotificacoesPush(usuarioId);

      if (resultado.ok) {
        setInscrito(true);
        toast.success("Notificações ativadas neste dispositivo!");
      } else if (resultado.motivo === "permissao_negada") {
        toast.error(
          "Permissão negada. Ative nas configurações de notificação do navegador."
        );
      } else {
        toast.error("Não foi possível ativar as notificações agora.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível ativar as notificações agora.");
    } finally {
      setProcessando(false);
    }
  }

  async function desativar() {
    setProcessando(true);
    try {
      await desativarNotificacoesPush();
      setInscrito(false);
      toast.success("Notificações desativadas neste dispositivo.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível desativar agora.");
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
          <Bell size={18} />
        </div>
        <h2 className="font-display text-xl font-bold text-navy">
          Notificações neste dispositivo
        </h2>
      </div>

      <p className="mt-4 font-sans text-sm text-slate-500">
        Receba um aviso direto no celular quando chegar um lead novo, uma
        tarefa da agenda estiver perto do horário, ou um lead ficar
        parado sem movimentação.
      </p>

      {carregando ? (
        <p className="mt-6 font-sans text-sm text-slate-400">Verificando...</p>
      ) : !suportado ? (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 font-sans text-sm text-amber-700">
          Seu navegador não suporta notificações agora. No iPhone, primeiro
          adicione o app à tela de início (Compartilhar → Adicionar à Tela
          de Início) e abra o app por esse ícone antes de tentar ativar.
        </p>
      ) : (
        <button
          onClick={inscrito ? desativar : ativar}
          disabled={processando}
          className={`mt-6 rounded-xl px-8 py-3 font-sans font-semibold transition disabled:opacity-60 ${
            inscrito
              ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
              : "bg-gold text-white hover:bg-gold-dark"
          }`}
        >
          {processando
            ? "Aguarde..."
            : inscrito
            ? "Desativar notificações"
            : "Ativar notificações neste dispositivo"}
        </button>
      )}
    </div>
  );
}

// ===== Campos de conta (nome, senha) =====

function MinhaContaCampos({ usuario }: { usuario: { id: string; nome: string } }) {
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
    <>

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

    </>
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
