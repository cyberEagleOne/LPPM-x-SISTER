const API_BASE_URL = "https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/";

const apiConfig = {
  API_BASE_URL: API_BASE_URL,
  
  URL_AUTHORIZE: `${API_BASE_URL}authorize`,
  URL_PROFIL_PT: `${API_BASE_URL}referensi/profil_pt`,
  URL_PERGURUAN_TINGGI: `${API_BASE_URL}referensi/perguruan_tinggi`,
  URL_SDM: `${API_BASE_URL}referensi/sdm`,
  
  URL_PUBLIKASI: `${API_BASE_URL}publikasi`,
  URL_PENDIDIKAN_FORMAL: `${API_BASE_URL}pendidikan_formal`,
  URL_JABATAN_FUNGSIONAL: `${API_BASE_URL}jabatan_fungsional`,
  
  URL_PENGAJARAN: `${API_BASE_URL}pengajaran`,
  URL_PENELITIAN: `${API_BASE_URL}penelitian`,
  URL_PENGABDIAN: `${API_BASE_URL}pengabdian`,
  URL_BKD_LAPORAN_AKHIR: `${API_BASE_URL}bkd/laporan_akhir_bkd`
};

module.exports = apiConfig;