import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    if (!registrationNo) {
      return NextResponse.json(
        { error: 'Nomor registrasi wajib disertakan' },
        { status: 400 }
      );
    }

    const existing = await prisma.pPDBRegistration.findUnique({
      where: { registrationNo },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Data pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    // Merge existing specific data and parent data
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
      where: { registrationNo },
      data: {
        ...(studentName ? { studentName } : {}),
        ...(nik ? { nik } : {}),
        ...(gender ? { gender } : {}),
        ...(pob ? { pob } : {}),
        ...(dob ? { dob: new Date(dob) } : {}),
        ...(address ? { address } : {}),
        schoolSpecificData: JSON.stringify(updatedSpecificData),
        parentData: JSON.stringify(updatedParentData),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Biodata formulir berhasil diperbarui dan disusulkan',
      data: updated,
    });
  } catch (error) {
    console.error('Failed to update PPDB biodata:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memperbarui data' },
      { status: 500 }
    );
  }
}
