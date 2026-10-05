/**
 * Utility Helper untuk Manajemen Persistent Referral Code (30 Hari Expire).
 * Mendukung Cookie & localStorage fallback, aman dari refresh & navigasi.
 */

export const REFERRAL_COOKIE_NAME = 'alafiyah_ref';
export const REFERRAL_CODE_COOKIE_NAME = 'alafiyah_ref_code';
export const REFERRAL_STORAGE_KEY = 'alafiyah_ref_code';
export const REFERRAL_EXPIRY_DAYS = 30;
export const REFERRAL_MAX_AGE_SECONDS = 60 * 60 * 24 * REFERRAL_EXPIRY_DAYS; // 2.592.000 detik = 30 hari

export interface ReferralPayload {
  referralCode: string;
  schoolSlug?: string;
  timestamp?: number;
}

/**
 * Tangkap & Simpan referral code ke Cookie (30 hari) dan localStorage.
 * HANYA memperbarui jika ada kode valid; tidak pernah menghapus kode lama jika param kosong.
 */
export function saveReferralCode(code: string, schoolSlug?: string): string | null {
  if (typeof window === 'undefined' || !code) return null;
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) return null;

  try {
    const payload: ReferralPayload = {
      referralCode: cleanCode,
      schoolSlug,
      timestamp: Date.now(),
    };

    const jsonVal = encodeURIComponent(JSON.stringify(payload));
    const cleanVal = encodeURIComponent(cleanCode);

    // 1. Simpan Cookie JSON (alafiyah_ref)
    document.cookie = `${REFERRAL_COOKIE_NAME}=${jsonVal}; path=/; max-age=${REFERRAL_MAX_AGE_SECONDS}; SameSite=Lax`;

    // 2. Simpan Cookie Plain (alafiyah_ref_code)
    document.cookie = `${REFERRAL_CODE_COOKIE_NAME}=${cleanVal}; path=/; max-age=${REFERRAL_MAX_AGE_SECONDS}; SameSite=Lax`;

    // 3. Simpan ke localStorage sebagai fallback sekunder
    localStorage.setItem(REFERRAL_STORAGE_KEY, cleanCode);

    return cleanCode;
  } catch (err) {
    console.warn('Gagal menyimpan referral code:', err);
    return cleanCode;
  }
}

/**
 * Baca referral code tersimpan secara hirarkis:
 * 1. Cookie JSON (alafiyah_ref)
 * 2. Cookie Plain (alafiyah_ref_code)
 * 3. localStorage (alafiyah_ref_code)
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Cek Cookie JSON (alafiyah_ref)
    const matchJson = document.cookie.match(new RegExp(`(?:^|; )${REFERRAL_COOKIE_NAME}=([^;]*)`));
    if (matchJson && matchJson[1]) {
      try {
        const parsed: ReferralPayload = JSON.parse(decodeURIComponent(matchJson[1]));
        if (parsed.referralCode && parsed.referralCode.trim()) {
          return parsed.referralCode.trim().toUpperCase();
        }
      } catch {
        const plain = decodeURIComponent(matchJson[1]).trim().toUpperCase();
        if (plain) return plain;
      }
    }

    // 2. Cek Cookie Plain (alafiyah_ref_code)
    const matchPlain = document.cookie.match(new RegExp(`(?:^|; )${REFERRAL_CODE_COOKIE_NAME}=([^;]*)`));
    if (matchPlain && matchPlain[1]) {
      const val = decodeURIComponent(matchPlain[1]).trim().toUpperCase();
      if (val) return val;
    }

    // 3. Cek localStorage
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (stored && stored.trim()) {
      return stored.trim().toUpperCase();
    }
  } catch (err) {
    console.warn('Gagal membaca referral code dari storage:', err);
  }

  return null;
}
