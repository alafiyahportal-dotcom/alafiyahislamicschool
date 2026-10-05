import { prisma } from '@/lib/prisma';

export interface WhatsAppPayload {
  schoolId?: string | null;
  recipientPhone: string;
  recipientName?: string;
  eventType: 'PPDB_REGISTERED' | 'PAYMENT_CONFIRMED' | 'TEST_SCHEDULED' | 'COMMISSION_EARNED' | 'ADMISSION_ANNOUNCED' | 'PAYOUT_TRANSFERRED' | 'BROADCAST_MESSAGE' | 'RE_REGISTRATION_CONFIRMED';
  messageContent: string;
  metadata?: Record<string, unknown>;
}

export class WhatsAppService {
  /**
   * Mengirim dan mencatat pesan WhatsApp ke sistem simulasi & database
   */
  static async sendNotification(payload: WhatsAppPayload) {
    const formattedPhone = payload.recipientPhone.startsWith('0')
      ? '62' + payload.recipientPhone.slice(1)
      : payload.recipientPhone;

    console.log(`\n📱 [WHATSAPP SIMULATOR TRIGGERED]`);
    console.log(`To: ${payload.recipientName || 'Penerima'} (${formattedPhone})`);
    console.log(`Event: ${payload.eventType}`);
    console.log(`Content:\n${payload.messageContent}\n`);

    const log = await prisma.notificationLog.create({
      data: {
        schoolId: payload.schoolId || null,
        recipientPhone: formattedPhone,
        recipientName: payload.recipientName || null,
        eventType: payload.eventType,
        messageContent: payload.messageContent,
        status: 'SIMULATED',
        metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
      },
    });

    return log;
  }

  /**
   * Template Notifikasi Pendaftaran Berhasil
   */
  static async notifyRegistrationCreated(params: {
    schoolId: string;
    schoolName: string;
    parentPhone: string;
    parentName: string;
    studentName: string;
    regNo: string;
    fee: number;
  }) {
    const content = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Bapak/Ibu ${params.parentName},

Alhamdulillah, pendaftaran calon murid baru di *${params.schoolName}* telah berhasil tercatat di sistem:

📋 *Nomor Registrasi:* ${params.regNo}
👤 *Nama Calon Murid:* ${params.studentName}
💰 *Biaya Formulir:* Rp ${params.fee.toLocaleString('id-ID')}
🏛️ *Status:* MENUNGGU PEMBAYARAN

Silakan selesaikan pembayaran formulir melalui Virtual Account atau QRIS di portal pendaftaran murid:
🔗 https://alafiyah.sch.id/portal/ppdb/${params.regNo}

Jazakumullah Khairan Katsiran.
_Panitia PPDB Yayasan Pendidikan Imam Bonjol Majalengka_`;

    return this.sendNotification({
      schoolId: params.schoolId,
      recipientPhone: params.parentPhone,
      recipientName: `${params.studentName} (Wali: ${params.parentName})`,
      eventType: 'PPDB_REGISTERED',
      messageContent: content,
      metadata: { regNo: params.regNo },
    });
  }

  /**
   * Template Notifikasi Pembayaran Lunas
   */
  static async notifyPaymentConfirmed(params: {
    schoolId: string;
    schoolName: string;
    parentPhone: string;
    parentName: string;
    studentName: string;
    regNo: string;
    amount: number;
    orderId: string;
  }) {
    const content = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Bapak/Ibu ${params.parentName},

Alhamdulillah, pembayaran biaya formulir PPDB *${params.schoolName}* telah *LUNAS TERVERIFIKASI*.

🧾 *No. Tagihan:* ${params.orderId}
📋 *No. Registrasi:* ${params.regNo}
👤 *Nama Murid:* ${params.studentName}
💵 *Jumlah Dibayar:* Rp ${params.amount.toLocaleString('id-ID')}
✅ *Status Berkas:* TERVERIFIKASI

Silakan unduh Kartu Ujian Observasi dan Bukti Kuitansi Lunas melalui tautan berikut:
🔗 https://alafiyah.sch.id/portal/ppdb/${params.regNo}

Grup WhatsApp Resmi Wali Murid:
👉 https://chat.whatsapp.com/alafiyah-ppdb-2026

Wassalamu'alaikum Wr. Wb.
_Panitia PPDB Yayasan Pendidikan Imam Bonjol Majalengka_`;

    return this.sendNotification({
      schoolId: params.schoolId,
      recipientPhone: params.parentPhone,
      recipientName: `${params.studentName} (Wali: ${params.parentName})`,
      eventType: 'PAYMENT_CONFIRMED',
      messageContent: content,
      metadata: { orderId: params.orderId, regNo: params.regNo },
    });
  }

