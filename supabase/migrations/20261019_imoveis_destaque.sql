alter table imoveis add column if not exists destaque boolean not null default false;

notify pgrst, 'reload schema';
