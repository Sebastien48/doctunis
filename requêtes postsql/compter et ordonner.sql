SELECT nationalite, COUNT(*) AS nombre_jurys, MAX(code) AS code_max
FROM jury 
GROUP BY nationalite;


