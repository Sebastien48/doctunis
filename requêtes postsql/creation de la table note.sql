/*
 


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

    
UPDATE utilisateurs
SET role = 'jurys'
WHERE id = 4;

 select * from utilisateurs;
 
ALTER TABLE films
ALTER COLUMN titre_film  TYPE VARCHAR(255) unique;


ALTER TABLE films
ADD CONSTRAINT unique_titre_film UNIQUE (titre_film);
 
update utilisateurs 
set role = 'producteur'
where id =5;
select * from utilisateurs;*/


CREATE TABLE Notes (
    id_note SERIAL PRIMARY KEY, -- Identifiant unique pour chaque note
    code_film VARCHAR(50) NOT NULL, -- Code du film
    code VARCHAR(50) NOT NULL, -- Code du jury (personne)
    note INTEGER NOT NULL CHECK (note >= 1 AND note <= 10), -- Note attribuée, entre 1 et 10
    FOREIGN KEY (code_film) REFERENCES films(code_film) ON DELETE CASCADE, -- Lien avec la table Films
    FOREIGN KEY (code) REFERENCES jury(code) ON DELETE CASCADE -- Lien avec la table Personnes
);
