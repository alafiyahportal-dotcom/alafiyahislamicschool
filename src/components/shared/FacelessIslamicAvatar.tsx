import React from 'react';

export interface FacelessIslamicAvatarProps {
  name?: string;
  role?: string;
  gender?: 'male' | 'female';
  unit?: 'sd' | 'smp' | 'tk';
  className?: string;
}

/**
 * Deteksi otomatis apakah nama/peran merujuk pada Ibu/Ustadzah/Akhwat (female)
 * atau Bapak/Ustadz/Ikhwan (male).
 */
export function inferIslamicGender(name = '', role = ''): 'male' | 'female' {
  const combined = `${name} ${role}`.toLowerCase();
  if (
    /\b(ibu|bu|bunda|ummi|umi|ustadzah|ustazah|akhwat|putri|nani|siti|aisyah|fatimah|amelia|windi|neneng|ratna|fitri|dewi|nur|rina|sri)\b/.test(
      combined
    )
  ) {
    return 'female';
  }
  return 'male';
}

/**
 * Ilustrasi Kartun Muslim / Muslimah Faceless (Tanpa Wajah) & Leher Terpotong (Terpisah)
 * Sesuai Adab & Syariat Islam (tidak menggambar fitur mata/hidung/mulut dan bagian kepala
 * terpisah dengan celah jelas dari leher/badan).
 */
export default function FacelessIslamicAvatar({
  name = '',
  role = '',
  gender,
  unit = 'sd',
  className = 'w-12 h-12',
}: FacelessIslamicAvatarProps) {
  const resolvedGender = gender || inferIslamicGender(name, role);
  const isSmp = unit === 'smp';

  const bgRing = isSmp ? 'border-[#030164]/20 bg-[#FAF6EC]' : 'border-[#00594f]/20 bg-[#FAF6EC]';
  const primaryFill = isSmp ? '#030164' : '#00594f';
  const secondaryFill = isSmp ? '#1e3a8a' : '#003831';
  const accentGold = isSmp ? '#eab308' : '#e5a93b';

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 shadow-2xs border flex items-center justify-center select-none ${bgRing} ${className}`}
      aria-label={resolvedGender === 'female' ? 'Ikon Wali Murid Ibu/Muslimah' : 'Ikon Wali Murid Bapak/Muslim'}
    >
      {resolvedGender === 'female' ? (
        /* ==================== MUSLIMAH / IBU (FACELESS + LEHER TERPOTONG SYAR'I) ==================== */
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle */}
          <circle cx="32" cy="32" r="32" fill="#FAF6EC" />
          <circle cx="32" cy="32" r="28" fill="#F3EAD6" />

          {/* Bagian Kepala + Tudung Khimar Atas (Faceless, berhenti di atas leher) */}
          <path
            d="M17 27C17 17.6112 23.7157 11 32 11C40.2843 11 47 17.6112 47 27V31.5H17V27Z"
            fill={primaryFill}
          />
          {/* Lipatan Inner Ciput */}
          <path
            d="M21.5 23C21.5 17.5 26.2 14.2 32 14.2C37.8 14.2 42.5 17.5 42.5 23"
            stroke={accentGold}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Wajah Polos Faceless (Tanpa Mata, Hidung, Mulut) */}
          <path
            d="M22.5 24.5C22.5 19.2533 26.7533 15.5 32 15.5C37.2467 15.5 41.5 19.2533 41.5 24.5V27.5C41.5 30.2 37.5 31.5 32 31.5C26.5 31.5 22.5 30.2 22.5 27.5V24.5Z"
            fill="#F6D5B8"
          />

          {/* ===== CELAH PEMISAH / POTONGAN LEHER SYAR'I (Y = 31.5 s.d 36.5) ===== */}
          {/* Garis potong leher transparan/background memastikan kepala & badan terpisah sempurna */}
          <rect x="10" y="31.5" width="44" height="5" fill="#F3EAD6" />
          <line
            x1="16"
            y1="34"
            x2="48"
            y2="34"
            stroke="#FAF6EC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Bagian Bahu & Khimar Syar'i Bawah (Mulai di bawah potongan leher Y = 36.5) */}
          <path
            d="M11 58C11 45.5 18.5 36.5 32 36.5C45.5 36.5 53 45.5 53 58V64H11V58Z"
            fill={primaryFill}
          />
          {/* Lipatan Anggun Khimar Dada */}
          <path
            d="M20 38.5C24 44 27.8 46.5 32 46.5C36.2 46.5 40 44 44 38.5"
            stroke={accentGold}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Bros Kecil Minimalis di Khimar */}
          <circle cx="32" cy="46.5" r="1.8" fill={accentGold} />
        </svg>
      ) : (
        /* ==================== MUSLIM / BAPAK / USTADZ (FACELESS + LEHER TERPOTONG SYAR'I) ==================== */
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle */}
          <circle cx="32" cy="32" r="32" fill="#FAF6EC" />
          <circle cx="32" cy="32" r="28" fill="#F3EAD6" />

          {/* Peci / Kopiah Nasional Islami */}
          <path
            d="M20.5 18.5C20.5 13.8 25.2 10.5 32 10.5C38.8 10.5 43.5 13.8 43.5 18.5V21.5H20.5V18.5Z"
            fill={secondaryFill}
          />
          <rect x="20.5" y="19.5" width="23" height="2" fill={accentGold} />

          {/* Kepala & Janggut Siluet Polos Faceless (Tanpa Mata, Hidung, Mulut) */}
          <path
            d="M21.5 21.5H42.5V26.5C42.5 29.8 38.2 31.5 32 31.5C25.8 31.5 21.5 29.8 21.5 26.5V21.5Z"
            fill="#F2CBA8"
          />

          {/* ===== CELAH PEMISAH / POTONGAN LEHER SYAR'I (Y = 31.5 s.d 36.5) ===== */}
          {/* Kepala terpisah jelas dari leher/bahu sesuai kaidah gambar syar'i */}
          <rect x="10" y="31.5" width="44" height="5" fill="#F3EAD6" />
          <line
            x1="16"
            y1="34"
            x2="48"
            y2="34"
            stroke="#FAF6EC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Baju Koko / Gamis Bapak-bapak (Mulai di bawah potongan leher Y = 36.5) */}
          <path
            d="M11 58C11 45.8 19 36.5 32 36.5C45 36.5 53 45.8 53 58V64H11V58Z"
            fill={primaryFill}
          />
          {/* Kerah Shanghai Baju Koko & Plaket Kancing */}
          <path
            d="M25.5 36.5L32 41.5L38.5 36.5"
            stroke={accentGold}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="30.8" y="41.5" width="2.4" height="15" rx="1" fill={accentGold} opacity="0.9" />
          {/* Saku Baju Koko di Dada Kiri */}
          <rect
            x="37.5"
            y="46"
            width="6.5"
            height="7"
            rx="1"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            opacity="0.55"
          />
        </svg>
      )}
    </div>
  );
}
