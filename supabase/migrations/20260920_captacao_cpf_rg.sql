-- CPF/RG do proprietário — faltavam na ficha de captação e são
-- necessários pra identificar a pessoa em documentos como a
-- Autorização de Venda (autorização de divulgação/placa + ciência da
-- comissão), gerada a partir dos dados já preenchidos aqui.
alter table captacoes add column if not exists proprietario_cpf text;
alter table captacoes add column if not exists proprietario_rg text;
