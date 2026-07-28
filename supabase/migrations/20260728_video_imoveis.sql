-- Vídeo do imóvel: um vídeo por imóvel (apresentação da construtora
-- ou gravado pela própria imobiliária), guardado direto no arquivo
-- (upload), reaproveitando o mesmo bucket de storage das fotos.

alter table imoveis add column if not exists video_url text;

-- O bucket "imoveis" (Storage) provavelmente está com o limite padrão
-- de tamanho de arquivo, pensado pra fotos — vídeo precisa de mais
-- espaço. Isso sobe o limite pra 200MB só nesse bucket.
update storage.buckets
set file_size_limit = 209715200
where id = 'imoveis';

-- Se o bucket já tiver uma lista de tipos de arquivo permitidos
-- (pensada só pra imagem), adiciona os tipos de vídeo nela sem tirar
-- o que já tinha. Se não houver restrição nenhuma (null = qualquer
-- tipo é aceito), não mexe em nada.
update storage.buckets
set allowed_mime_types = allowed_mime_types || array['video/mp4', 'video/quicktime', 'video/webm']
where id = 'imoveis'
  and allowed_mime_types is not null
  and not (allowed_mime_types @> array['video/mp4']);
