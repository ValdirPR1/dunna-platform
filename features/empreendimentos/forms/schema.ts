import { z } from "zod";

export const empreendimentoSchema = z.object({
  nome: z.string().min(3, "Informe o nome"),
  construtora: z.string().optional(),
  incorporadora: z.string().optional(),
  cidade: z.string().min(2),
  bairro: z.string().optional(),
  endereco: z.string().optional(),
  descricao: z.string().optional(),
  status: z.string(),
  publicado: z.boolean(),
  tipo: z.string().optional(),
  entrega: z.string().optional(),
  registro: z.string().optional(),
  valorInicial: z.string().optional(),
  valorFinal: z.string().optional(),
  areaFinal: z.string().optional(),
  vgv: z.string().optional(),
  localizacaoTexto: z.string().optional(),
  valorizacaoTexto: z.string().optional(),
});

export type EmpreendimentoFormData =
  z.infer<typeof empreendimentoSchema>;