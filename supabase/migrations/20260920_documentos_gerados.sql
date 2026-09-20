-- Guarda rascunhos dos documentos gerados em PDF (Contrato de Compra e
-- Venda, Autorização de Venda, etc.) como JSON — pra não precisar
-- preencher tudo de novo se um dado estiver errado, ou se o processo
-- de assinatura demorar. Depois que todas as partes assinarem, o
-- rascunho pode ser excluído (o PDF já gerado continua valendo, isso
-- aqui é só o formulário preenchido).
create table if not exists documentos_gerados (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('contrato_compra_venda', 'autorizacao_venda')),
  titulo text not null,
  dados jsonb not null,
  criado_por uuid references usuarios(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_documentos_gerados_tipo on documentos_gerados(tipo);

alter table documentos_gerados enable row level security;

-- Documentos têm dados sensíveis (CPF, RG, dados bancários) — master
-- vê tudo, corretor só enxerga (e só mexe) no que ele mesmo criou.
drop policy if exists "select_documentos_gerados" on documentos_gerados;
drop policy if exists "insert_documentos_gerados" on documentos_gerados;
drop policy if exists "update_documentos_gerados" on documentos_gerados;
drop policy if exists "delete_documentos_gerados" on documentos_gerados;

create policy "select_documentos_gerados"
  on documentos_gerados
  for select
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or criado_por = auth.uid()
  );

create policy "insert_documentos_gerados"
  on documentos_gerados
  for insert
  to authenticated
  with check (criado_por = auth.uid());

create policy "update_documentos_gerados"
  on documentos_gerados
  for update
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or criado_por = auth.uid()
  )
  with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or criado_por = auth.uid()
  );

create policy "delete_documentos_gerados"
  on documentos_gerados
  for delete
  to authenticated
  using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master')
    or criado_por = auth.uid()
  );
