-- Avaliações do Google cadastradas manualmente pelo master (alternativa
-- à API do Google Places, que exige faturamento no Google Cloud).
-- O site público lê as ativas; só o master cria/edita/exclui.

create table if not exists avaliacoes_manuais (
  id uuid primary key default gen_random_uuid(),
  autor text not null,
  nota int not null check (nota between 1 and 5),
  texto text not null,
  -- Texto livre, ex: "há 2 meses", "Setembro de 2026"
  tempo_relativo text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table avaliacoes_manuais enable row level security;

drop policy if exists "publico_le_avaliacoes_manuais" on avaliacoes_manuais;
create policy "publico_le_avaliacoes_manuais"
  on avaliacoes_manuais
  for select
  to anon, authenticated
  using (ativo = true);

drop policy if exists "master_avaliacoes_manuais" on avaliacoes_manuais;
create policy "master_avaliacoes_manuais"
  on avaliacoes_manuais
  for all
  to authenticated
  using (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'))
  with check (exists (select 1 from usuarios u where u.id = auth.uid() and u.papel = 'master'));

notify pgrst, 'reload schema';
