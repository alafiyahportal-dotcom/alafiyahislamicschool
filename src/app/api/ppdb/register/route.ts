import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentService } from '@/services/payment.service';
import { WhatsAppService } from '@/services/whatsapp.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      schoolSlug,
      studentName,
      nik,
      gender,
      pob,
      dob,
      address,
      schoolSpecificData,
      parentData,
      referralCode,
      uploadedDocs,
    } = body;

    if (!schoolSlug || !studentName || !nik) {
      return NextResponse.json(
        { error: 'Mohon lengkapi data wajib (Pilihan Sekolah, Nama Murid, dan NIK)' },
        { status: 400 }
      );
    }

    // 1. Find school
    const school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
    });

    if (!school) {
      return NextResponse.json({ error: 'Unit sekolah tidak valid' }, { status: 400 });
    }

    // Check if PPDB is open for this school
    if (!school.isPpdbOpen) {
      return NextResponse.json(
        { error: `Pendaftaran murid baru untuk ${school.name} saat ini sedang ditutup atau kuota telah terpenuhi.` },
        { status: 400 }
      );
    }

    // Check quota capacity
    const currentApplicantCount = await prisma.pPDBRegistration.count({
      where: { schoolId: school.id },
    });
    if (school.quota > 0 && currentApplicantCount >= school.quota) {
      return NextResponse.json(
        { error: `Mohon maaf, kuota pendaftaran untuk ${school.name} (${school.quota} murid) telah terpenuhi.` },
        { status: 400 }
      );
    }

    // 2. Check referral code if provided
    let affiliateId: string | null = null;
    if (referralCode) {
      const affiliate = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [
            { referralCode: referralCode.toUpperCase() },
            { customSlug: referralCode.toLowerCase() },
          ],
        },
      });
      if (affiliate) {
        affiliateId = affiliate.id;
      }
    }

    // 3. Generate unique registration number: REG-[SLUG]-[YEAR]-[RANDOM]
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regNo = `REG-${school.slug.toUpperCase()}-2026-${randomSuffix}`;

    // 4. Create registration record
    const registration = await prisma.pPDBRegistration.create({
      data: {
        registrationNo: regNo,
        schoolId: school.id,
        studentName,
        nik,
        gender: gender || 'L',
        pob: pob || 'Majalengka',
        dob: dob ? new Date(dob) : new Date('2019-01-01'),
        address: address || 'Majalengka',
        schoolSpecificData: JSON.stringify(schoolSpecificData || {}),
        parentData: JSON.stringify(parentData || {}),
        status: 'PAYMENT_PENDING',
        registrationFee: school.registrationFee,
        affiliateId,
      },
    });

    // 5. Create Documents if any
    if (Array.isArray(uploadedDocs) && uploadedDocs.length > 0) {
      for (const doc of uploadedDocs) {
        await prisma.pPDBDocument.create({
          data: {
            registrationId: registration.id,
            docType: doc.docType || 'KK',
            fileName: doc.fileName || 'dokumen.pdf',
            fileUrl: doc.fileUrl || '/uploads/sample.pdf',
            verificationStatus: 'PENDING',
          },
        });
      }
    }

    // 6. Create Invoice
    const invoice = await PaymentService.createRegistrationInvoice(registration.id);

    // 7. Trigger WhatsApp notification to Parent
    const parentPhone = parentData?.motherPhone || parentData?.fatherPhone || '6281234567890';
    const parentName = parentData?.fatherName || parentData?.motherName || 'Bapak/Ibu Wali Murid';

    await WhatsAppService.notifyRegistrationCreated({
      schoolId: school.id,
      schoolName: school.name,
      parentPhone,
      parentName,
      studentName,
      regNo,
      fee: school.registrationFee,
    });

    return NextResponse.json({
      success: true,
      registration,
      invoice,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan sistem saat memproses pendaftaran' },
      { status: 500 }
    );
  }
}
