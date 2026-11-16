export interface ContratoCorretagemFormData {
  // Pessoa física (CPF) ou jurídica (CNPJ — construtoras, empresas)
  tipoCliente: "pf" | "pj";

  // Cliente (contratante) — quem contratou/pagou o serviço de corretagem.
  // Em pessoa jurídica, clienteNome guarda a razão social e
  // clienteEndereco o endereço da sede.
  clienteNome: string;
  clienteCpf: string;
  clienteCnpj: string;
  clienteEndereco: string;

  // Representante legal (só pessoa jurídica)
  representanteNome: string;
  representanteCpf: string;
  representanteCargo: string;

  // 2º contratante (opcional — ex: cônjuge, quando o negócio envolve um casal)
  temSegundoContratante: boolean;
  segundoContratanteNome: string;
  segundoContratanteCpf: string;

  // Imóvel vendido
  imovelDescricao: string;

  // Valores do negócio
  valorVenda: string;
  valorCorretagem: string;
  formaPagamentoCorretagem: string;

  // Corretor responsável (assina pela Dunna)
  corretorResponsavel: string;
  corretorCreci: string;

  // Local, data e foro
  cidadeAssinatura: string;
  dataAssinatura: string;
}

export const CONTRATO_CORRETAGEM_VAZIO: ContratoCorretagemFormData = {
  tipoCliente: "pf",
  clienteNome: "",
  clienteCpf: "",
  clienteCnpj: "",
  clienteEndereco: "",

  representanteNome: "",
  representanteCpf: "",
  representanteCargo: "",

  temSegundoContratante: false,
  segundoContratanteNome: "",
  segundoContratanteCpf: "",

  imovelDescricao: "",

  valorVenda: "",
  valorCorretagem: "",
  formaPagamentoCorretagem: "à vista, via transferência/Pix",

  corretorResponsavel: "",
  corretorCreci: "",

  cidadeAssinatura: "Recife – PE",
  dataAssinatura: new Date().toISOString().split("T")[0],
};
