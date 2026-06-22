-- 1. Le bucket, en accès public en lecture (les images sont affichées sur le site).
insert into storage.buckets (id, name, public)
values ('captures', 'captures', true)
on conflict (id) do nothing;

-- 2. Lecture publique des fichiers du bucket (affichage des captures).
create policy "Captures : lecture publique"
  on storage.objects for select
  using (bucket_id = 'captures');

-- 3. Envoi de fichiers dans le bucket.
--    Ici ouvert à la clé anon car l'accès à la page admin est déjà
--    protégé en amont par mot de passe (bcrypt + cookie httpOnly).
create policy "Captures : envoi"
  on storage.objects for insert
  with check (bucket_id = 'captures');

-- 4. Suppression de fichiers du bucket (bouton « retirer la capture »).
create policy "Captures : suppression"
  on storage.objects for delete
  using (bucket_id = 'captures');