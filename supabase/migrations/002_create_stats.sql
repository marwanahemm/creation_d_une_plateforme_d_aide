CREATE TABLE stats (
  id        bigint generated always as identity primary key,
  compteur  text unique not null,
  valeur    bigint default 0
);

-- Insérer les deux compteurs
INSERT INTO stats (compteur, valeur) VALUES
  ('visites', 0),
  ('pages_vues', 0);


-- Fonction pour incrémenter un compteur
CREATE OR REPLACE FUNCTION increment_stats(compteur text, n int)
RETURNS void AS $$
BEGIN
  UPDATE stats
  SET valeur = valeur + n
  WHERE stats.compteur = increment_stats.compteur;
END;
$$ LANGUAGE plpgsql;