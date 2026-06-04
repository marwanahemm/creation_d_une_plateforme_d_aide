create policy "Lecture publique des tutoriels"
on "public"."tutoriels"
as PERMISSIVE
for SELECT
to public
using (
  true
);