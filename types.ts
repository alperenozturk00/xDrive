
export interface FormData {
  isimSoyisim: string;
  isyerindekiBirimi: string;
  telefonNumarasi: string;
  takimLideriIsmi?: string;
  kayitTarihi: string;
  kayitNumarasi: string;
  kvkkOnay: boolean;
}

export type SubmitStatus = 'idle' | 'success' | 'error';
