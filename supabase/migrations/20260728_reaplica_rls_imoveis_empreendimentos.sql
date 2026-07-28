-- Reaplica (de forma segura, dropando antes) as políticas de RLS de
-- imoveis/empreendimentos. Confirmei via teste direto no banco que a
-- exclusão de imóvel estava sendo silenciosamente bloqueada — o
-- Supabase aceitava o pedido e apagava 0 linhas, mesmo logado como
-- master. Sinal de que a política "delete_imoveis_master" não estava
-- realmente ativa (mesmo tendo sido escrita numa migração anterior).

alter table imoveis enable row level security;
alter table empreendimentos enable row level security;

drop policy if exists "select_imoveis_todos" on imoveis;
drop policy if exists "insert_imoveis_master" on imoveis;
drop policy if exists "update_imoveis_master" on imoveis;
drop policy if exists "delete_imoveis_master" on imoveis;

create policy "select_imoveis_todos"
  on imoveis for select
  to anon, authenticated
  using (true);

create policy "insert_imoveis_master"
  on imoveis for insert
  to authenticated
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "update_imoveis_master"
  on imoveis for update
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  )
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "delete_imoveis_master"
  on imoveis for delete
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

drop policy if exists "select_empreendimentos_todos" on empreendimentos;
drop policy if exists "insert_empreendimentos_master" on empreendimentos;
drop policy if exists "update_empreendimentos_master" on empreendimentos;
drop policy if exists "delete_empreendimentos_master" on empreendimentos;

create policy "select_empreendimentos_todos"
  on empreendimentos for select
  to anon, authenticated
  using (true);

create policy "insert_empreendimentos_master"
  on empreendimentos for insert
  to authenticated
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "update_empreendimentos_master"
  on empreendimentos for update
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  )
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "delete_empreendimentos_master"
  on empreendimentos for delete
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );
