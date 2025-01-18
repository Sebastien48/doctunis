/*
 DELETE FROM films WHERE   code_producteur = 'LKJ' and code_realisateur = 'QSD';
DELETE FROM producteurs WHERE code_producteur = 'LKJ';
 delete from realisateurs  where code_realisateur = 'QSD';
  select * from films;


 CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,

    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);
 alter  table  utilisateurs 
 add email VARCHAR(255) unique;


CREATE TABLE  utilisateurs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(255) Not null,
  email VARCHAR(255) unique not null,
  username VARCHAR(100) unique not null,
  mot_de_passe VARCHAR(100) not null,
   role VARCHAR(10) DEFAULT 'user'
);

UPDATE utilisateurs
SET role = 'inspecteur'
WHERE id = 3;
SELECT 
	films.code_film,
    films.titre_film,
	producteurs.code_producteur,
	realisateurs.code_realisateur,
    producteurs.nom_producteur, 
    producteurs.prenom_producteur,
    realisateurs.nom_realisateur, 
    realisateurs.prenom_realisateur
FROM 
    films
JOIN 
    producteurs ON films.code_producteur = producteurs.code_producteur
JOIN 
    realisateurs ON films.code_realisateur = realisateurs.code_realisateur
ORDER BY 
    films.code_film ASC;
UPDATE utilisateurs
SET role = 'jurys'
WHERE id = 4;

 select * from utilisateurs;
 
ALTER TABLE films
ALTER COLUMN titre_film  TYPE VARCHAR(255) unique;


ALTER TABLE films
ADD CONSTRAINT unique_titre_film UNIQUE (titre_film);*/

DO $$
DECLARE
    record RECORD;
    new_id INT := 1;
BEGIN
    FOR record IN (SELECT id FROM utilisateurs ORDER BY id) LOOP
        UPDATE utilisateurs
        SET id = new_id
        WHERE id = record.id;
        new_id := new_id + 1;
    END LOOP;

    -- Réinitialiser la séquence associée (ajustez le nom de la séquence si nécessaire)
    PERFORM SETVAL('utilisateurs_id_seq', (SELECT MAX(id) FROM utilisateurs));
END $$;




