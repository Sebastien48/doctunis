SELECT participation.POSSEDE_NOMC
FROM participation,compagnie
WHERE participation.PROPRIETAIRE_NOMC=compagnie.NOMC 
AND ((participation.NBPART * 100) / compagnie.nb_total_part) > 50;

