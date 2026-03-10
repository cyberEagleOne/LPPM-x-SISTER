export interface TokenCache {
  token: string;
  created_at: number; 
}

export interface SdmResponse {
  id_sdm?: string;
  nama_sdm?: string;
  nidn?: string;
  [key: string]: any;
}