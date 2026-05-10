const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [dateSamples] = await connection.execute('SELECT tanggal FROM detail_publikasi WHERE tanggal IS NOT NULL LIMIT 5');
    console.log('--- DATE FORMAT SAMPLES ---');
    console.log(JSON.stringify(dateSamples, null, 2));

    const [categoryHits] = await connection.execute(`
      SELECT 
        COUNT(CASE WHEN jenis_publikasi LIKE '%Buku%' OR jenis_publikasi LIKE '%Monograf%' OR jenis_publikasi LIKE '%Book chapter%' THEN 1 END) as buku_count,
        COUNT(CASE WHEN jenis_publikasi LIKE '%Jurnal%' OR jenis_publikasi LIKE '%Artikel%' OR jenis_publikasi LIKE '%Prosiding%' THEN 1 END) as artikel_count,
        COUNT(CASE WHEN nomor_paten IS NOT NULL AND nomor_paten != '' THEN 1 END) as haki_count
      FROM detail_publikasi
    `);
    console.log('--- CATEGORY HIT COUNTS ---');
    console.log(JSON.stringify(categoryHits, null, 2));

  } catch (e) {
    console.error(e);
  } finally {
    await connection.end();
  }
}

main();
