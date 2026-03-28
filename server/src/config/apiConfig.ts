export class Config {
    static API_BASE_URL: string = "https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/"
    
    static URL_AUTHORIZE: string = `${Config.API_BASE_URL}authorize`
    static URL_PROFIL_PT: string = `${Config.API_BASE_URL}referensi/profil_pt`
    static URL_PERGURUAN_TINGGI: string = `${Config.API_BASE_URL}referensi/perguruan_tinggi`
    static URL_SDM: string = `${Config.API_BASE_URL}referensi/sdm`

    static URL_PUBLIKASI: string = `${Config.API_BASE_URL}publikasi`
    static URL_PENDIDIKAN_FORMAL: string = `${Config.API_BASE_URL}pendidikan_formal`
    static URL_JABATAN_FUNGSIONAL: string = `${Config.API_BASE_URL}jabatan_fungsional`

    static URL_PENGAJARAN: string = `${Config.API_BASE_URL}pengajaran`
    static URL_PENELITIAN: string = `${Config.API_BASE_URL}penelitian`
    static URL_PENGABDIAN: string = `${Config.API_BASE_URL}pengabdian`
    static URL_BIDANG_ILMU: string = `${Config.API_BASE_URL}data_pribadi/bidang_ilmu`
    static URL_BKD_LAPORAN_AKHIR: string = `${Config.API_BASE_URL}bkd/laporan_akhir_bkd`
}
