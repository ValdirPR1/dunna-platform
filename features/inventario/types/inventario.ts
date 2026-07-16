export interface Imovel {

  id:string;

  codigo:string;

  titulo:string;

  tipo:string;

  cidade:string;

  bairro:string;

  quartos:number;

  suites:number;

  banheiros:number;

  vagas:number;

  area:number;

  preco:number;

  status:string;

  destaque:boolean;

  empreendimentoId?:string;

}