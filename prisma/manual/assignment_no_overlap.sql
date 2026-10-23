-- Impede que a mesma pessoa tenha dois periodos de assignment sobrepostos.
-- Periodos sao semiabertos [start, end): terminar em D e comecar em D e permitido.
--
-- Como aplicar:
--   npx prisma migrate dev --create-only --name assignment_no_overlap
--   (cole este conteudo no .sql gerado)
--   npx prisma migrate dev

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "PersonAssignment"
ADD CONSTRAINT "assignment_no_overlap"
EXCLUDE USING gist (
  "personId" WITH =,
  tsrange("startDate", COALESCE("endDate", 'infinity'::timestamp)) WITH &&
);