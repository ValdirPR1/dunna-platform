"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  criarEmpreendimento,
  atualizarEmpreendimento,
} from "../services/empreendimentos.service";
import {
  listarImagens,
  uploadImagem,
  atualizarImagem,
  excluirImagem,
} from "../services/imagens.service";
import {
  listarPlantas,
  uploadPlanta,
  salvarPlanta,
  excluirPlanta,
} from "../services/plantas.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Stepper from "@/components/ui/form/Stepper";

import StepDadosGerais from "./StepDadosGerais";
import StepLocalizacao from "./StepLocalizacao";
import StepCaracteristicas from "./StepCaracteristicas";
import StepComodidades from "./StepComodidades";
import StepFotos from "./StepFotos";
import StepPlantas, { ItemPlanta } from "./StepPlantas";
import StepPublicacao from "./StepPublicacao";

import {
  empreendimentoSchema,
  EmpreendimentoFormData,
} from "./schema";

import { ItemFoto } from "@/features/imoveis/components/GerenciadorFotos";

const steps = [
  "Dados",
  "Localização",
  "Características",
  "Lazer",
  "Fotos",
  "Plantas",
  "Publicação",
];

interface Props {
  modo?: "criar" | "editar";
  empreendimentoId?: string;
  initialData?: Partial<EmpreendimentoFormData>;
  comodidadesIniciais?: string[];
}

