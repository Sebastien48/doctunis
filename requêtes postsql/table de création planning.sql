/*CREATE TABLE planning (
    id SERIAL PRIMARY KEY,
    code_film VARCHAR(50),
    date_projection DATE NOT NULL,
    heure_projection TIME NOT NULL,
    salle VARCHAR(100) NOT NULL,
    jury1 VARCHAR(50),
    jury2 VARCHAR(50),
    jury3 VARCHAR(50),
    image_url VARCHAR(255), -- Chemin ou URL de l'image
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (code_film) REFERENCES films(code_film),
    FOREIGN KEY (jury1) REFERENCES jury(code),
    FOREIGN KEY (jury2) REFERENCES jury(code),
    FOREIGN KEY (jury3) REFERENCES jury(code)
);*/
 


-- Ajout des contraintes
/*ALTER TABLE planning
    ADD CONSTRAINT unique_projection 
    UNIQUE (date_projection, heure_projection, salle);*/
