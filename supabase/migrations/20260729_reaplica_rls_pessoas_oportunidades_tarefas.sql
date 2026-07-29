-- Confirmado em produção (log do Vercel) que a Lais recebeu erro
-- 42501 "new row violates row-level security policy for table
-- pessoas" ao tentar enviar um lead pelo webhook — ou seja, a policy
-- "insert_pessoas_anon" (criada em 20260727_rls_pessoas_escopo.sql)
-- não está realmente ativa no banco, mesmo constando na migração.
-- Mesmo problema que já tínhamos visto antes em imoveis/
-- empreendimentos (20260728_reaplica_rls_imoveis_empreendimentos.sql).
--
-- Esse script reaplica (via drop + create, idempotente) as políticas
-- de pessoas, oportunidades e tarefas — as três tabelas em que o
-- site público e o webhook da Lais (chave anônima, sem login) e
-- criam registros novos. Sem alterar nenhuma regra, só garantindo que
-- elas realmente existam no banco.

-- ================= pessoas =================

alter table pessoas enable row level security;

drop policy if exists "insert_pessoas_anon" on pessoas;
drop policy if exists "select_pessoas_master_ou_dono" on pessoas;
drop policy if exists "insert_pessoas_authenticated" on pessoas;
drop policy if exists "update_pessoas_master_ou_dono" on pessoas;
drop policy if exists "delete_pessoas_master" on pessoas;

create policy "insert_pessoas_anon"
  on pessoas
  for insert
  to anon
  with check (true);

create policy "select_pessoas_master_ou_dono"
  on pessoas
  for select
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
    or exists (
      select 1 from oportunidades o
      join usuarios u on u.id = auth.uid()
      where o.pessoa_id = pessoas.id and o.corretor_id = u.corretor_id
    )
  );

create policy "insert_pessoas_authenticated"
  on pessoas
  for insert
  to authenticated
  with check (true);

create policy "update_pessoas_master_ou_dono"
  on pessoas
  for update
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
    or exists (
      select 1 from oportunidades o
      join usuarios u on u.id = auth.uid()
      where o.pessoa_id = pessoas.id and o.corretor_id = u.corretor_id
    )
  )
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
    or exists (
      select 1 from oportunidades o
      join usuarios u on u.id = auth.uid()
      where o.pessoa_id = pessoas.id and o.corretor_id = u.corretor_id
    )
  );

create policy "delete_pessoas_master"
  on pessoas
  for delete
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  );

-- ================= oportunidades =================

alter table oportunidades enable row level security;

drop policy if exists "anon_insert_oportunidades" on oportunidades;
drop policy if exists "select_oportunidades" on oportunidades;
drop policy if exists "insert_oportunidades" on oportunidades;
drop policy if exists "update_oportunidades" on oportunidades;
drop policy if exists "delete_oportunidades" on oportunidades;

create policy "anon_insert_oportunidades"
  on oportunidades
  for insert
  to anon
  with check (true);

create policy "select_oportunidades"
  on oportunidades
  for select
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = oportunidades.corretor_id)
    )
  );

create policy "insert_oportunidades"
  on oportunidades
  for insert
  to authenticated
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = oportunidades.corretor_id)
    )
  );

create policy "update_oportunidades"
  on oportunidades
  for update
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = oportunidades.corretor_id)
    )
  )
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = oportunidades.corretor_id)
    )
  );

create policy "delete_oportunidades"
  on oportunidades
  for delete
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = oportunidades.corretor_id)
    )
  );

-- ================= tarefas =================

alter table tarefas enable row level security;

drop policy if exists "anon_insert_tarefas" on tarefas;
drop policy if exists "select_tarefas" on tarefas;
drop policy if exists "insert_tarefas" on tarefas;
drop policy if exists "update_tarefas" on tarefas;
drop policy if exists "delete_tarefas" on tarefas;

create policy "anon_insert_tarefas"
  on tarefas
  for insert
  to anon
  with check (true);

create policy "select_tarefas"
  on tarefas
  for select
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = tarefas.corretor_id)
    )
  );

create policy "insert_tarefas"
  on tarefas
  for insert
  to authenticated
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = tarefas.corretor_id)
    )
  );

create policy "update_tarefas"
  on tarefas
  for update
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = tarefas.corretor_id)
    )
  )
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = tarefas.corretor_id)
    )
  );

create policy "delete_tarefas"
  on tarefas
  for delete
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid()
        and (u.papel = 'master' or u.corretor_id = tarefas.corretor_id)
    )
  );
