const axios = require('axios');
const apiConfig = require('../config/apiConfig');
const { response } = require('../app');
require('dotenv').config({ path: '../.env' });

async function getAuthToken() {
  try {
    console.log("Sedang meminta token otorisasi...");
    const response = await axios.post(apiConfig.URL_AUTHORIZE, {
      id_pengguna: process.env.SISTER_USERNAME, 
      password: process.env.SISTER_PASSWORD
    });
    
    console.log("Token berhasil didapatkan!");
    return response.data.token; 
  } catch (error) {
    console.error("Gagal login ke SISTER:", error.response?.data || error.message);
    throw error;
  }
}

async function testLihatResponseSDM() {
  try {
    const token = await getAuthToken();

    console.log(`Mengambil data dari: ${apiConfig.URL_SDM}`);
    const response = await axios.get(apiConfig.URL_SDM, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const dataSdm = response.data;
    console.log("\n========== HASIL RESPONSE SISTER API ==========");
    
    if (Array.isArray(dataSdm)) {
        console.log(`Total Data Ditemukan: ${dataSdm.length} baris`);

        console.log("\nContoh Struktur Data (Item Pertama):");
        console.dir(dataSdm[0], { depth: null, colors: true });
    } else {
        console.log("Struktur Response Utuh:");
        console.dir(dataSdm, { depth: null, colors: true });
    }
    
    console.log("===============================================\n");

  } catch (error) {
    console.error("Terjadi kesalahan saat memanggil API:", error.response?.data || error.message);
  }
}

testLihatResponseSDM();