-- Meu CRM: CRM pessoal (clientes que vêm de YouTube, Instagram, TikTok
-- etc., cadastrados manualmente). Cada usuário só enxerga os próprios
-- registros (dono_id = auth.uid()), nem outros masters veem.

create table if not exists meu_crm_clientes (
  id uuid primary key default gen_random_uuid(),
  dono_id uuid not null default auth.uid() references usuarios(id) on delete cascade,
  nome text not null,
  telefone text,
  email text,
  origem text not null default 'Outro',
  etapa text not null default 'Novo',
  interesse text,
  valor_estimado numeric,
  observacoes text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists meu_crm_tarefas (
  id uuid primary key default gen_random_uuid(),
  dono_id uuid not null default auth.uid() references usuarios(id) on delete cascade,
  cliente_id uuid references meu_crm_clientes(id) on delete cascade,
  titulo text not null,
  descricao text,
  data_hora timestamptz not null,
  concluida boolean not null default false,
  concluida_em timestamptz,
  lembrete_enviado boolean not null default false,
  criado_em timestamptz not null default now()
);

create table if not exists meu_crm_notas (
  id uuid primary key default gen_random_uuid(),
  dono_id uuid not null default auth.uid() references usuarios(id) on delete cascade,
  cliente_id uuid not null references meu_crm_clientes(id) on delete cascade,
  texto text not null,
  criado_em timestamptz not null default now()
);

create index if not exists meu_crm_clientes_dono on meu_crm_clientes(dono_id);
create index if not exists meu_crm_tarefas_dono_data on meu_crm_tarefas(dono_id, data_hora);
create index if not exists meu_crm_notas_cliente on meu_crm_notas(cliente_id);

alter table meu_crm_clientes enable row level security;
alter table meu_crm_tarefas enable row level security;
alter table meu_crm_notas enable row level security;

drop policy if exists "meu_crm_clientes_dono" on meu_crm_clientes;
create policy "meu_crm_clientes_dono" on meu_crm_clientes
  for all to authenticated
  using (dono_id = auth.uid()) with check (dono_id = auth.uid());

drop policy if exists "meu_crm_tarefas_dono" on meu_crm_tarefas;
create policy "meu_crm_tarefas_dono" on meu_crm_tarefas
  for all to authenticated
  using (dono_id = auth.uid()) with check (dono_id = auth.uid());

drop policy if exists "meu_crm_notas_dono" on meu_crm_notas;
create policy "meu_crm_notas_dono" on meu_crm_notas
  for all to authenticated
  using (dono_id = auth.uid()) with check (dono_id = auth.uid());

notify pgrst, 'reload schema';
