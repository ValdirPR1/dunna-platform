-- ADM Financeiro: central de entradas e saídas da imobiliária,
-- visível só pro master. "Entrada" = comissão que a imobiliária
-- recebe sobre as vendas (tabela comissoes, já existente). "Saída" =
-- contas a pagar + comissões pagas aos corretores + bonificações.

-- Marca se/quando a comissão do corretor foi de fato paga — é esse
-- pagamento que entra como saída de caixa no ADM Financeiro.
alter table comissoes add column if not exists pago boolean not null default false;
alter table comissoes add column if not exists pago_em date;

create table if not exists contas_pagar (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('luz', 'internet', 'aluguel', 'condominio', 'taxas', 'impostos', 'outros')),
  descricao text,
  valor numeric not null,
  vencimento date,
  status text not null default 'pendente' check (status in ('pendente', 'pago')),
  pago_em date,
  criado_por uuid references usuarios(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists bonificacoes (
  id uuid primary key default gen_random_uuid(),
  corretor_id uuid not null references corretores(id) on delete cascade,
  oportunidade_id uuid references oportunidades(id) on delete set null,
  descricao text not null,
  valor numeric not null,
  data_pagamento date not null default current_date,
  criado_por uuid references usuarios(id),
  criado_em timestamptz not null default now()
);

alter table contas_pagar enable row level security;
alter table bonificacoes enable row level security;

-- Ambas as tabelas são só do master — é a contabilidade interna da
-- imobiliária, sem visibilidade pro corretor.

drop policy if exists "master_contas_pagar" on contas_pagar;
create policy "master_contas_pagar"
  on contas_pagar
  for all
  to authenticated
  using (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'))
  with check (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'));

drop policy if exists "master_bonificacoes" on bonificacoes;
create policy "master_bonificacoes"
  on bonificacoes
  for all
  to authenticated
  using (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'))
  with check (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'));
