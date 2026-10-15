import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { sanitizeString, isValidNik } from '@/lib/input-validator';
import { safeErrorResponse, sanitizeApiOutput } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      registrationNo,
      studentName,
      nik,
      gender,
      pob,
      dob,
      address,
      schoolSpecificData,
      parentData,
    } = body;

    const cleanRegNo = sanitizeString(registrationNo, 50);

    if (!cleanRegNo) {
      return NextResponse.json(
        { success: false, error: 'Nomor registrasi wajib disertakan' },
        { status: 400 }
      );
    }

    const existing = await prisma.pPDBRegistration.findUnique({
      where: { registrationNo: cleanRegNo },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Data pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // 🔒 IDOR Prevention:
    // Verify that the requestor either has an active staff session OR provides the matching NIK
    const session = await getSession();
    const isStaff = session && ['SUPERADMIN', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP', 'PPDB_OFFICER'].includes(session.role);

    if (!isStaff) {
      const cleanNik = nik ? sanitizeString(nik, 20) : '';
      if (!cleanNik || (existing.nik && existing.nik.trim() !== cleanNik.trim())) {
        return NextResponse.json(
          {
            success: false,
            error: 'Otorisasi gagal: NIK calon murid wajib disertakan dan harus sesuai dengan data registrasi.',
          },
          { status: 403 }
        );
      }
    }

    // Merge existing specific data and parent data safely
    let mergedSpecific = {};
    try {
      mergedSpecific = JSON.parse(existing.schoolSpecificData || '{}');
    } catch {
      mergedSpecific = {};
    }

    let mergedParent = {};
    try {
      mergedParent = JSON.parse(existing.parentData || '{}');
    } catch {
      mergedParent = {};
    }

    const updatedSpecificData = {
      ...mergedSpecific,
      ...(schoolSpecificData || {}),
      lastUpdatedBiodataAt: new Date().toISOString(),
    };

    const updatedParentData = {
      ...mergedParent,
      ...(parentData || {}),
    };

    const updated = await prisma.pPDBRegistration.update({
      where: { registrationNo: cleanRegNo },
      data: {
        ...(studentName ? { studentName: sanitizeString(studentName, 100) } : {}),
        ...(nik && isValidNik(nik) ? { nik: nik.trim() } : {}),
        ...(gender && ['L', 'P'].includes(gender) ? { gender } : {}),
        ...(pob ? { pob: sanitizeString(pob, 100) } : {}),
        ...(dob && !isNaN(new Date(dob).getTime()) ? { dob: new Date(dob) } : {}),
        ...(address ? { address: sanitizeString(address, 255) } : {}),
        schoolSpecificData: JSON.stringify(updatedSpecificData),
        parentData: JSON.stringify(updatedParentData),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Biodata formulir berhasil diperbarui dan disusulkan',
      data: sanitizeApiOutput(updated),
    });
  } catch (error) {
    return safeErrorResponse(error, 'Terjadi kesalahan sistem saat memperbarui data');
  }
}
