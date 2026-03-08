require('dotenv').config();

const express = require('express');
const db = require('./config/database.js');
const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.get('/test-koneksi', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT "Berhasil terhubung ke MySQL" AS pesan');
    res.json({
      status: "Sukses",
      data: rows[0]
    });
  } catch (error) {
    console.error("Error database:", error);
    res.status(500).json({ status: "Gagal", pesan: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server SIPPM berjalan di http://localhost:${port}`);
});