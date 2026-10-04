import React from 'react';

interface AlAfiyahLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'emblem' | 'shield' | 'full';
  theme?: 'emerald' | 'gold' | 'white' | 'dark';
  withText?: boolean;
  schoolSlug?: 'tk' | 'sd' | 'smp' | string;
}

const SIZES = {
  xs: { box: 'w-6 h-6', icon: 16, text: 'text-xs' },
  sm: { box: 'w-8 h-8', icon: 20, text: 'text-sm' },
  md: { box: 'w-10 h-10', icon: 26, text: 'text-base' },
  lg: { box: 'w-14 h-14', icon: 34, text: 'text-lg' },
  xl: { box: 'w-20 h-20', icon: 48, text: 'text-xl' },
  '2xl': { box: 'w-28 h-28', icon: 68, text: 'text-2xl' },
};

export default function AlAfiyahLogo({
  className = '',
  size = 'md',
  variant = 'shield',
  theme = 'emerald',
  withText = false,
  schoolSlug,
}: AlAfiyahLogoProps) {
  const sizeConfig = SIZES[size] || SIZES.md;

  // Render official SD IT Al-Afiyah emblem when schoolSlug is 'sd'
  if (schoolSlug === 'sd') {
    if (variant === 'emblem') {
      return (
        <div className={`inline-flex items-center justify-center ${sizeConfig.box} ${className}`}>
          <img
            src="/images/sd-logo.png"
            alt="Logo SD IT Al-Afiyah"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
      );
    }

    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className={`relative flex items-center justify-center ${sizeConfig.box} shrink-0`}>
          <img
            src="/images/sd-logo.png"
            alt="Logo SD IT Al-Afiyah"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>

        {withText && (
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-slate-900 leading-none">
              SD IT AL-AFIYAH
            </span>
            <span className="text-[10px] font-semibold text-[#184F48] tracking-wider uppercase mt-0.5">
              Sekolah Dasar Islam Terpadu
            </span>
          </div>
        )}
      </div>
    );
  }

  // Render pure vector emblem (Clean, geometric, bespoke Islamic & Modern Educational insignia)
  const renderEmblem = () => (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Outer Pointed Islamic Arch (Forms modern letter 'A' of Al-Afiyah) */}
      <path
        d="M32 9C26.5 14 18 19 18 30V49C18 50.1 18.9 51 20 51H44C45.1 51 46 50.1 46 49V30C46 19 37.5 14 32 9Z"
        fill="url(#archFill)"
        stroke="url(#archStroke)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Architectural Contour / Arch Line */}
      <path
        d="M32 15C28 18.8 22 22.8 22 31V47H42V31C42 22.8 36 18.8 32 15Z"
        stroke="url(#innerArchStroke)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Open Book of Knowledge (Mushaf & Modern Science) */}
      <g id="open-book">
        {/* Left Page */}
        <path
          d="M32 40C28 42.2 24.5 41.5 24.5 41.5L24.5 32C24.5 32 28 32.8 32 30.5V40Z"
          fill="url(#pageLeftFill)"
          stroke="url(#bookStroke)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Right Page */}
        <path
          d="M32 40C36 42.2 39.5 41.5 39.5 41.5L39.5 32C39.5 32 36 32.8 32 30.5V40Z"
          fill="url(#pageRightFill)"
          stroke="url(#bookStroke)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Subtle Reading Guidelines */}
        <path d="M26.5 35.5C28.5 36.2 30 35.8 31 35" stroke="url(#bookStroke)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        <path d="M33 35C34 35.8 35.5 36.2 37.5 35.5" stroke="url(#bookStroke)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        <path d="M26.5 38.5C28.5 39.2 30 38.8 31 38" stroke="url(#bookStroke)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        <path d="M33 38C34 38.8 35.5 39.2 37.5 38.5" stroke="url(#bookStroke)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Star of Hikmah & Excellence (Four-pointed geometric diamond star) */}
      <path
        d="M32 21L33.2 24.8L37 26L33.2 27.2L32 31L30.8 27.2L27 26L30.8 24.8L32 21Z"
        fill="url(#starFill)"
        stroke="url(#starStroke)"
        strokeWidth="0.75"
      />

      {/* Modern Base Horizon / Foundation Pedestal */}
      <path
        d="M15 54H49"
        stroke="url(#archStroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Gradients Definitions */}
      <defs>
        {theme === 'white' ? (
          <>
            <linearGradient id="archFill" x1="32" y1="9" x2="32" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="archStroke" x1="18" y1="9" x2="46" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCD34D" />
              <stop stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id="innerArchStroke" x1="22" y1="15" x2="42" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop stopColor="#FCD34D" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="pageLeftFill" x1="28" y1="31" x2="28" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop stopColor="#F1F5F9" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="pageRightFill" x1="36" y1="31" x2="36" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop stopColor="#F1F5F9" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="bookStroke" x1="24" y1="31" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#123E38" />
              <stop stopColor="#184F48" />
            </linearGradient>
            <linearGradient id="starFill" x1="32" y1="21" x2="32" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="starStroke" x1="32" y1="21" x2="32" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop stopColor="#F59E0B" />
            </linearGradient>
          </>
        ) : theme === 'gold' ? (
          <>
            <linearGradient id="archFill" x1="32" y1="9" x2="32" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF3C7" stopOpacity="0.4" />
              <stop stopColor="#FDE68A" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="archStroke" x1="18" y1="9" x2="46" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D97706" />
              <stop stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="innerArchStroke" x1="22" y1="15" x2="42" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" stopOpacity="0.7" />
              <stop stopColor="#B45309" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="pageLeftFill" x1="28" y1="31" x2="28" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop stopColor="#FFFBEB" />
            </linearGradient>
            <linearGradient id="pageRightFill" x1="36" y1="31" x2="36" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop stopColor="#FFFBEB" />
            </linearGradient>
            <linearGradient id="bookStroke" x1="24" y1="31" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B45309" />
              <stop stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="starFill" x1="32" y1="21" x2="32" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="starStroke" x1="32" y1="21" x2="32" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B45309" />
              <stop stopColor="#78350F" />
            </linearGradient>
          </>
        ) : (
          /* Default: Emerald Luxury Theme (for light/white surfaces) */
          <>
            <linearGradient id="archFill" x1="32" y1="9" x2="32" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#184F48" stopOpacity="0.12" />
              <stop stopColor="#184F48" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="archStroke" x1="18" y1="9" x2="46" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#184F48" />
              <stop stopColor="#0F3732" />
            </linearGradient>
            <linearGradient id="innerArchStroke" x1="22" y1="15" x2="42" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2D7A70" stopOpacity="0.7" />
              <stop stopColor="#184F48" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="pageLeftFill" x1="28" y1="31" x2="28" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop stopColor="#F0FDF4" />
            </linearGradient>
            <linearGradient id="pageRightFill" x1="36" y1="31" x2="36" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop stopColor="#F0FDF4" />
            </linearGradient>
            <linearGradient id="bookStroke" x1="24" y1="31" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#184F48" />
              <stop stopColor="#123E38" />
            </linearGradient>
            <linearGradient id="starFill" x1="32" y1="21" x2="32" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="starStroke" x1="32" y1="21" x2="32" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B45309" />
              <stop stopColor="#F59E0B" />
            </linearGradient>
          </>
        )}
      </defs>
    </svg>
  );

  // Variant: Standalone Emblem
  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${sizeConfig.box} ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  // Variant: Shield / Squircle App Icon (High-end Apple/iOS Continuous Squircle Aesthetic)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`relative flex items-center justify-center ${sizeConfig.box} rounded-[24%] p-1.5 transition-all duration-300 ${
          theme === 'white'
            ? 'bg-white/15 backdrop-blur-xl border border-white/30 shadow-lg shadow-black/10'
            : theme === 'gold'
            ? 'bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 shadow-sm'
            : 'bg-gradient-to-br from-[#123E38] to-[#184F48] border border-emerald-700/40 shadow-md shadow-emerald-950/20'
        }`}
      >
        {renderEmblem()}
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-slate-900 leading-none">
            AL-AFIYAH
          </span>
          <span className="text-[10px] font-semibold text-[#184F48] tracking-wider uppercase mt-0.5">
            Sekolah Islam Terpadu
          </span>
        </div>
      )}
    </div>
  );
}
