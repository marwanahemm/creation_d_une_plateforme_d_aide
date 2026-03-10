-- Table pour stocker les retours utilisateurs (utile / pas utile)
CREATE TABLE feedbacks (
  id bigint generated always as identity primary key,
  tutoriel_id bigint not null references tutoriels(id) on delete cascade,
  utile boolean not null,
  created_at timestamptz default now()
);

-- Index pour accélérer les requêtes par tutoriel
CREATE INDEX idx_feedbacks_tutoriel_id ON feedbacks(tutoriel_id);

-- Permettre à tout le monde d'insérer un feedback (clé anon)
-- mais personne ne peut lire/modifier/supprimer (sauf service role)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voter"
  ON feedbacks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Seul le service role peut lire"
  ON feedbacks FOR SELECT
  TO service_role
  USING (true);

NOTIFY pgrst, 'reload schema';