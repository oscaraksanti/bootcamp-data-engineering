-- Refonte du certificat public : un paragraphe éditable par module décrivant
-- ce qui a été maîtrisé, et un lieu optionnel pour la mention "Fait à ...".

alter table public.modules
  add column if not exists certificate_blurb text;

alter table public.platform_settings
  add column if not exists certificate_location text;
