-- Metas de desempenho por corretor. O master define o alvo de cada
-- métrica (ligações/semana, visitas/semana, reuniões/semana,
-- vendas/mês, captações/mês) e o corretor lança o que realizou em
-- cada período, pra acompanharem juntos se a meta está sendo batida.
--
-- "metas" guarda só o alvo ATUAL de cada corretor por métrica (o
-- master pode editar quando quiser, sobrescrevendo o valor).
--
-- "metas_realizacoes" guarda um registro por corretor + métrica +
-- período (semana ou mês), com o valor lançado pelo corretor e uma
-- cópia do alvo vigente no momento em que o período começou a ser
-- preenchido — assim o histórico continua fazendo sentido mesmo que
-- o master mude a meta depois.

create table if not exists metas (
  id uuid primary key default gen_random_uuid(),
  corretor_id uuid not null references corretores(id) on delete cascade,
  tipo_metrica text not null check (tipo_metrica in ('ligacoes', 'visitas', 'reunioes', 'vendas', 'captacoes')),
  valor_alvo integer not null default 0,
  atualizado_por uuid references usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (corretor_id, tipo_metrica)
);

create table if not exists metas_realizacoes (
  id uuid primary key default gen_random_uuid(),
  corretor_id uuid not null references corretores(id) on delete cascade,
  tipo_metrica text not null check (tipo_metrica in ('ligacoes', 'visitas', 'reunioes', 'vendas', 'captacoes')),
  periodo_inicio date not null,
  periodo_fim date not null,
  valor_alvo integer not null default 0,
  valor_realizado integer not null default 0,
  atualizado_em timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (corretor_id, tipo_metrica, periodo_inicio)
);

alter table metas enable row level security;
alter table metas_realizacoes enable row level security;

-- ================= metas (alvos) =================
-- Master vê/cria/edita/apaga tudo. Corretor só enxerga os próprios
-- alvos (precisa disso pra saber quanto falta) e não pode alterá-los.

drop policy if exists "select_metas" on metas;
drop policy if exists "insert_metas" on metas;
drop policy if exists "update_metas" on metas;
drop policy if exists "delete_metas" on metas;

create policy "select_metas"
  on metas
  for select
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = metas.corretor_id)
  );

create policy "insert_metas"
  on metas
  for insert
  to authenticated
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "update_metas"
  on metas
  for update
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  )
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "delete_metas"
  on metas
  for delete
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

-- ================= metas_realizacoes (lançamentos) =================
-- Master vê tudo (pra acompanhar todo mundo) mas não lança número
-- pelos corretores. Corretor vê e lança só o próprio realizado.

drop policy if exists "select_metas_realizacoes" on metas_realizacoes;
drop policy if exists "insert_metas_realizacoes" on metas_realizacoes;
drop policy if exists "update_metas_realizacoes" on metas_realizacoes;
drop policy if exists "delete_metas_realizacoes" on metas_realizacoes;

create policy "select_metas_realizacoes"
  on metas_realizacoes
  for select
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = metas_realizacoes.corretor_id)
  );

create policy "insert_metas_realizacoes"
  on metas_realizacoes
  for insert
  to authenticated
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = metas_realizacoes.corretor_id)
  );

create policy "update_metas_realizacoes"
  on metas_realizacoes
  for update
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = metas_realizacoes.corretor_id)
  )
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = metas_realizacoes.corretor_id)
  );

create policy "delete_metas_realizacoes"
  on metas_realizacoes
  for delete
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );
