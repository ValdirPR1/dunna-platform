export type PapelPessoa =
  | "Cliente"
  | "Proprietário"
  | "Corretor"
  | "Parceiro"
  | "Construtora"
  | "Incorporadora"
  | "Fornecedor";

export type TipoPessoa =
  | "Pessoa Física"
  | "Pessoa Jurídica";

export interface Pessoa {

  id: string;

  tipo: TipoPessoa;

  papel: PapelPessoa[];

  nome: string;

  cpf_cnpj?: string;

  rg_ie?: string;

  email?: string;

  telefone?: string;

  whatsapp?: string;

  nascimento?: string;

  profissao?: string;

  estado_civil?: string;

  cep?: string;

  endereco?: string;

  numero?: string;

  complemento?: string;

  bairro?: string;

  cidade?: string;

  estado?: string;

  observacoes?: string;

  ativo: boolean;

  created_at?: string;

  updated_at?: string;

}