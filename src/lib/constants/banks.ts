export const INDONESIA_BANKS = [
  'Bank Syariah Indonesia (BSI)',
  'Bank Muamalat Indonesia',
  'Bank Central Asia (BCA)',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Negara Indonesia (BNI)',
  'Bank Mandiri',
  'Bank BJB / BJB Syariah',
  'SeaBank',
  'Bank Jago / Jago Syariah',
  'Bank Tabungan Negara (BTN)',
  'DANA (E-Wallet)',
  'GoPay (E-Wallet)',
  'OVO (E-Wallet)',
  'ShopeePay (E-Wallet)',
  'Bank / Rekening Lainnya',
] as const;

export type IndonesianBank = (typeof INDONESIA_BANKS)[number] | string;
