import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import PPDBVerificationClient, { ApplicantItem } from '@/components/admin/PPDBVerificationClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SchoolPPDBAdmissionsPage({
  params
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const resolvedParams = await params;
  const { schoolSlug } = resolvedParams;

  if (schoolSlug !== 'tk' && schoolSlug !== 'sd' && schoolSlug !== 'smp') {
    notFound();
  }

  const school = await prisma.school.findUnique({
    where: { slug: schoolSlug },
    include: {
      ppdbRegistrations: {
        include: {
          documents: true,
          invoices: true,
          assessment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!school) {
    notFound();
  }

  const applicants: ApplicantItem[] = school.ppdbRegistrations.map((r) => {
    let parentName = 'Wali Murid';
    let parentPhone = '081234567890';
    let registrationPath = 'Reguler';
    let parentDataRaw: Record<string, any> = {};
    let schoolSpecificDataRaw: Record<string, any> = {};

    try {
      parentDataRaw = JSON.parse(r.parentData || '{}');
      parentName = parentDataRaw.fatherName || parentDataRaw.motherName || 'Wali Murid';
      parentPhone = parentDataRaw.phone || parentDataRaw.whatsapp || parentDataRaw.motherPhone || parentDataRaw.fatherPhone || '081234567890';
    } catch {
      // fallback
    }

    try {
      schoolSpecificDataRaw = JSON.parse(r.schoolSpecificData || '{}');
      registrationPath = schoolSpecificDataRaw.registrationPath || schoolSpecificDataRaw.track || schoolSpecificDataRaw.path || 'Reguler';
    } catch {
      // fallback
    }

    let dobString = '';
    if (r.dob) {
      try {
        dobString = r.dob instanceof Date ? r.dob.toISOString().substring(0, 10) : String(r.dob).substring(0, 10);
      } catch {
        dobString = String(r.dob);
      }
    }

    return {
      id: r.id,
      registrationNo: r.registrationNo,
      studentName: r.studentName,
      gender: r.gender,
      nik: r.nik,
      pob: r.pob || '',
      dob: dobString,
      address: r.address || '',
      schoolSlug: school.slug,
      schoolName: school.name,
      registrationFee: school.registrationFee,
      status: r.status,
      parentName,
      parentPhone,
      registrationPath,
      schoolSpecificDetails: schoolSpecificDataRaw,
      schoolSpecificDataRaw,
      parentDataRaw,
      assessment: r.assessment,
      documents: r.documents.map((d) => ({
        id: d.id,
        docType: d.docType,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        verificationStatus: d.verificationStatus || undefined,
        notes: d.notes || null,
      })),
      createdAt: new Date(r.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
  });

  const roleName = `ADMIN_${schoolSlug.toUpperCase()}`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      {/* Google-Style Sidebar */}
      <AdminSidebar
        schoolSlug={school.slug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
        userName={`Panitia PPDB ${school.name}`}
        currentRole={roleName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Verifikasi & Seleksi PPDB ${school.name}`}
          subtitle="Panel Penelaahan Berkas Persyaratan, Jadwal Observasi, & Keputusan Kelulusan Murid"
          currentSchoolSlug={school.slug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <PPDBVerificationClient
            schoolSlug={school.slug}
            schoolName={school.name}
            applicants={applicants}
          />
        </main>
      </div>
    </div>
  );
}
