-- Rode este SQL no SQL Editor do Supabase (Dashboard do projeto).
-- Cria a tabela que guarda a "inscrição" de cada dispositivo pra
-- notificação push, e a coluna que controla se o lembrete de uma
-- tarefa já foi enviado.

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  criado_em timestamptz not null default now()
);

create index if not exists push_subscriptions_usuario_id_idx
  on push_subscriptions(usuario_id);

alter table push_subscriptions enable row level security;

-- Cada usuário só pode ver/criar/apagar as próprias inscrições
drop policy if exists "usuarios gerenciam suas proprias inscricoes" on push_subscriptions;
create policy "usuarios gerenciam suas proprias inscricoes"
  on push_subscriptions
  for all
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

-- Controla se o lembrete de uma tarefa já foi mandado (evita avisar
-- várias vezes a mesma tarefa)
alter table tarefas
  add column if not exists lembrete_enviado boolean not null default false;
