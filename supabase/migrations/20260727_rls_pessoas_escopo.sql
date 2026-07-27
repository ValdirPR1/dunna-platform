-- Mesma lógica já aplicada em oportunidades/tarefas: "pessoas" (que
-- alimenta tanto Leads quanto Clientes) precisa ficar restrita por
-- corretor. Uma pessoa fica visível pro corretor quando existe pelo
-- menos uma oportunidade dela atribuída a ele. Master continua vendo
-- tudo. O site público (chave anônima) continua podendo criar pessoa
-- novas (é assim que um lead do site vira registro no CRM), mas não
-- pode ler nem alterar as existentes.

-- Remove políticas antigas e amplas demais, se existirem (mesmo
-- padrão encontrado em oportunidades/tarefas).
drop policy if exists "Leitura publica de pessoas" on pessoas;
drop policy if exists "Escrita publica de pessoas" on pessoas;
drop policy if exists "Atualizacao publica de pessoas" on pessoas;
drop policy if exists "Exclusao publica de pessoas" on pessoas;

alter table pessoas enable row level security;

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

-- Insert fica liberado pra qualquer usuário autenticado: é assim que
-- master e corretor cadastram um lead/cliente novo, que ainda não
-- tem nenhuma oportunidade vinculada no momento da criação.
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
