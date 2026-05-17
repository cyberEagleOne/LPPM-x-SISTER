/**
 * Enum Mapper Utilities
 * Handles mapping dari API SISTER ke Prisma enums
 */

export class EnumMapper {
  /**
   * Map jenis anggota/penulis dari format SISTER ke Prisma enum
   * SISTER format: "Dosen", "Mahasiswa", "Profesional/Mitra"
   * Prisma enum: "Dosen", "Mahasiswa", "Profesional_Mitra"
   */
  static mapAnggotaJenis(raw: string | null | undefined): string {
    if (!raw) {
      return 'Dosen'; // Default fallback
    }

    const cleaned = raw.trim();

    // Map SISTER format ke Prisma enum
    if (cleaned === 'Profesional/Mitra' || cleaned === 'Profesional_Mitra') {
      return 'Profesional_Mitra';
    }

    if (cleaned === 'Dosen') {
      return 'Dosen';
    }

    if (cleaned === 'Mahasiswa') {
      return 'Mahasiswa';
    }

    // Unknown jenis, throw error untuk debugging
    throw new Error(`Unknown anggota_jenis: "${raw}"`);
  }

  /**
   * Map publikasi penulis jenis (same pattern as anggota)
   */
  static mapPublikasiPenuliJenis(raw: string | null | undefined): string {
    // Same logic sebagai anggota jenis
    return this.mapAnggotaJenis(raw);
  }

  /**
   * Safely map dengan fallback (tidak throw error, return default)
   */
  static mapAnggotaJenisSafe(raw: string | null | undefined, defaultValue: string = 'Dosen'): string {
    try {
      return this.mapAnggotaJenis(raw);
    } catch (error) {
      console.warn(`Enum mapping error: ${error}, using default: ${defaultValue}`);
      return defaultValue;
    }
  }

  /**
   * Safely map publikasi penulis jenis dengan fallback
   */
  static mapPublikasiPenuliJenisSafe(raw: string | null | undefined, defaultValue: string = 'Dosen'): string {
    try {
      return this.mapPublikasiPenuliJenis(raw);
    } catch (error) {
      console.warn(`Enum mapping error: ${error}, using default: ${defaultValue}`);
      return defaultValue;
    }
  }
}
