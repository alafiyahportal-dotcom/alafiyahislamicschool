import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WhatsAppService } from '@/services/whatsapp.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regNo = searchParams.get('regNo');

    if (!regNo) {
      return NextResponse.json(
        { success: false, error: 'Nomor registrasi (regNo) wajib disertakan' },
        { status: 400 }
      );
    }

    const registration = await prisma.pPDBRegistration.findUnique({
      where: { registrationNo: regNo },
      include: {
        school: true,
        reRegistration: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Data registrasi murid tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        registration,
        reRegistration: registration.reRegistration,
      },
    });
  } catch (error) {
    console.error('Error fetching re-registration:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data daftar ulang' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      registrationNo,
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

    if (!registrationNo || !uniformSize) {
      return NextResponse.json(
        { success: false, error: 'Nomor registrasi dan ukuran seragam wajib diisi' },
        { status: 400 }
      );
    }

    const reg = await prisma.pPDBRegistration.findUnique({
      where: { registrationNo },
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
