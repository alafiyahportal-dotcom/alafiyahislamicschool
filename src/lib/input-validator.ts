/**
 * Input validation and sanitization utility for API boundary protection (Point 6)
 */

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validates Indonesian NIK (Nomor Induk Kependudukan) - strictly 16 numeric digits
 */
export function isValidNik(nik: string): boolean {
  if (!nik || typeof nik !== 'string') return false;
  return /^\d{16}$/.test(nik.trim());
}

/**
 * Sanitizes and normalizes phone numbers to 628xxx format
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  if (digits.startsWith('62')) {
    return digits;
  }
  return digits;
}

export function isValidPhoneNumber(phone: string): boolean {
  const clean = sanitizePhoneNumber(phone);
  // Indonesian mobile numbers are typically 10 to 14 digits in 628... format
  return /^628\d{8,12}$/.test(clean);
}

/**
 * Validates password strength (min 8 characters, letters and numbers)
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Kata sandi wajib diisi.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Kata sandi minimal terdiri dari 8 karakter.' };
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: 'Kata sandi harus mengandung kombinasi huruf dan angka.' };
  }
  return { valid: true };
}

/**
 * Sanitizes plain text input: strips null bytes, trims, caps length, removes potential script tags
 */
export function sanitizeString(
  input: unknown,
  maxLength = 500,
  fallback = ''
): string {
  if (typeof input !== 'string') return fallback;
  return input
    .replace(/\0/g, '') // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip script tags
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates positive number or currency amount
 */
export function isValidAmount(val: unknown, min = 0, max = 1_000_000_000): boolean {
  if (typeof val !== 'number' || isNaN(val)) return false;
  return val >= min && val <= max;
}
