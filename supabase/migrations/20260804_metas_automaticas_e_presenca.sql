-- 1) Marca o momento em que um lead vira venda (entra na etapa
-- "Contrato"), pra dar pra contar vendas por mês de forma confiável
-- — diferente de "atualizado_em", que muda em qualquer edição.
alter table oportunidades add column if not exists venda_fechada_em timestamptz;

-- 2) Presença real em eventos (treinamentos, reuniões de equipe).
-- "status" (confirmado/recusado/pendente) é o RSVP feito pelo
-- próprio corretor antes do evento; "compareceu" é preenchido pelo
-- master depois do evento acontecer, pra ter o dado real de
-- participação nos relatórios.
alter table evento_participantes add column if not exists compareceu boolean;
