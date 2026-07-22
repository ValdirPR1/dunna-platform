export interface Proponente {
  nome: string;
  nascimento: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  estadoCivil: string;
  profissao: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export const PROPONENTE_VAZIO: Proponente = {
  nome: "",
  nascimento: "",
  cpf: "",
  rg: "",
  orgaoEmissor: "",
  estadoCivil: "",
  profissao: "",
  email: "",
  telefone: "",
  endereco: "",
  bairro: "",
  cidade: "",
  uf: "",
  cep: "",
};

export interface PropostaFormData {
  nomeProduto: string;
  unidade: string;
  bloco: string;

  proponente1: Proponente;
  temSegundoProponente: boolean;
  proponente2: Proponente;

  sinal: string;
  sinalData: string;

  temComplementoSinal: boolean;
  complementoSinal: string;
  complementoSinalParcelas: string;
  complementoSinalData: string;

  mensais: string;
  mensaisParcelas: string;
  mensaisData: string;

  temIntercaladas: boolean;
  intercaladas: string;
  intercaladasParcelas: string;
  intercaladasPeriodo: "Semestral" | "Anual";
  intercaladasData: string;

  chaves: string;
  chavesData: string;

  financiamento: string;
  financiamentoData: string;

  totalProposta: string;

  observacoes: string;

  cidadeAssinatura: string;
  dataAssinatura: string;
  corretorResponsavel: string;
}
