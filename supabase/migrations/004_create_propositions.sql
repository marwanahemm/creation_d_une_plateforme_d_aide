CREATE TABLE IF NOT EXISTS propositions (
  id bigint generated always as identity primary key,
  sujet text not null,
  description text,
  statut text default 'nouvelle' check (statut in ('nouvelle', 'lue', 'traitée')),
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_propositions_statut ON propositions(statut);

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