-- Até aqui, uma comissão "parcelada" só guardava em quantas parcelas o
-- dinheiro entra (campo "parcelas") — mas o financeiro contava o valor
-- cheio da comissão assim que ela era definida, mesmo que só a
-- primeira parcela tivesse realmente entrado. Essas duas colunas
-- passam a rastrear quantas parcelas já entraram de fato (pro cálculo
-- da receita da imobiliária) e quantas já foram repassadas ao corretor
-- (pro cálculo da despesa) — o valor mostrado no Financeiro passa a
-- ser proporcional a isso, não o total da comissão.
alter table comissoes add column if not exists parcelas_recebidas integer not null default 0;
alter table comissoes add column if not exists parcelas_pagas_corretor integer not null default 0;

-- Backfill: preserva os números que já apareciam no Financeiro pras
-- comissões existentes (senão a receita/despesa históricas somem da
-- hora pra noite). Comissões "definida" à vista viram 1 parcela
-- recebida (era assim que já contava). As parceladas também entram
-- como totalmente recebidas/pagas por padrão — se alguma ainda estiver
-- só parcialmente paga na vida real (como a que motivou essa mudança),
-- é só ajustar manualmente pelos botões "-" na tela do Financeiro.
update comissoes
set parcelas_recebidas = greatest(coalesce(parcelas, 1), 1)
where status = 'definida' and parcelas_recebidas = 0;

update comissoes
set parcelas_pagas_corretor = greatest(coalesce(parcelas, 1), 1)
where status = 'definida' and pago = true and parcelas_pagas_corretor = 0;
