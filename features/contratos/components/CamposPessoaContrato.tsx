"use client";

import { PessoaContrato } from "../types/contrato";

interface Props {
  dados: PessoaContrato;
  onChange: (campo: keyof PessoaContrato, valor: string) => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-navy outline-none focus:border-gold";
const labelClass =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function CamposPessoaContrato({ dados, onChange }: Props) {
  return (
    <div className="space-y-4">

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Nome completo</label>
          <input
            value={dados.nome}
            onChange={(e) => onChange("nome", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Nascimento</label>
          <input
            type="date"
            value={dados.nascimento}
            onChange={(e) => onChange("nascimento", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelClass}>Nacionalidade</label>
          <input
            value={dados.nacionalidade}
            onChange={(e) => onChange("nacionalidade", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Estado Civil</label>
          <input
            value={dados.estadoCivil}
            onChange={(e) => onChange("estadoCivil", e.target.value)}
            placeholder="Ex: casado(a), solteiro(a)"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Regime de Bens</label>
          <input
            value={dados.regimeBens}
            onChange={(e) => onChange("regimeBens", e.target.value)}
            placeholder="Ex: comunhão parcial"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelClass}>CPF</label>
          <input
            value={dados.cpf}
            onChange={(e) => onChange("cpf", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>RG</label>
          <input
            value={dados.rg}
            onChange={(e) => onChange("rg", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Órgão Emissor</label>
          <input
            value={dados.orgaoEmissor}
            onChange={(e) => onChange("orgaoEmissor", e.target.value)}
            placeholder="Ex: SDS/PE"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>E-mail</label>
          <input
            type="email"
            value={dados.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Telefone</label>
          <input
            value={dados.telefone}
            onChange={(e) => onChange("telefone", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Endereço</label>
        <input
          value={dados.endereco}
          onChange={(e) => onChange("endereco", e.target.value)}
          placeholder="Rua, número, complemento"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className={labelClass}>Bairro</label>
          <input
            value={dados.bairro}
            onChange={(e) => onChange("bairro", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cidade</label>
          <input
            value={dados.cidade}
            onChange={(e) => onChange("cidade", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>UF</label>
          <input
            value={dados.uf}
            onChange={(e) => onChange("uf", e.target.value)}
            maxLength={2}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>CEP</label>
          <input
            value={dados.cep}
            onChange={(e) => onChange("cep", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

    </div>
  );
}
