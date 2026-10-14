export const INDONESIA_BANKS = [
  'Bank Syariah Indonesia (BSI)',
  'Bank Central Asia (BCA)',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Mandiri',
  'Bank Negara Indonesia (BNI)',
  'Bank Muamalat Indonesia',
  'Bank BJB / BJB Syariah',
  'Bank CIMB Niaga / CIMB Syariah',
  'Bank Tabungan Negara (BTN)',
  'SeaBank Indonesia',
  'Bank Jago / Jago Syariah',
  'Bank Danamon',
  'Bank Permata / Permata Syariah',
  'DANA (E-Wallet)',
  'GoPay (E-Wallet)',
  'OVO (E-Wallet)',
  'ShopeePay (E-Wallet)',
  'Bank / Rekening Lainnya (Tulis Sendiri)',
] as const;

export type IndonesianBank = (typeof INDONESIA_BANKS)[number] | string;
