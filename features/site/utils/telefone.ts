// Lista curta de DDIs (código do país) pra o visitante escolher antes
// de digitar o WhatsApp. Sem isso, visitantes de fora do Brasil digitam
// só o número local (ex: "0981225955") e o lead chega incompleto no
// CRM, sem como saber o país/DDI de quem entrou em contato.
export const PAISES_DDI = [
  { ddi: "55", nome: "Brasil", bandeira: "🇧🇷" },
  { ddi: "351", nome: "Portugal", bandeira: "🇵🇹" },
  { ddi: "1", nome: "EUA/Canadá", bandeira: "🇺🇸" },
  { ddi: "54", nome: "Argentina", bandeira: "🇦🇷" },
  { ddi: "595", nome: "Paraguai", bandeira: "🇵🇾" },
  { ddi: "598", nome: "Uruguai", bandeira: "🇺🇾" },
  { ddi: "593", nome: "Equador", bandeira: "🇪🇨" },
  { ddi: "56", nome: "Chile", bandeira: "🇨🇱" },
  { ddi: "57", nome: "Colômbia", bandeira: "🇨🇴" },
  { ddi: "34", nome: "Espanha", bandeira: "🇪🇸" },
  { ddi: "44", nome: "Reino Unido", bandeira: "🇬🇧" },
  { ddi: "49", nome: "Alemanha", bandeira: "🇩🇪" },
] as const;

export const DDI_PADRAO = "55";

// Junta o DDI escolhido com o número digitado, sempre no formato
// internacional "+DDI número" — remove qualquer coisa que não seja
// dígito do número (espaços, traços, parênteses, e o "0" de tronco
// que alguns países usam antes do DDD local).
export function montarTelefoneCompleto(ddi: string, numero: string) {
  const numeroLimpo = numero.replace(/\D/g, "").replace(/^0+/, "");
  if (!numeroLimpo) return "";
  return `+${ddi} ${numeroLimpo}`;
}

// Usado pra números que já chegam completos de fontes externas (ex:
// webhook da Lais, que recebe o número direto do WhatsApp, já com o
// DDI incluso). Só garante o padrão "+DDI..." usado no resto do CRM,
// sem tentar adivinhar onde o DDI termina e o número local começa.
export function normalizarTelefoneInternacional(numero: string) {
  const limpo = numero.replace(/[^\d+]/g, "");
  if (!limpo) return "";
  return limpo.startsWith("+") ? limpo : `+${limpo}`;
}
