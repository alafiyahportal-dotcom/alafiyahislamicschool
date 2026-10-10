import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/services/whatsapp.service';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const segment = searchParams.get('segment') || 'ACCEPTED';
    const requestedSlug = searchParams.get('schoolSlug') || 'all';

    const schoolSlug =
      auth.session.role !== 'SUPERADMIN' && auth.session.schoolSlug
        ? auth.session.schoolSlug
        : requestedSlug;

    // 1. Hitung total per segmen untuk dashboard counter
    const schoolFilter = schoolSlug !== 'all' ? { school: { slug: schoolSlug } } : {};
    const [pendingCount, verifiedCount, acceptedCount, allApplicantsCount, affiliateCount] = await Promise.all([
      prisma.pPDBRegistration.count({ where: { status: 'PAYMENT_PENDING', ...schoolFilter } }),
      prisma.pPDBRegistration.count({ where: { status: 'VERIFIED', ...schoolFilter } }),
      prisma.pPDBRegistration.count({ where: { status: 'ACCEPTED', ...schoolFilter } }),
      prisma.pPDBRegistration.count({ where: schoolFilter }),
      prisma.affiliateProfile.count(),
    ]);

    // 2. Query penerima berdasarkan segmen yang dipilih
    let recipients: Array<{
      id: string;
      studentName: string;
      parentName: string;
      phone: string;
      registrationNo: string;
      schoolName: string;
      schoolSlug: string;
      status: string;
    }> = [];

    if (segment === 'AFFILIATE_ACTIVE') {
      if (auth.session.role !== 'SUPERADMIN') {
        return NextResponse.json(
          { error: 'Akses ditolak: Hanya SUPERADMIN yang dapat menyiarkan ke mitra afiliasi.' },
          { status: 403 }
        );
      }

      const affiliates = await prisma.affiliateProfile.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });

      recipients = affiliates.map((aff) => ({
        id: aff.id,
        studentName: aff.user.fullName,
        parentName: 'Mitra Afiliasi',
        phone: aff.user.phone || '6281200000000',
        registrationNo: aff.referralCode,
        schoolName: 'Yayasan Imam Bonjol',
        schoolSlug: 'foundation',
        status: 'ACTIVE_AFFILIATE',
      }));
    } else {
      const whereClause: Record<string, unknown> = {};

      if (segment === 'PAYMENT_PENDING') {
        whereClause.status = 'PAYMENT_PENDING';
      } else if (segment === 'VERIFIED') {
        whereClause.status = 'VERIFIED';
      } else if (segment === 'ACCEPTED') {
        whereClause.status = 'ACCEPTED';
      }

      if (schoolSlug !== 'all') {
        whereClause.school = { slug: schoolSlug };
      }

      const muridList = await prisma.pPDBRegistration.findMany({
        where: whereClause,
        include: { school: true },
        orderBy: { createdAt: 'desc' },
      });

      recipients = muridList.map((reg) => {
        let parentData: Record<string, string> = {};
        try {
          parentData = JSON.parse(reg.parentData || '{}');
        } catch {
          // ignore
        }

        const phone = parentData.motherPhone || parentData.fatherPhone || '628122334455';
        const parentName = parentData.motherName || parentData.fatherName || 'Wali Murid';

        return {
          id: reg.id,
          studentName: reg.studentName,
          parentName,
          phone,
          registrationNo: reg.registrationNo,
          schoolName: reg.school.name,
          schoolSlug: reg.school.slug,
          status: reg.status,
        };
      });
    }

    return NextResponse.json({
      success: true,
      segmentCounts: {
        PAYMENT_PENDING: pendingCount,
        VERIFIED: verifiedCount,
        ACCEPTED: acceptedCount,
        ALL_APPLICANTS: allApplicantsCount,
        AFFILIATE_ACTIVE: affiliateCount,
      },
      recipients,
    });
  } catch (error) {
    console.error('Error fetching broadcast recipients:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data penerima siaran' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth({
      allowedRoles: ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'],
    });
    if (auth.error) return auth.error;

    const body = await request.json();
    const { segment, schoolSlug: requestedSlug = 'all', templateContent, recipientIds, broadcastTitle } = body;

    const schoolSlug =
      auth.session.role !== 'SUPERADMIN' && auth.session.schoolSlug
        ? auth.session.schoolSlug
        : requestedSlug;

    if (!templateContent || typeof templateContent !== 'string' || !templateContent.trim()) {
      return NextResponse.json(
        { success: false, error: 'Konten pesan siaran tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Ambil daftar penerima
    let targetRecipients: Array<{
      id: string;
      studentName: string;
      parentName: string;
      phone: string;
      registrationNo: string;
      schoolName: string;
      schoolId?: string;
    }> = [];

    if (segment === 'AFFILIATE_ACTIVE') {
      if (auth.session.role !== 'SUPERADMIN') {
        return NextResponse.json(
          { error: 'Akses ditolak: Hanya SUPERADMIN yang dapat menyiarkan ke mitra afiliasi.' },
          { status: 403 }
        );
      }

      const affiliates = await prisma.affiliateProfile.findMany({
        include: { user: true },
        where: recipientIds && recipientIds.length > 0 ? { id: { in: recipientIds } } : undefined,
      });

      targetRecipients = affiliates.map((aff) => ({
        id: aff.id,
        studentName: aff.user.fullName,
        parentName: 'Mitra Afiliasi',
        phone: aff.user.phone || '6281200000000',
        registrationNo: aff.referralCode,
        schoolName: 'Yayasan Imam Bonjol',
      }));
    } else {
      const whereClause: Record<string, unknown> = {};

      if (segment === 'PAYMENT_PENDING') whereClause.status = 'PAYMENT_PENDING';
      if (segment === 'VERIFIED') whereClause.status = 'VERIFIED';
      if (segment === 'ACCEPTED') whereClause.status = 'ACCEPTED';

      if (schoolSlug !== 'all') {
        whereClause.school = { slug: schoolSlug };
      }

      if (recipientIds && recipientIds.length > 0) {
        whereClause.id = { in: recipientIds };
      }

      const muridList = await prisma.pPDBRegistration.findMany({
        where: whereClause,
        include: { school: true },
      });

      targetRecipients = muridList.map((reg) => {
        let parentData: Record<string, string> = {};
        try {
          parentData = JSON.parse(reg.parentData || '{}');
        } catch {
          // ignore
        }

        const phone = parentData.motherPhone || parentData.fatherPhone || '628122334455';
        const parentName = parentData.motherName || parentData.fatherName || 'Wali Murid';

        return {
          id: reg.id,
          studentName: reg.studentName,
          parentName,
          phone,
          registrationNo: reg.registrationNo,
          schoolName: reg.school.name,
          schoolId: reg.schoolId,
        };
      });
    }

    if (targetRecipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada penerima yang cocok dengan kriteria' },
        { status: 400 }
      );
    }

    // Eksekusi pengiriman bertahap (Simulator Logging)
    const logs = [];
    for (const r of targetRecipients) {
      const personalizedMessage = templateContent
        .replace(/{nama_murid}/g, r.studentName)
        .replace(/{nama_wali}/g, r.parentName)
        .replace(/{no_registrasi}/g, r.registrationNo)
        .replace(/{nama_sekolah}/g, r.schoolName)
        .replace(/{link_portal}/g, `https://alafiyah.id/portal/ppdb/${r.registrationNo}`);

      const log = await WhatsAppService.sendNotification({
        schoolId: r.schoolId || null,
        recipientPhone: r.phone,
        recipientName: `${r.studentName} (${r.parentName})`,
        eventType: 'BROADCAST_MESSAGE',
        messageContent: personalizedMessage,
        metadata: {
          broadcastTitle: broadcastTitle || 'Siaran Notifikasi Massal',
          segment,
          regNo: r.registrationNo,
        },
      });

      logs.push(log);
    }

    return NextResponse.json({
      success: true,
      totalSent: logs.length,
      broadcastTitle: broadcastTitle || 'Siaran Notifikasi Massal',
      segment,
      logs: logs.map((l) => ({
        id: l.id,
        recipientPhone: l.recipientPhone,
        recipientName: l.recipientName,
        status: l.status,
        createdAt: l.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error executing broadcast:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kegagalan saat memproses pengiriman siaran' },
      { status: 500 }
    );
  }
}
