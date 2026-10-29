import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSession, getRedirectUrlForRole, UserSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

// Fast in-memory cache for resolved unit admin users to make login near-instant
const unitAdminCache = new Map<string, { sessionUser: UserSession; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    const rawPass = password.trim();
    const activeUnit = (unit || 'sd').toLowerCase().trim();

    // Map shorthand IDs ("admin", "sd", "sdit", etc.) and unify SD sub-roles into one Admin SD account
    let targetEmail = rawInput;
    let targetUnitSlug: 'sd' | 'smp' | 'tk' | 'foundation' | null = null;

    if (
      rawInput === 'admin' ||
      rawInput === 'sd' ||
      rawInput === 'sdit' ||
      rawInput === 'admin_sd' ||
      rawInput === 'sd@alafiyah.id' ||
      rawInput === 'ppdb@alafiyah.id' ||
      rawInput === 'keuangan.sd@alafiyah.id'
    ) {
      if (rawInput === 'admin' && activeUnit === 'smp') {
        targetEmail = 'smp@alafiyah.id';
        targetUnitSlug = 'smp';
      } else if (rawInput === 'admin' && activeUnit === 'tk') {
        targetEmail = 'tk@alafiyah.id';
        targetUnitSlug = 'tk';
      } else if (rawInput === 'admin' && activeUnit === 'yayasan') {
        targetEmail = 'admin@alafiyah.id';
        targetUnitSlug = 'foundation';
      } else {
        targetEmail = 'sd@alafiyah.id';
        targetUnitSlug = 'sd';
      }
    } else if (
      rawInput === 'smp' ||
      rawInput === 'smpit' ||
      rawInput === 'admin_smp' ||
      rawInput === 'smp@alafiyah.id'
    ) {
      targetEmail = 'smp@alafiyah.id';
      targetUnitSlug = 'smp';
    } else if (
      rawInput === 'tk' ||
      rawInput === 'tkit' ||
      rawInput === 'admin_tk' ||
      rawInput === 'tk@alafiyah.id'
    ) {
      targetEmail = 'tk@alafiyah.id';
      targetUnitSlug = 'tk';
    } else if (
      rawInput === 'yayasan' ||
      rawInput === 'superadmin' ||
      rawInput === 'admin@alafiyah.id'
    ) {
      targetEmail = 'admin@alafiyah.id';
      targetUnitSlug = 'foundation';
    }

    const isMasterPassMatch =
      rawPass === 'admin' || rawPass === 'password123' || rawPass === 'admin123';

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

    let user = await prisma.user
      .findUnique({
        where: { email: targetEmail },
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

    // If logging into a unit admin account and user isn't seeded yet in DB, auto-provision it
    if (!user && targetUnitSlug && isMasterPassMatch) {
      try {
        const schoolSlugToFind = targetUnitSlug === 'foundation' ? 'sd' : targetUnitSlug;
        const schoolRecord = await prisma.school.findUnique({
          where: { slug: schoolSlugToFind },
          select: { id: true, slug: true },
        });

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
        console.warn('Auto-provision admin warning:', provisionErr);
      }
    }

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'ID/Email atau kata sandi tidak valid' },
        { status: 401 }
      );
    }

    let isValidPassword = false;

    // Allow unified password ("admin" or "password123") for unit admin accounts
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
        { error: 'ID/Email atau kata sandi tidak valid' },
        { status: 401 }
      );
    }

    // Ensure SD login always gets full ADMIN_SD access (no restricted sub-roles)
    const effectiveRole =
      targetUnitSlug === 'sd' ? 'ADMIN_SD' : user.role;
    const effectiveSchoolSlug =
      user.school?.slug || (targetUnitSlug !== 'foundation' ? targetUnitSlug : null);

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
