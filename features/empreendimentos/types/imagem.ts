export interface ImagemEmpreendimento {
  id: string;
  empreendimento_id: string;
  imagem: string;
  legenda?: string;
  ordem: number;
  capa: boolean;
  created_at?: string;
}