export default function EmpreendimentoWizard({
  modo = "criar",
  empreendimentoId,
  initialData,
  comodidadesIniciais,
}: Props) {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [salvando, setSalvando] = useState(false);

  const [comodidades, setComodidades] = useState<string[]>(
    comodidadesIniciais ?? []
  );

  const [fotos, setFotos] = useState<ItemFoto[]>([]);
  const [capaKey, setCapaKey] = useState<string | null>(null);
  const [fotosRemovidas, setFotosRemovidas] = useState<string[]>([]);

  const [plantas, setPlantas] = useState<ItemPlanta[]>([]);
  const [plantasRemovidas, setPlantasRemovidas] = useState<string[]>([]);

  const form = useForm<EmpreendimentoFormData>({
    resolver: zodResolver(empreendimentoSchema),

    defaultValues: {
      publicado: false,
      status: "Em lançamento",
    },
  });

  const chaveRascunho = `dunna-rascunho-empreendimento-${
    empreendimentoId ?? "novo"
  }`;

  useEffect(() => {
    if (initialData) {
      form.reset(initialData as EmpreendimentoFormData);
    }
  }, [initialData]);

  // Restaura um rascunho salvo automaticamente, se existir
  useEffect(() => {
    const salvo = localStorage.getItem(chaveRascunho);
    if (!salvo) return;

    try {
      const rascunho = JSON.parse(salvo);
      form.reset(rascunho);
      toast.success("Rascunho recuperado do que você tinha digitado antes.");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salva automaticamente enquanto a pessoa digita (rede de segurança
  // contra a aba recarregar sozinha, ex: economizador de memória do Chrome)
  useEffect(() => {
    const assinatura = form.watch((valores) => {
      localStorage.setItem(chaveRascunho, JSON.stringify(valores));
    });

    return () => assinatura.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    if (comodidadesIniciais) {
      setComodidades(comodidadesIniciais);
    }
  }, [comodidadesIniciais]);

  useEffect(() => {
    if (modo !== "editar" || !empreendimentoId) return;

    listarImagens(empreendimentoId)
      .then((imagens) => {
        const itens: ItemFoto[] = imagens.map((img: any) => ({
          key: img.id,
          url: img.url,
          existingId: img.id,
        }));

        setFotos(itens);

        const capa = imagens.find((img: any) => img.capa);
        setCapaKey(capa?.id ?? itens[0]?.key ?? null);
      })
      .catch(() => {});

    listarPlantas(empreendimentoId)
      .then((dados) => {
        const itens: ItemPlanta[] = dados.map((p) => ({
          key: p.id,
          tipologia: p.tipologia,
          area: p.area ? String(p.area) : "",
          preco: p.preco_a_partir ? String(p.preco_a_partir) : "",
          url: p.imagem_url,
          existingId: p.id,
        }));
        setPlantas(itens);
      })
      .catch(() => {});
  }, [modo, empreendimentoId]);

  function adicionarFotos(arquivos: FileList | null) {
    if (!arquivos) return;

    const novos: ItemFoto[] = Array.from(arquivos).map((file) => ({
      key: `${file.name}-${file.lastModified}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setFotos((prev) => {
      const atualizado = [...prev, ...novos];
      if (!capaKey && atualizado.length > 0) {
        setCapaKey(atualizado[0].key);
      }
      return atualizado;
    });
  }

  function removerFoto(key: string) {
    const item = fotos.find((f) => f.key === key);

    if (item?.existingId) {
      setFotosRemovidas((prev) => [...prev, item.existingId as string]);
    }

    setFotos((prev) => {
      const atualizado = prev.filter((item) => item.key !== key);
      if (capaKey === key) {
        setCapaKey(atualizado[0]?.key ?? null);
      }
      return atualizado;
    });
  }

  function moverFoto(key: string, direcao: "esquerda" | "direita") {
    setFotos((prev) => {
      const index = prev.findIndex((item) => item.key === key);
      const novoIndex = direcao === "esquerda" ? index - 1 : index + 1;

      if (novoIndex < 0 || novoIndex >= prev.length) return prev;

      const copia = [...prev];
      [copia[index], copia[novoIndex]] = [copia[novoIndex], copia[index]];
      return copia;
    });
  }

  function adicionarPlanta(item: ItemPlanta) {
    setPlantas((prev) => [...prev, item]);
  }

  function removerPlanta(key: string) {
    const item = plantas.find((p) => p.key === key);
    if (item?.existingId) {
      setPlantasRemovidas((prev) => [...prev, item.existingId as string]);
    }
    setPlantas((prev) => prev.filter((p) => p.key !== key));
  }

  async function salvarFotos(idDoEmpreendimento: string) {
    for (const fotoId of fotosRemovidas) {
      await excluirImagem(fotoId);
    }

    for (let i = 0; i < fotos.length; i++) {
      const item = fotos[i];
      const ehCapa = item.key === capaKey;

      if (item.existingId) {
        await atualizarImagem(item.existingId, {
          ordem: i,
          capa: ehCapa,
        });
      } else if (item.file) {
        await uploadImagem(idDoEmpreendimento, item.file, i, ehCapa);
      }
    }
  }

  async function salvarPlantas(idDoEmpreendimento: string) {
    for (const plantaId of plantasRemovidas) {
      await excluirPlanta(plantaId);
    }

    for (let i = 0; i < plantas.length; i++) {
      const item = plantas[i];

      // Plantas já existentes (modo editar) não têm campos editáveis
      // depois de cadastradas nessa versão — só as novas são enviadas.
      if (item.existingId) continue;

      if (item.file) {
        const url = await uploadPlanta(idDoEmpreendimento, item.file);

        await salvarPlanta({
          empreendimento_id: idDoEmpreendimento,
          tipologia: item.tipologia,
          area: item.area ? Number(item.area) : null,
          preco_a_partir: item.preco ? Number(item.preco) : null,
          imagem_url: url,
          ordem: i,
        });
      }
    }
  }

  async function salvar(data: EmpreendimentoFormData) {
    setSalvando(true);

    try {
      if (modo === "editar" && empreendimentoId) {
        const { error } = await atualizarEmpreendimento(
          empreendimentoId,
          data,
          comodidades
        );

        if (error) {
          toast.error(error.message);
          return;
        }

        await salvarFotos(empreendimentoId);
        await salvarPlantas(empreendimentoId);

        toast.success("Empreendimento atualizado!");
        localStorage.removeItem(chaveRascunho);
        router.push(`/empreendimentos/${empreendimentoId}`);
        return;
      }

      const { data: empreendimento, error } =
        await criarEmpreendimento(data, comodidades);

      if (error) {
        toast.error(error.message);
        return;
      }

      await salvarFotos(empreendimento.id);
      await salvarPlantas(empreendimento.id);

      toast.success("Empreendimento criado!");
      localStorage.removeItem(chaveRascunho);

      router.push(`/empreendimentos/${empreendimento.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar todas as informações.");
    } finally {
      setSalvando(false);
    }
  }

  return (

    <form
      onSubmit={form.handleSubmit(salvar, (erros) => {
        const primeiro = Object.values(erros)[0];
        const mensagem =
          (primeiro as any)?.message ??
          "Verifique se preencheu Nome e Cidade (nas abas Dados/Localização) antes de salvar.";
        toast.error(mensagem);
      })}
      className="space-y-8"
    >

      <Stepper
        current={step}
        steps={steps}
        onStepClick={setStep}
      />

      {step === 0 && (
        <StepDadosGerais
          register={form.register}
        />
      )}

      {step === 1 && (
        <StepLocalizacao
          register={form.register}
        />
      )}

      {step === 2 && (
        <StepCaracteristicas
          register={form.register}
        />
      )}

      {step === 3 && (
        <StepComodidades
          selecionadas={comodidades}
          onChange={setComodidades}
        />
      )}

      {step === 4 && (
        <StepFotos
          itens={fotos}
          capaKey={capaKey}
          onAdicionar={adicionarFotos}
          onSetCapa={setCapaKey}
          onMover={moverFoto}
          onRemover={removerFoto}
        />
      )}

      {step === 5 && (
        <StepPlantas
          itens={plantas}
          onAdicionar={adicionarPlanta}
          onRemover={removerPlanta}
        />
      )}

      {step === 6 && (
        <StepPublicacao
          register={form.register}
        />
      )}

      <div className="flex justify-between">

        <button
          type="button"
          disabled={step === 0}
          onClick={(e) => {
            e.preventDefault();
            setStep(step - 1);
          }}
          className="rounded-xl border border-slate-300 px-6 py-3"
        >
          Voltar
        </button>

        {step < steps.length - 1 ? (

          <button
            key="botao-proximo"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setStep(step + 1);
            }}
            className="rounded-xl bg-[#C8A96A] px-6 py-3 font-semibold text-white"
          >
            Próximo
          </button>

        ) : (

          <button
            key="botao-salvar"
            type="submit"
            disabled={salvando}
            className="rounded-xl bg-[#101828] px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {salvando
              ? "Salvando..."
              : modo === "editar"
              ? "Salvar Alterações"
              : "Salvar Empreendimento"}
          </button>

        )}

      </div>

    </form>

  );

}
