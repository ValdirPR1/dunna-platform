-- Controle de caixa e investimentos da imobiliária (só master).
--
-- Saldo em caixa = saldo inicial + tudo que entrou (comissões
-- recebidas) - tudo que saiu (contas, repasses, bonificações) -
-- dinheiro aplicado + dinheiro resgatado. Os investimentos ficam
-- separados do caixa: ao aplicar, o valor sai do caixa e passa a
-- aparecer só na aba Investimentos.

-- Saldo que já existia em caixa antes dos lançamentos do sistema.
-- Linha única (id sempre 1).
create table if not exists caixa_config (
  id int primary key default 1 check (id = 1),
  saldo_inicial numeric not null default 0,
  atualizado_em timestamptz not null default now()
);

insert into caixa_config (id, saldo_inicial) values (1, 0)
on conflict (id) do nothing;

create table if not exists investimentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  instituicao text,
  -- Valor de hoje (atualizado manualmente pelo master de tempos em
  -- tempos); aplicar/resgatar também ajusta esse valor.
  valor_atual numeric not null default 0,
  ativo boolean not null default true,
  criado_por uuid references usuarios(id),
  criado_em timestamptz not null default now()
);

create table if not exists investimento_movimentos (
  id uuid primary key default gen_random_uuid(),
  investimento_id uuid not null references investimentos(id) on delete cascade,
  tipo text not null check (tipo in ('aplicacao', 'resgate')),
  valor numeric not null check (valor > 0),
  data date not null default current_date,
  descricao text,
  criado_por uuid references usuarios(id),
  criado_em timestamptz not null default now()
);

alter table caixa_config enable row level security;
alter table investimentos enable row level security;
alter table investimento_movimentos enable row level security;

drop policy if exists "master_caixa_config" on caixa_config;
create policy "master_caixa_config"
  on caixa_config
  for all
  to authenticated
  using (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'))
  with check (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'));

drop policy if exists "master_investimentos" on investimentos;
create policy "master_investimentos"
  on investimentos
  for all
  to authenticated
  using (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'))
  with check (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'));

drop policy if exists "master_investimento_movimentos" on investimento_movimentos;
create policy "master_investimento_movimentos"
  on investimento_movimentos
  for all
  to authenticated
  using (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'))
  with check (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'));

notify pgrst, 'reload schema';
