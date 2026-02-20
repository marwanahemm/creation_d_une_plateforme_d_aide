CREATE TABLE tutoriels (
  id bigint generated always as identity primary key,
  titre text not null,
  categorie text,
  difficulte text,
  duree text,
  description text,
  infos jsonb default '[]',
  etapes jsonb default '[]',
  lien text,
  created_at timestamptz default now()
);

NOTIFY pgrst, 'reload schema';