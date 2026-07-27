-- Permite informar se o valor do IPTU cadastrado é mensal ou anual.
-- Mantém "mensal" como padrão pros imóveis já cadastrados, já que é
-- assim que o valor vinha sendo exibido até agora (igual ao condomínio).
alter table imoveis
  add column if not exists iptu_periodicidade text not null default 'mensal';

alter table imoveis
  add constraint iptu_periodicidade_valido
  check (iptu_periodicidade in ('mensal', 'anual'));
