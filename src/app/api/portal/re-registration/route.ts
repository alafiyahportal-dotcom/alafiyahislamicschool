import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/services/whatsapp.service';
import { awardReRegistrationCommission } from '@/services/affiliate-commission';
import { sanitizeString } from '@/lib/input-validator';
import { getSession } from '@/lib/session';
import { safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawRegNo = searchParams.get('regNo');

    if (!rawRegNo) {
      return NextResponse.json(
        { success: false, error: 'Nomor registrasi (regNo) wajib disertakan' },
        { status: 400 }
      );
    }

    const regNo = sanitizeString(rawRegNo, 50);

    const registration = await prisma.pPDBRegistration.findUnique({
      where: { registrationNo: regNo },
      include: {
        school: {
          select: {
            id: true,
            slug: true,
            name: true,
            badgeText: true,
            primaryColor: true,
            accentColor: true,
          },
        },
        reRegistration: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Data registrasi murid tidak ditemukan' },
        { status: 404 }
      );
    }

    // 🔒 Privacy & Data Minimization: Mask NIK and omit raw parent data on public GET
    const safeRegistration = {
      id: registration.id,
      registrationNo: registration.registrationNo,
      studentName: registration.studentName,
      gender: registration.gender,
      pob: registration.pob,
      dob: registration.dob,
      status: registration.status,
      school: registration.school,
      nik: registration.nik ? `${registration.nik.slice(0, 4)}********${registration.nik.slice(-4)}` : null,
      reRegistration: registration.reRegistration,
    };

    return NextResponse.json({
      success: true,
      data: {
        registration: safeRegistration,
        reRegistration: registration.reRegistration,
      },
    });
  } catch (error) {
    return safeErrorResponse(error, 'Gagal mengambil data daftar ulang');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      registrationNo,
      nik,
      uniformSize,
      uniformType,
      heightCm,
      weightKg,
      shoeSize,
      boardingPreference,
      roommatePreference,
      paymentPlan = 'FULL',
      notes,
    } = body;

    const cleanRegNo = sanitizeString(registrationNo, 50);

    if (!cleanRegNo || !uniformSize) {
      return NextResponse.json(
        { success: false, error: 'Nomor registrasi dan ukuran seragam wajib diisi' },
        { status: 400 }
      );
    }

    const reg = await prisma.pPDBRegistration.findUnique({
      where: { registrationNo: cleanRegNo },
      include: {
        school: true,
      },
    });

    if (!reg) {
      return NextResponse.json(
        { success: false, error: 'Data registrasi murid tidak ditemukan' },
        { status: 404 }
      );
    }

    if (reg.status !== 'ACCEPTED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Pendaftaran ulang hanya dapat dilakukan oleh calon murid yang berstatus Diterima (ACCEPTED)',
        },
        { status: 403 }
      );
    }

    // 🔒 IDOR Prevention: If caller is not authenticated staff, verify NIK if provided
    const session = await getSession();
    const isStaff = session && ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'PPDB_OFFICER'].includes(session.role);

    if (!isStaff && nik) {
      const cleanNik = sanitizeString(nik, 20);
      if (reg.nik && reg.nik.trim() !== cleanNik.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: 'Otorisasi gagal: NIK calon murid tidak cocok dengan data pendaftaran.',
          },
          { status: 403 }
        );
      }
    }

    const reReg = await prisma.reRegistration.upsert({
      where: { registrationId: reg.id },
      create: {
        registrationId: reg.id,
        uniformSize,
        uniformType: uniformType || (reg.gender === 'L' ? 'Kemeja & Celana Panjang' : "Gamis & Jilbab Syar'i"),
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        shoeSize: shoeSize ? Number(shoeSize) : null,
        boardingPreference: boardingPreference || null,
        roommatePreference: roommatePreference || null,
        paymentPlan: paymentPlan || 'FULL',
        notes: notes || null,
        status: 'CONFIRMED',
      },
      update: {
        uniformSize,
        uniformType: uniformType || (reg.gender === 'L' ? 'Kemeja & Celana Panjang' : "Gamis & Jilbab Syar'i"),
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        shoeSize: shoeSize ? Number(shoeSize) : null,
        boardingPreference: boardingPreference || null,
        roommatePreference: roommatePreference || null,
        paymentPlan: paymentPlan || 'FULL',
        notes: notes || null,
        status: 'CONFIRMED',
      },
    });

    // Kirim notifikasi konfirmasi via WhatsApp Service
    try {
      const parentObj = JSON.parse(reg.parentData || '{}');
      const parentPhone = parentObj.fatherPhone || parentObj.motherPhone || parentObj.phone || '';
      const parentName = parentObj.fatherName || parentObj.motherName || 'Wali Murid';

      if (parentPhone) {
        await WhatsAppService.sendNotification({
          schoolId: reg.schoolId,
          recipientPhone: parentPhone,
          recipientName: parentName,
          eventType: 'RE_REGISTRATION_CONFIRMED',
          messageContent: `Bismillah. Konfirmasi Daftar Ulang & Pemesanan Seragam ananda *${reg.studentName}* (${reg.registrationNo}) di *${reg.school.name}* telah BERHASIL kami catat dengan rincian ukuran: *${uniformSize}* (${reReg.uniformType || 'Standar'}). Bukti tanda terima resmi dapat diunduh di portal: https://alafiyah.id/portal/ppdb/${reg.registrationNo}`,
          metadata: {
            registrationNo: reg.registrationNo,
            uniformSize,
            paymentPlan,
            heightCm,
            weightKg,
          },
        });
      }
    } catch (notifErr) {
      console.warn('Failed to send WA re-registration notification:', notifErr);
    }

    // Award affiliate commission for Tahap 2 (Daftar Ulang) if referred
    if (reg.affiliateId) {
      try {
        const reRegResult = await awardReRegistrationCommission(prisma, {
          id: reg.id,
          affiliateId: reg.affiliateId,
          schoolId: reg.schoolId,
          schoolSlug: reg.school.slug,
          studentName: reg.studentName,
          schoolName: reg.school.name,
        });

        if (reRegResult && reRegResult.phone) {
          await WhatsAppService.sendNotification({
            schoolId: reg.schoolId,
            recipientPhone: reRegResult.phone,
            recipientName: reRegResult.name,
            eventType: 'COMMISSION_EARNED',
            messageContent: `Assalamu'alaikum Warahmatullahi Wabarakatuh.\nYth. ${reRegResult.name},\n\nAlhamdulillah! Murid rujukan Anda atas nama *${reg.studentName}* telah resmi menyelesaikan proses *DAFTAR ULANG* di *${reg.school.name}*.\n\n🎉 *Bonus Komisi Tahap 2 (Daftar Ulang):* Rp ${reRegResult.commission.toLocaleString('id-ID')}\n📊 *Status:* DIVERIFIKASI & SIAP DICAIRKAN\n\nCek akumulasi saldo komisi di Dashboard Affiliate Al-Afiyah Anda:\n🔗 https://alafiyah.id/affiliate/dashboard\n\nJazakumullah Khairan atas kontribusi dan sinergi dakwah pendidikan bersama Yayasan Pendidikan Al-Afiyah!`,
            metadata: { studentName: reg.studentName, amount: reRegResult.commission, stage: 'DAFTAR_ULANG' },
          });
        }
      } catch (affErr) {
        console.warn('Failed to process re-registration affiliate commission:', affErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Konfirmasi daftar ulang dan pemesanan seragam berhasil disimpan.',
      data: reReg,
    });
  } catch (error) {
    console.error('Error saving re-registration:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat menyimpan daftar ulang' },
      { status: 500 }
    );
  }
}
