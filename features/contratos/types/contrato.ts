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

export type FormaPagamentoSaldo = "avista" | "financiado";
export type MomentoPagamentoAvista = "contrato" | "escritura";

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
  // Como o saldo é pago: à vista (na assinatura do contrato ou da
  // escritura) ou financiado pelo comprador. Gera a frase da Cláusula
  // 2 automaticamente — formaSaldo vira só um detalhe opcional
  // anexado no final, pra casos fora do padrão.
  formaPagamentoSaldo: FormaPagamentoSaldo;
  momentoPagamentoAvista: MomentoPagamentoAvista;
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

// Formulário em branco — usado tanto no estado inicial da página
// quanto pra "começar um contrato novo" depois de ter um rascunho
// carregado.
export const CONTRATO_VAZIO: ContratoFormData = {
  vendedores: [{ ...PESSOA_VAZIA }],
  compradores: [{ ...PESSOA_VAZIA }],

  imovelTipo: "Apartamento",
  imovelNumero: "",
  imovelPavimento: "",
  imovelEdificio: "",
  imovelEndereco: "",
  imovelMatricula: "",
  imovelCartorio: "",
  imovelSequencial: "",
  imovelInscricaoImobiliaria: "",
  imovelPrefeitura: "",

  temAlienacao: false,
  bancoAlienacao: "",

  valorTotal: "",
  valorSinal: "",
  formaSinal: "",
  valorSaldo: "",
  formaPagamentoSaldo: "avista",
  momentoPagamentoAvista: "escritura",
  formaSaldo: "",
  bancoVendedor: "",
  agenciaVendedor: "",
  contaVendedor: "",
  favorecidoVendedor: "",

  valorComissao: "",
  bancoComissao: "",
  agenciaComissao: "",
  contaComissao: "",
  pixComissao: "",
  favorecidoComissao: "",

  foroCidade: "Recife – PE",
  cidadeAssinatura: "Recife – PE",
  dataAssinatura: new Date().toISOString().split("T")[0],

  testemunha1Nome: "",
  testemunha1Cpf: "",
  testemunha2Nome: "",
  testemunha2Cpf: "",
};
