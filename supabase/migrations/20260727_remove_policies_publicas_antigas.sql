-- As tabelas já tinham políticas antigas liberando tudo pra "public"
-- (todo mundo, sem exceção). Como no Postgres qualquer política que
-- permite already ganha das que restringem, essas políticas antigas
-- anulavam na prática as regras novas de "corretor só vê o que é
-- dele" e "só master edita imóveis/empreendimentos". Removendo-as
-- aqui — se não existirem (nomes diferentes em algum ambiente), o
-- "if exists" evita erro.

drop policy if exists "Leitura publica de oportunidades" on oportunidades;
drop policy if exists "Escrita publica de oportunidades" on oportunidades;
drop policy if exists "Atualizacao publica de oportunidades" on oportunidades;
drop policy if exists "Exclusao publica de oportunidades" on oportunidades;

drop policy if exists "Leitura publica de tarefas" on tarefas;
drop policy if exists "Escrita publica de tarefas" on tarefas;
drop policy if exists "Atualizacao publica de tarefas" on tarefas;
drop policy if exists "Exclusao publica de tarefas" on tarefas;

drop policy if exists "Leitura publica de imoveis" on imoveis;
drop policy if exists "Escrita publica de imoveis" on imoveis;
drop policy if exists "Atualizacao publica de imoveis" on imoveis;
drop policy if exists "Exclusao publica de imoveis" on imoveis;

drop policy if exists "Leitura publica de empreendimentos" on empreendimentos;
drop policy if exists "Escrita publica de empreendimentos" on empreendimentos;
drop policy if exists "Atualizacao publica de empreendimentos" on empreendimentos;
drop policy if exists "Exclusao publica de empreendimentos" on empreendimentos;
