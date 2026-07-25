export interface PessoaContrato {
  nome: string;
  nacionalidade: string;
  estadoCivil: string;
  regimeBens: string;
  nascimento: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export const PESSOA_VAZIA: PessoaContrato = {
  nome: "",
  nacionalidade: "brasileiro(a)",
  estadoCivil: "",
  regimeBens: "",
  nascimento: "",
  cpf: "",
  rg: "",
  orgaoEmissor: "",
  email: "",
  telefone: "",
  endereco: "",
  bairro: "",
  cidade: "",
  uf: "PE",
  cep: "",
};

export interface ContratoFormData {
  vendedores: PessoaContrato[];
  compradores: PessoaContrato[];

  // Imóvel
  imovelTipo: string;
  imovelNumero: string;
  imovelPavimento: string;
  imovelEdificio: string;
  imovelEndereco: string;
  imovelMatricula: string;
  imovelCartorio: string;
  imovelSequencial: string;
  imovelInscricaoImobiliaria: string;
  imovelPrefeitura: string;

  temAlienacao: boolean;
  bancoAlienacao: string;

  // Preço e pagamento
  valorTotal: string;
  valorSinal: string;
  formaSinal: string;
  valorSaldo: string;
  formaSaldo: string;
  bancoVendedor: string;
  agenciaVendedor: string;
  contaVendedor: string;
  favorecidoVendedor: string;

  // Comissão
  valorComissao: string;
  bancoComissao: string;
  agenciaComissao: string;
  contaComissao: string;
  pixComissao: string;
  favorecidoComissao: string;

  // Foro e assinatura
  foroCidade: string;
  cidadeAssinatura: string;
  dataAssinatura: string;

  testemunha1Nome: string;
  testemunha1Cpf: string;
  testemunha2Nome: string;
  testemunha2Cpf: string;
}
