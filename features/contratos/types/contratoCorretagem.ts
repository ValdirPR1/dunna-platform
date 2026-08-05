export interface ContratoCorretagemFormData {
  // Cliente (contratante) — quem contratou/pagou o serviço de corretagem
  clienteNome: string;
  clienteCpf: string;
  clienteEndereco: string;

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
  clienteNome: "",
  clienteCpf: "",
  clienteEndereco: "",

  imovelDescricao: "",

  valorVenda: "",
  valorCorretagem: "",
  formaPagamentoCorretagem: "à vista, via transferência/Pix",

  corretorResponsavel: "",
  corretorCreci: "",

  cidadeAssinatura: "Recife – PE",
  dataAssinatura: new Date().toISOString().split("T")[0],
};
