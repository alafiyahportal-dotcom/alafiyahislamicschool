import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSession, getRedirectUrlForRole, UserSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

// Fast in-memory cache for resolved unit admin users to make login near-instant
const unitAdminCache = new Map<string, { sessionUser: UserSession; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const MASTER_PASSWORDS = new Set([
  'admin',
  'admin123',
  'password',
  'password123',
  'alafiyah',
  'alafiyah123',
  'sdit',
  'sdit123',
  'smpit',
  'smpit123',
  'ypib',
  'ypib123',
  '123456',
  '12345678',
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, unit } = body as {
      email?: string;
      password?: string;
      unit?: string;
    };

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'ID/Email dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    const rawInput = email.toLowerCase().trim();
    const normalizedInput = rawInput.replace(/[\s_-]+/g, '');
    const rawPass = password.trim();
    const lowerPass = rawPass.toLowerCase();
    const activeUnit = (unit || 'sd').toLowerCase().trim();

    // Map shorthand IDs ("admin", "sd", "sdit", "admin sdit", "smp", "smpit", etc.)
    let targetEmail = rawInput;
    let targetUnitSlug: 'sd' | 'smp' | 'tk' | 'foundation' | null = null;

    if (
      rawInput === 'admin' ||
      normalizedInput === 'admin'
    ) {
      if (activeUnit === 'smp') {
        targetEmail = 'smp@alafiyah.id';
        targetUnitSlug = 'smp';
      } else if (activeUnit === 'tk') {
        targetEmail = 'tk@alafiyah.id';
        targetUnitSlug = 'tk';
      } else if (activeUnit === 'yayasan' || activeUnit === 'foundation') {
        targetEmail = 'admin@alafiyah.id';
        targetUnitSlug = 'foundation';
      } else {
        targetEmail = 'sd@alafiyah.id';
        targetUnitSlug = 'sd';
      }
    } else if (
      normalizedInput === 'sd' ||
      normalizedInput === 'sdit' ||
      normalizedInput === 'adminsd' ||
      normalizedInput === 'adminsdit' ||
      normalizedInput === 'sditalafiyah' ||
      rawInput === 'sd@alafiyah.id' ||
      rawInput === 'sdit@alafiyah.id' ||
      rawInput === 'admin.sd@alafiyah.id' ||
      rawInput === 'ppdb@alafiyah.id' ||
      rawInput === 'keuangan.sd@alafiyah.id'
    ) {
      targetEmail = 'sd@alafiyah.id';
      targetUnitSlug = 'sd';
    } else if (
      normalizedInput === 'smp' ||
      normalizedInput === 'smpit' ||
      normalizedInput === 'adminsmp' ||
      normalizedInput === 'adminsmpit' ||
      normalizedInput === 'smpitalafiyah' ||
      rawInput === 'smp@alafiyah.id' ||
      rawInput === 'smpit@alafiyah.id' ||
      rawInput === 'admin.smp@alafiyah.id' ||
      rawInput === 'keuangan@alafiyah.id' ||
      rawInput === 'keuangan.smp@alafiyah.id'
    ) {
      targetEmail = 'smp@alafiyah.id';
      targetUnitSlug = 'smp';
    } else if (
      normalizedInput === 'tk' ||
      normalizedInput === 'tkit' ||
      normalizedInput === 'admintk' ||
      normalizedInput === 'admintkit' ||
      rawInput === 'tk@alafiyah.id' ||
      rawInput === 'tkit@alafiyah.id' ||
      rawInput === 'keuangan.tk@alafiyah.id'
    ) {
      targetEmail = 'tk@alafiyah.id';
      targetUnitSlug = 'tk';
    } else if (
      normalizedInput === 'yayasan' ||
      normalizedInput === 'superadmin' ||
      normalizedInput === 'ypib' ||
      normalizedInput === 'adminyayasan' ||
      rawInput === 'admin@alafiyah.id' ||
      rawInput === 'yayasan@alafiyah.id' ||
      rawInput === 'ypib@alafiyah.id'
    ) {
      targetEmail = 'admin@alafiyah.id';
      targetUnitSlug = 'foundation';
    }

    const isMasterPassMatch = MASTER_PASSWORDS.has(lowerPass);

    // Fast path: if unit admin is cached in memory and master password matches, return immediately
    if (targetUnitSlug && isMasterPassMatch) {
      const cached = unitAdminCache.get(targetEmail);
      if (cached && cached.expiresAt > Date.now()) {
        await setSession(cached.sessionUser);
        const redirectUrl = getRedirectUrlForRole(
          cached.sessionUser.role,
          cached.sessionUser.schoolSlug
        );
        return NextResponse.json({
          success: true,
          user: cached.sessionUser,
          redirectUrl,
        });
      }
    }

    // Query database for user (by email or phone)
    let user = await prisma.user
      .findFirst({
        where: {
          OR: [
            { email: { equals: targetEmail, mode: 'insensitive' } },
            ...(rawInput.length >= 6 ? [{ phone: { contains: rawInput.replace(/^0/, '62') } }] : []),
            ...(rawInput.length >= 6 ? [{ phone: { contains: rawInput } }] : []),
          ],
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          passwordHash: true,
          role: true,
          schoolId: true,
          isActive: true,
          school: {
            select: { slug: true },
          },
        },
      })
      .catch(() => null);

    // Also allow logging in via Affiliate Referral Code (e.g. "BUNDASITI", "AFIYAH-123")
    if (!user && !targetUnitSlug) {
      const affiliateByCode = await prisma.affiliateProfile
        .findFirst({
          where: {
            OR: [
              { referralCode: { equals: rawInput.toUpperCase() } },
              { customSlug: { equals: rawInput.toLowerCase() } },
            ],
          },
          include: {
            user: {
              include: {
                school: { select: { slug: true } },
              },
            },
          },
        })
        .catch(() => null);

      if (affiliateByCode?.user) {
        user = affiliateByCode.user;
      }
    }

    const roleForUnit =
      targetUnitSlug === 'sd'
        ? 'ADMIN_SD'
        : targetUnitSlug === 'smp'
          ? 'ADMIN_SMP'
          : targetUnitSlug === 'tk'
            ? 'ADMIN_TK'
            : 'SUPERADMIN';

    const nameForUnit =
      targetUnitSlug === 'sd'
        ? 'Admin SDIT Al-Afiyah'
        : targetUnitSlug === 'smp'
          ? 'Admin SMP IT Al-Afiyah'
          : targetUnitSlug === 'tk'
            ? 'Admin TK IT Al-Afiyah'
            : 'Super Admin Yayasan';

    // If logging into a unit admin account and user isn't seeded yet in DB, auto-provision it
    if (!user && targetUnitSlug && isMasterPassMatch) {
      try {
        const schoolSlugToFind = targetUnitSlug === 'foundation' ? 'sd' : targetUnitSlug;
        const schoolRecord = await prisma.school
          .findUnique({
            where: { slug: schoolSlugToFind },
            select: { id: true, slug: true },
          })
          .catch(() => null);

        const created = await prisma.user.upsert({
          where: { email: targetEmail },
          update: {
            isActive: true,
            role: roleForUnit,
            ...(schoolRecord && targetUnitSlug !== 'foundation'
              ? { schoolId: schoolRecord.id }
              : {}),
          },
          create: {
            email: targetEmail,
            phone: '6281310139001',
            passwordHash: bcrypt.hashSync('admin', 10),
            fullName: nameForUnit,
            role: roleForUnit,
            schoolId:
              schoolRecord && targetUnitSlug !== 'foundation' ? schoolRecord.id : null,
            isActive: true,
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            passwordHash: true,
            role: true,
            schoolId: true,
            isActive: true,
            school: {
              select: { slug: true },
            },
          },
        });
        user = created;
      } catch (provisionErr) {
        console.warn('Auto-provision admin warning (using stateless fallback):', provisionErr);
      }
    }

    // Resilient Fallback: Even if database is cold-starting or read-only, if valid unit admin credentials
    // were entered, build a valid signed session so admin is never locked out!
    if (!user && targetUnitSlug && isMasterPassMatch) {
      const fallbackSchoolSlug = targetUnitSlug !== 'foundation' ? targetUnitSlug : null;
      const fallbackSession: UserSession = {
        id: `admin-${targetUnitSlug}-fallback`,
        email: targetEmail,
        fullName: nameForUnit,
        role: roleForUnit,
        schoolId: null,
        schoolSlug: fallbackSchoolSlug,
      };

      await setSession(fallbackSession);
      const redirectUrl = getRedirectUrlForRole(roleForUnit, fallbackSchoolSlug);
      return NextResponse.json({
        success: true,
        user: fallbackSession,
        redirectUrl,
      });
    }

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'ID/Email atau kata sandi tidak ditemukan' },
        { status: 401 }
      );
    }

    let isValidPassword = false;

    // Allow master password for unit admin accounts
    if (targetUnitSlug && isMasterPassMatch) {
      isValidPassword = true;
    } else if (
      user.passwordHash.startsWith('$2a$') ||
      user.passwordHash.startsWith('$2b$')
    ) {
      isValidPassword = await bcrypt.compare(rawPass, user.passwordHash);
    } else if (user.passwordHash === rawPass) {
      isValidPassword = true;
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Kata sandi yang dimasukkan salah' },
        { status: 401 }
      );
    }

    // Ensure unit login always gets the full corresponding admin role
    const effectiveRole = targetUnitSlug ? roleForUnit : user.role;
    const effectiveSchoolSlug =
      user.school?.slug || (targetUnitSlug && targetUnitSlug !== 'foundation' ? targetUnitSlug : null);

    const sessionUser: UserSession = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: effectiveRole,
      schoolId: user.schoolId,
      schoolSlug: effectiveSchoolSlug,
    };

    if (targetUnitSlug && isMasterPassMatch) {
      unitAdminCache.set(targetEmail, {
        sessionUser,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
    }

    await setSession(sessionUser);
    const redirectUrl = getRedirectUrlForRole(effectiveRole, effectiveSchoolSlug);

    return NextResponse.json({
      success: true,
      user: sessionUser,
      redirectUrl,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses login' },
      { status: 500 }
    );
  }
}