  /**
   * Template Notifikasi Komisi Afiliasi Masuk
   */
  static async notifyAffiliateEarned(params: {
    affiliatePhone: string;
    affiliateName: string;
    studentName: string;
    schoolName: string;
    commissionAmount: number;
  }) {
    const content = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. ${params.affiliateName},

Kabar gembira! Murid rujukan Anda atas nama *${params.studentName}* telah melunasi pendaftaran di *${params.schoolName}*.

🎉 *Bonus Komisi Masuk:* Rp ${params.commissionAmount.toLocaleString('id-ID')}
📊 *Status:* DIVERIFIKASI & SIAP DICAIRKAN

Pantau akumulasi saldo komisi dan ajukan pencairan ke rekening bank melalui Dasbor Mitra:
🔗 https://alafiyah.sch.id/affiliate/dashboard

Terima kasih atas kontribusi dakwah dan syiar bersama Al-Afiyah!
_Tim Kemitraan Yayasan Pendidikan Imam Bonjol Majalengka_`;

    return this.sendNotification({
      recipientPhone: params.affiliatePhone,
      recipientName: params.affiliateName,
      eventType: 'COMMISSION_EARNED',
      messageContent: content,
      metadata: { studentName: params.studentName, amount: params.commissionAmount },
    });
  }

  /**
   * Template Notifikasi Jadwal Wawancara / Observasi Murid
   */
  static async notifyInterviewScheduled(params: {
    schoolId: string;
    schoolName: string;
    parentPhone: string;
    parentName: string;
    studentName: string;
    regNo: string;
    scheduleDate: string;
    testLocation: string;
  }) {
    const content = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Bapak/Ibu ${params.parentName},

Berikut kami sampaikan jadwal tes observasi & wawancara calon murid baru *${params.schoolName}*:

📋 *No. Registrasi:* ${params.regNo}
👤 *Nama Calon Murid:* ${params.studentName}
📅 *Waktu:* ${params.scheduleDate}
📍 *Tempat:* ${params.testLocation}

Mohon hadir 15 menit sebelum jadwal dengan membawa cetak Kartu Ujian dari portal murid:
🔗 https://alafiyah.sch.id/portal/ppdb/${params.regNo}

Wassalamu'alaikum Wr. Wb.
_Panitia Seleksi PPDB Yayasan Pendidikan Imam Bonjol Majalengka_`;

    return this.sendNotification({
      schoolId: params.schoolId,
      recipientPhone: params.parentPhone,
      recipientName: `${params.studentName} (Wali: ${params.parentName})`,
      eventType: 'TEST_SCHEDULED',
      messageContent: content,
      metadata: { regNo: params.regNo, scheduleDate: params.scheduleDate },
    });
  }

  /**
   * Template Notifikasi Pengumuman Hasil Seleksi / Kelulusan Murid
   */
  static async notifyAdmissionResult(params: {
    schoolId: string;
    schoolName: string;
    parentPhone: string;
    parentName: string;
    studentName: string;
    regNo: string;
    isAccepted: boolean;
    note?: string;
  }) {
    const statusText = params.isAccepted
      ? '🎉 *ALHAMDULILLAH, DINYATAKAN DITERIMA*'
      : '📋 *BELUM MEMENUHI KUOTA / CADANGAN*';

    const infoText = params.isAccepted
      ? `Selamat kepada Ananda *${params.studentName}* yang telah dinyatakan lolos observasi dan diterima sebagai murid baru di *${params.schoolName}* Tahun Ajaran 2027/2028.\n\nSilakan unduh Surat Keputusan Kelulusan dan petunjuk daftar ulang melalui portal murid:\n🔗 https://alafiyah.sch.id/portal/ppdb/${params.regNo}`
      : `Terima kasih atas partisipasi Ananda *${params.studentName}* dalam rangkaian seleksi *${params.schoolName}*. Saat ini kuota utama telah terisi penuh. Ananda kami masukkan ke dalam daftar murid cadangan gelombang berikutnya.\n\nInformasi lebih lanjut dapat dicek di portal:\n🔗 https://alafiyah.sch.id/portal/ppdb/${params.regNo}`;

    const content = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Bapak/Ibu ${params.parentName},

Berikut pengumuman resmi hasil seleksi penerimaan murid baru *${params.schoolName}*:

📋 *No. Registrasi:* ${params.regNo}
👤 *Nama Murid:* ${params.studentName}
🏆 *Hasil Seleksi:* ${statusText}

${infoText}

Jazakumullah Khairan Katsiran.
Wassalamu'alaikum Wr. Wb.
_Panitia PPDB Yayasan Pendidikan Imam Bonjol Majalengka_`;

    return this.sendNotification({
      schoolId: params.schoolId,
      recipientPhone: params.parentPhone,
      recipientName: `${params.studentName} (Wali: ${params.parentName})`,
      eventType: 'ADMISSION_ANNOUNCED',
      messageContent: content,
      metadata: { regNo: params.regNo, isAccepted: params.isAccepted },
    });
  }

  /**
   * Template Notifikasi Pencairan Komisi Mitra Ditransfer
   */
  static async notifyPayoutTransferred(params: {
    affiliatePhone: string;
    affiliateName: string;
    amount: number;
    bankName: string;
    bankAccount: string;
  }) {
    const content = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Mitra Afiliasi ${params.affiliateName},

Dana komisi kemitraan rujukan murid Anda telah *BERHASIL DITRANSFER* oleh Bagian Keuangan Yayasan Pendidikan Imam Bonjol Majalengka:

💵 *Jumlah Ditransfer:* Rp ${params.amount.toLocaleString('id-ID')}
🏦 *Bank Tujuan:* ${params.bankName}
💳 *No. Rekening:* ${params.bankAccount}
✅ *Status:* LUNAS & BERHASIL

Silakan cek mutasi rekening Anda dan pantau riwayat pencairan melalui Dasbor Mitra:
🔗 https://alafiyah.sch.id/affiliate/dashboard

Jazakumullah Khairan Katsiran atas kebersamaan dan kemitraan dakwah.
_Bagian Keuangan Yayasan Pendidikan Imam Bonjol Majalengka_`;

    return this.sendNotification({
      recipientPhone: params.affiliatePhone,
      recipientName: params.affiliateName,
      eventType: 'PAYOUT_TRANSFERRED',
      messageContent: content,
      metadata: { amount: params.amount, bankName: params.bankName },
    });
  }
}
