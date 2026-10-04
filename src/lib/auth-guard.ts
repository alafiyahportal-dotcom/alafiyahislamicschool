import { NextResponse } from 'next/server';
import { getSession, UserSession } from '@/lib/session';

export interface AuthGuardOptions {
  allowedRoles?: string[];
  targetSchoolSlug?: string | null;
}

export type AuthResult =
  | { session: UserSession; error?: never }
  | { session?: never; error: NextResponse };

/**
 * Helper to enforce authentication, role checks, and tenant isolation in API routes.
 */
export async function requireAuth(options?: AuthGuardOptions): Promise<AuthResult> {
  const session = await getSession();

  if (!session) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: 'Sesi tidak valid atau telah berakhir. Silakan login kembali.',
        },
        { status: 401 }
      ),
    };
  }

  // SUPERADMIN always has access to all resources
  if (session.role === 'SUPERADMIN') {
    return { session };
  }

  // Role validation
  if (options?.allowedRoles && options.allowedRoles.length > 0) {
    if (!options.allowedRoles.includes(session.role)) {
      return {
        error: NextResponse.json(
          {
            success: false,
            error: 'Akses ditolak: Anda tidak memiliki wewenang untuk tindakan ini.',
          },
          { status: 403 }
        ),
      };
    }
  }

  // Tenant / school isolation check
  if (options?.targetSchoolSlug) {
    const target = options.targetSchoolSlug.toLowerCase();
    // If user belongs to a specific school, ensure it matches target school
    if (session.schoolSlug && session.schoolSlug.toLowerCase() !== target) {
      return {
        error: NextResponse.json(
          {
            success: false,
            error: `Akses ditolak: Anda tidak memiliki wewenang pada unit sekolah ${target.toUpperCase()}.`,
          },
          { status: 403 }
        ),
      };
    }
  }

  return { session };
}
