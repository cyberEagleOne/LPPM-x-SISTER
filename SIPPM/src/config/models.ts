import { RowDataPacket } from 'mysql2';

export interface SdmResponse {
  id_sdm?: string;
  nama_sdm?: string;
  nidn?: string;
  [key: string]: any;
}

export interface token extends RowDataPacket{
  id: any;
  token: string;
  timestamp: any;
}