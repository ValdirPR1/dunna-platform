-- Permite marcar um corretor como fora da roleta automática de
-- distribuição de leads do site (escolher_corretor_round_robin),
-- sem precisar desativá-lo por completo (ele continua logando,
-- aparecendo em relatórios etc., só não recebe leads novos pela
-- roleta).
--
-- Todo corretor já existente entra com participa_roleta = true, ou
-- seja, ninguém sai da roleta sozinho com essa migração.
alter table corretores
  add column if not exists participa_roleta boolean not null default true;

-- Atualiza a função de rodízio pra só considerar corretores ativos
-- E marcados pra participar da roleta.
create or replace function escolher_corretor_round_robin()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  ultimo_id uuid;
  proximo_id uuid;
  linhas_afetadas int;
begin
  select valor::uuid into ultimo_id
  from configuracoes
  where chave = 'ultimo_corretor_lead_site'
  limit 1;

  -- Pega o próximo corretor ativo e na roleta, depois do último sorteado
  select id into proximo_id
  from corretores
  where ativo = true
    and participa_roleta = true
    and (ultimo_id is null or id > ultimo_id)
  order by id asc
  limit 1;

  -- Se não achou (era o último da fila, ou é a primeira vez), volta
  -- pro início da fila
  if proximo_id is null then
    select id into proximo_id
    from corretores
    where ativo = true
      and participa_roleta = true
    order by id asc
    limit 1;
  end if;

  if proximo_id is not null then
    update configuracoes
    set valor = proximo_id::text
    where chave = 'ultimo_corretor_lead_site';

    get diagnostics linhas_afetadas = row_count;

    if linhas_afetadas = 0 then
      insert into configuracoes (chave, valor)
      values ('ultimo_corretor_lead_site', proximo_id::text);
    end if;
  end if;

  return proximo_id;
end;
$$;

grant execute on function escolher_corretor_round_robin() to anon, authenticated;

notify pgrst, 'reload schema';
