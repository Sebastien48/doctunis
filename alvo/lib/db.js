import mariadb from 'mariadb';

export const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'voyage',
  connectionLimit: 5,
  connectTimeout: 10000, 
});

export async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, params);
    return res;
  } catch (err) {
    console.error('❌ Erreur requête MariaDB :', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// Vérification de connexion
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connexion MariaDB réussie');
    conn.release();
  } catch (error) {
    console.error('❌ Connexion MariaDB échouée :', error);
  }
})();
