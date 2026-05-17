/**
 * Sync Validation Utilities
 * Validasi data dari SISTER sebelum disimpan ke database
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class SyncValidation {
  /**
   * Validate SDM record sebelum upsert ke users table
   */
  static validateSDM(sdm: any): ValidationResult {
    const errors: string[] = [];

    if (!sdm) {
      errors.push('SDM record is null or undefined');
      return { valid: false, errors };
    }

    if (!sdm.id_sdm || sdm.id_sdm.trim() === '') {
      errors.push('SDM id_sdm is required');
    }

    if (!sdm.nidn || sdm.nidn.trim() === '') {
      errors.push('SDM nidn is required');
    }

    if (!sdm.nama_sdm || sdm.nama_sdm.trim() === '') {
      errors.push('SDM nama_sdm is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Bidang Ilmu SDM record
   */
  static validateBidangIlmuSDM(bidang: any): ValidationResult {
    const errors: string[] = [];

    if (!bidang) {
      errors.push('Bidang Ilmu record is null or undefined');
      return { valid: false, errors };
    }

    if (bidang.id === undefined || bidang.id === null) {
      errors.push('Bidang Ilmu id is required');
    }

    if (!bidang.id_kelompok_bidang || bidang.id_kelompok_bidang.trim() === '') {
      errors.push('Bidang Ilmu id_kelompok_bidang is required');
    }

    if (!bidang.kelompok_bidang || bidang.kelompok_bidang.trim() === '') {
      errors.push('Bidang Ilmu kelompok_bidang is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Penelitian record
   */
  static validatePenelitian(penelitian: any): ValidationResult {
    const errors: string[] = [];

    if (!penelitian) {
      errors.push('Penelitian record is null or undefined');
      return { valid: false, errors };
    }

    if (!penelitian.id || penelitian.id.trim() === '') {
      errors.push('Penelitian id is required');
    }

    if (!penelitian.id_sdm || penelitian.id_sdm.trim() === '') {
      errors.push('Penelitian id_sdm is required');
    }

    if (!penelitian.judul || penelitian.judul.trim() === '') {
      errors.push('Penelitian judul is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Detail Penelitian record
   */
  static validateDetailPenelitian(detail: any): ValidationResult {
    const errors: string[] = [];

    if (!detail) {
      errors.push('Detail Penelitian record is null or undefined');
      return { valid: false, errors };
    }

    if (!detail.id || detail.id.trim() === '') {
      errors.push('Detail Penelitian id is required');
    }

    // Judul adalah required field
    if (!detail.judul || detail.judul.trim() === '') {
      errors.push('Detail Penelitian judul is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Publikasi record
   */
  static validatePublikasi(publikasi: any): ValidationResult {
    const errors: string[] = [];

    if (!publikasi) {
      errors.push('Publikasi record is null or undefined');
      return { valid: false, errors };
    }

    if (!publikasi.id || publikasi.id.trim() === '') {
      errors.push('Publikasi id is required');
    }

    if (!publikasi.id_user || publikasi.id_user.trim() === '') {
      errors.push('Publikasi id_user is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Detail Publikasi record
   */
  static validateDetailPublikasi(detail: any): ValidationResult {
    const errors: string[] = [];

    if (!detail) {
      errors.push('Detail Publikasi record is null or undefined');
      return { valid: false, errors };
    }

    if (!detail.id || detail.id.trim() === '') {
      errors.push('Detail Publikasi id is required');
    }

    if (!detail.judul || detail.judul.trim() === '') {
      errors.push('Detail Publikasi judul is required');
    }

    if (detail.id_kategori_kegiatan === null || detail.id_kategori_kegiatan === undefined) {
      errors.push('Detail Publikasi id_kategori_kegiatan is required');
    }

    if (detail.id_jenis_publikasi === null || detail.id_jenis_publikasi === undefined) {
      errors.push('Detail Publikasi id_jenis_publikasi is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Anggota record
   */
  static validateAnggota(anggota: any): ValidationResult {
    const errors: string[] = [];

    if (!anggota) {
      errors.push('Anggota record is null or undefined');
      return { valid: false, errors };
    }

    if (!anggota.id || anggota.id.trim() === '') {
      errors.push('Anggota id is required');
    }

    if (!anggota.nama || anggota.nama.trim() === '') {
      errors.push('Anggota nama is required');
    }

    if (!anggota.jenis || anggota.jenis.trim() === '') {
      errors.push('Anggota jenis is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Mitra record
   */
  static validateMitra(mitra: any): ValidationResult {
    const errors: string[] = [];

    if (!mitra) {
      errors.push('Mitra record is null or undefined');
      return { valid: false, errors };
    }

    if (!mitra.id || mitra.id.trim() === '') {
      errors.push('Mitra id is required');
    }

    if (!mitra.nama || mitra.nama.trim() === '') {
      errors.push('Mitra nama is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Dokumen record
   */
  static validateDokumen(dokumen: any): ValidationResult {
    const errors: string[] = [];

    if (!dokumen) {
      errors.push('Dokumen record is null or undefined');
      return { valid: false, errors };
    }

    if (!dokumen.id || dokumen.id.trim() === '') {
      errors.push('Dokumen id is required');
    }

    if (!dokumen.nama || dokumen.nama.trim() === '') {
      errors.push('Dokumen nama is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
