-- "valor_venda" é o valor OFICIAL da venda, confirmado no momento em
-- que o contrato é assinado (botão "Contrato Assinado") — diferente
-- de valor_previsto/valor_interesse, que são estimativas usadas
-- durante a negociação. É esse valor que conta como VGV e que serve
-- de base pro cálculo de comissão.
alter table oportunidades add column if not exists valor_venda numeric;

-- Comissões: o master define, por venda, o percentual que a
-- imobiliária cobra sobre o valor da venda e quanto disso o corretor
-- recebe, além de como o corretor recebe (à vista ou parcelado). Uma
-- linha "a_definir" é criada automaticamente quando o contrato é
-- assinado; o master preenche os percentuais depois, na aba
-- Financeiro > Comissões.
create table if not exists comissoes (
  id uuid primary key default gen_random_uuid(),
  oportunidade_id uuid not null references oportunidades(id) on delete cascade,
  corretor_id uuid references corretores(id) on delete set null,
  valor_venda numeric,
  percentual_imobiliaria numeric,
  valor_comissao_imobiliaria numeric,
  percentual_corretor numeric,
  valor_comissao_corretor numeric,
  forma_recebimento text check (forma_recebimento in ('avista', 'parcelado')),
  parcelas integer,
  observacoes text,
  status text not null default 'a_definir' check (status in ('a_definir', 'definida')),
  atualizado_por uuid references usuarios(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (oportunidade_id)
);

alter table comissoes enable row level security;

-- Master vê/cria/edita/apaga tudo. Corretor só enxerga as próprias
-- comissões (pra saber quanto vai receber) e não pode alterá-las —
-- só o master define os percentuais.
drop policy if exists "select_comissoes" on comissoes;
drop policy if exists "insert_comissoes" on comissoes;
drop policy if exists "update_comissoes" on comissoes;
drop policy if exists "delete_comissoes" on comissoes;

create policy "select_comissoes"
  on comissoes
  for select
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = comissoes.corretor_id)
  );

-- Insert também é liberado pro próprio corretor da venda, porque é a
-- linha "a_definir" que fica criada automaticamente assim que o
-- contrato é assinado (o botão pode ser clicado pelo corretor) — os
-- percentuais em si só o master consegue alterar (ver update abaixo).
create policy "insert_comissoes"
  on comissoes
  for insert
  to authenticated
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = comissoes.corretor_id)
  );

create policy "update_comissoes"
  on comissoes
  for update
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  )
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "delete_comissoes"
  on comissoes
  for delete
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );
