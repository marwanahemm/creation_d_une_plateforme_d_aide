-- Table pour les propositions de tutoriels par les utilisateurs
CREATE TABLE propositions (
  id bigint generated always as identity primary key,
  sujet text not null,
  description text,
  statut text default 'nouvelle' check (statut in ('nouvelle', 'lue', 'traitée')),
  created_at timestamptz default now()
);

-- Index sur le statut pour filtrer rapidement
CREATE INDEX idx_propositions_statut ON propositions(statut);

-- RLS : tout le monde peut proposer, seul le service role peut lire/modifier
ALTER TABLE propositions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut proposer"
  ON propositions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Seul le service role peut lire"
  ON propositions FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Seul le service role peut modifier"
  ON propositions FOR UPDATE
  TO service_role
  USING (true);

NOTIFY pgrst, 'reload schema';