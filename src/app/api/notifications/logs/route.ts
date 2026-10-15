import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';
import { maskSensitiveData, safeErrorResponse } from '@/lib/security';

/**
 * Notification Logs Audit Endpoint (Point 10 & 15)
 * Protected with RBAC: Only staff and administrators can view notification history.
 * Multi-tenant isolation: Unit staff only see their own school's notifications.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'PPDB_OFFICER', 'FINANCE'],
    });
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const requestedSchoolId = searchParams.get('schoolId');

    // Tenant boundary: If user is not SUPERADMIN, enforce their assigned school
    const effectiveSchoolId =
      auth.session.role !== 'SUPERADMIN' && auth.session.schoolId
        ? auth.session.schoolId
        : requestedSchoolId || undefined;

    const logs = await prisma.notificationLog.findMany({
      where: effectiveSchoolId ? { schoolId: effectiveSchoolId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        school: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    });

    // Mask phone numbers in response for privacy protection (Point 15)
    const sanitizedLogs = logs.map((log) => ({
      ...log,
      recipientPhone: log.recipientPhone
        ? maskSensitiveData(log.recipientPhone)
        : '-',
    }));

    return NextResponse.json({
      success: true,
      logs: sanitizedLogs,
    });
  } catch (error) {
    return safeErrorResponse(error, 'Gagal mengambil log notifikasi');
  }
}
