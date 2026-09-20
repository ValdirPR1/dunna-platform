// Dados básicos — bem mais enxuto que o ContratoFormData de compra e
// venda (sem nacionalidade, regime de bens etc.), porque é só uma
// autorização de divulgação/venda, preenchida na hora da captação.
export interface AutorizacaoVendaFormData {
  proprietarioNome: string;
  proprietarioCpf: string;
  proprietarioRg: string;
  proprietarioTelefone: string;
  proprietarioEmail: string;
  proprietarioEndereco: string;

  imovelTipo: string;
  imovelEndereco: string;
  imovelBairro: string;
  imovelCidade: string;
  imovelEstado: string;
  imovelMatricula: string;

  valorPretendido: string;
  percentualComissao: string;

  observacoes: string;

  cidadeAssinatura: string;
  dataAssinatura: string;

  testemunha1Nome: string;
  testemunha1Cpf: string;
  testemunha2Nome: string;
  testemunha2Cpf: string;
}

export const AUTORIZACAO_VENDA_VAZIA: AutorizacaoVendaFormData = {
  proprietarioNome: "",
  proprietarioCpf: "",
  proprietarioRg: "",
  proprietarioTelefone: "",
  proprietarioEmail: "",
  proprietarioEndereco: "",

  imovelTipo: "Apartamento",
  imovelEndereco: "",
  imovelBairro: "",
  imovelCidade: "",
  imovelEstado: "PE",
  imovelMatricula: "",

  valorPretendido: "",
  percentualComissao: "5",

  observacoes: "",

  cidadeAssinatura: "Recife – PE",
  dataAssinatura: new Date().toISOString().split("T")[0],

  testemunha1Nome: "",
  testemunha1Cpf: "",
  testemunha2Nome: "",
  testemunha2Cpf: "",
};
