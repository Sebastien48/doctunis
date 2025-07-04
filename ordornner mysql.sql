SET @new_id = 0;

-- Créer une table temporaire pour stocker l'ordre
CREATE TEMPORARY TABLE temp_reorder (
    old_id INT,
    new_id INT AUTO_INCREMENT PRIMARY KEY
);

-- Insérer les anciens IDs dans l'ordre
INSERT INTO temp_reorder (old_id)
SELECT id 
FROM utilisateurs 
ORDER BY id;

-- Mettre à jour la table principale
UPDATE utilisateurs u
JOIN temp_reorder t ON u.id = t.old_id
SET u.id = t.new_id;

-- Supprimer la table temporaire
DROP TEMPORARY TABLE temp_reorder;

-- Réinitialiser l'auto-incrément
ALTER TABLE utilisateurs AUTO_INCREMENT = 1;