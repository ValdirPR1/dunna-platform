-- Row Level Security: só master pode criar, editar ou excluir
-- imóveis e empreendimentos. Leitura continua liberada pra todo
-- mundo (corretor logado E o site público, que usa a chave anônima
-- pra mostrar os imóveis/empreendimentos publicados) — só a escrita
-- fica restrita.

alter table imoveis enable row level security;
alter table empreendimentos enable row level security;

-- ================= imoveis =================

create policy "select_imoveis_todos"
  on imoveis
  for select
  to anon, authenticated
  using (true);

create policy "insert_imoveis_master"
  on imoveis
  for insert
  to authenticated
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  );

create policy "update_imoveis_master"
  on imoveis
  for update
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  )
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  );

create policy "delete_imoveis_master"
  on imoveis
  for delete
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  );

-- ================= empreendimentos =================

create policy "select_empreendimentos_todos"
  on empreendimentos
  for select
  to anon, authenticated
  using (true);

create policy "insert_empreendimentos_master"
  on empreendimentos
  for insert
  to authenticated
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  );

create policy "update_empreendimentos_master"
  on empreendimentos
  for update
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  )
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  );

create policy "delete_empreendimentos_master"
  on empreendimentos
  for delete
  to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel = 'master'
    )
  );
