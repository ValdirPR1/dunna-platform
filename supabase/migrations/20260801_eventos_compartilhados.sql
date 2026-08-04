-- Eventos compartilhados: o master cria um evento (treinamento,
-- reunião, etc.) e seleciona quais corretores devem participar. Cada
-- corretor convidado vê o evento na própria Agenda e pode confirmar
-- ou recusar presença. Diferente de "tarefas" (que tem um único
-- corretor_id dono), um evento pode ter vários participantes — por
-- isso é uma tabela nova em vez de reaproveitar "tarefas".

create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  data_hora timestamptz not null,
  local text,
  criado_por uuid references usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists evento_participantes (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  corretor_id uuid not null references corretores(id) on delete cascade,
  status text not null default 'pendente' check (status in ('pendente', 'confirmado', 'recusado')),
  respondido_em timestamptz,
  created_at timestamptz not null default now(),
  unique (evento_id, corretor_id)
);

alter table eventos enable row level security;
alter table evento_participantes enable row level security;

-- ================= eventos =================
-- Master vê/cria/edita/apaga tudo. Corretor só vê eventos em que
-- consta como participante (não pode criar/editar/apagar).

drop policy if exists "select_eventos" on eventos;
drop policy if exists "insert_eventos" on eventos;
drop policy if exists "update_eventos" on eventos;
drop policy if exists "delete_eventos" on eventos;

create policy "select_eventos"
  on eventos
  for select
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (
      select 1 from evento_participantes ep
      join usuarios u on u.id = auth.uid()
      where ep.evento_id = eventos.id and ep.corretor_id = u.corretor_id
    )
  );

create policy "insert_eventos"
  on eventos
  for insert
  to authenticated
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "update_eventos"
  on eventos
  for update
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  )
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "delete_eventos"
  on eventos
  for delete
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

-- ================= evento_participantes =================
-- Master vê/gerencia todas as linhas (pra convidar e ver quem
-- confirmou). Corretor só vê e só atualiza a própria linha (é assim
-- que ele confirma ou recusa presença).

drop policy if exists "select_evento_participantes" on evento_participantes;
drop policy if exists "insert_evento_participantes" on evento_participantes;
drop policy if exists "update_evento_participantes" on evento_participantes;
drop policy if exists "delete_evento_participantes" on evento_participantes;

create policy "select_evento_participantes"
  on evento_participantes
  for select
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = evento_participantes.corretor_id)
  );

create policy "insert_evento_participantes"
  on evento_participantes
  for insert
  to authenticated
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );

create policy "update_evento_participantes"
  on evento_participantes
  for update
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = evento_participantes.corretor_id)
  )
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or exists (select 1 from usuarios u where u.id = auth.uid() and u.corretor_id = evento_participantes.corretor_id)
  );

create policy "delete_evento_participantes"
  on evento_participantes
  for delete
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
  );
