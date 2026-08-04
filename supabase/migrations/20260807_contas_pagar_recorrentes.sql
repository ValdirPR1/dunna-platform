-- Permite marcar uma conta a pagar como recorrente e gerar de uma vez
-- as parcelas seguintes (ex: aluguel repetindo 12x). As parcelas geradas
-- juntas compartilham o mesmo grupo_recorrencia, e cada uma guarda sua
-- posição (parcela_atual/parcela_total) só pra exibição, ex: "3/12".

alter table contas_pagar add column if not exists grupo_recorrencia uuid;
alter table contas_pagar add column if not exists parcela_atual integer;
alter table contas_pagar add column if not exists parcela_total integer;
