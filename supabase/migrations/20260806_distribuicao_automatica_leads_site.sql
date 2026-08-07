-- Distribuição automática (rodízio) dos leads que chegam pelo
-- formulário de contato do site entre os corretores ativos.
--
-- Cada lead novo vai pro próximo corretor da fila, na ordem, sem
-- repetir ninguém até todo mundo ter recebido sua vez — depois volta
-- pro começo. A "fila" é simplesmente a lista de corretores ativos
-- ordenada pelo id (ordem fixa e estável), e guardamos só o id do
-- último corretor sorteado na tabela "configuracoes" pra saber quem
-- vem depois na próxima vez.
--
-- Roda como SECURITY DEFINER (privilégio elevado) porque o site
-- público usa a chave anônima, que de propósito não tem permissão
-- de leitura/escrita em "configuracoes" — a função só devolve o id
-- do corretor escolhido, nunca a lista inteira nem outros dados.
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

  -- Pega o próximo corretor ativo depois do último sorteado
  select id into proximo_id
  from corretores
  where ativo = true
    and (ultimo_id is null or id > ultimo_id)
  order by id asc
  limit 1;

  -- Se não achou (era o último da fila, ou é a primeira vez), volta
  -- pro início da fila
  if proximo_id is null then
    select id into proximo_id
    from corretores
    where ativo = true
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
