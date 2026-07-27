-- Row Level Security: corretor só vê e só mexe nos leads
-- (oportunidades) e atividades (tarefas) que estão atrelados a ele.
-- Master continua vendo e editando tudo, sem restrição nenhuma.
--
-- O site público (formulários de contato/venda) e o webhook da Lais
-- continuam funcionando normalmente pra CRIAR leads/tarefas — eles
-- usam a chave anônima (sem login), então ganham uma policy própria,
-- só de insert, sem acesso nenhum de leitura/edição/exclusão.

alter table oportunidades enable row level security;
alter table tarefas enable row level security;

-- ================= oportunidades =================

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
