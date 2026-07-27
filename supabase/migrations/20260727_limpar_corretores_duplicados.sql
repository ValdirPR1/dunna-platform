-- Remove os corretores duplicados criados por causa do bug de upload
-- de foto (o cadastro era criado com sucesso, mas o erro no envio da
-- foto aparecia como falha total, levando a repetir o cadastro).
-- Nenhum desses registros tem oportunidades vinculadas ainda.
delete from corretores where nome = 'Ednaldo Silva' and foto is null;
delete from corretores where nome in ('Teste Diagnostico', 'Teste Diagnostico 2');
