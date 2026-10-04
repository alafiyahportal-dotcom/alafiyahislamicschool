import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  // Reject in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Endpoint simulasi pembayaran dinonaktifkan pada lingkungan produksi.' },
      { status: 403 }
    );
  }

  // Auth check: require admin session or simulation key in development
  const session = await getSession();
  const simHeader = request.headers.get('x-simulation-key');
  const isAuthorized =
    (session && ['SUPERADMIN', 'FINANCE', 'ADMIN_TK', 'ADMIN_SD', 'ADMIN_SMP'].includes(session.role)) ||
    simHeader === 'dev-sim-key';

  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Unauthorized: Akses simulator membutuhkan autentikasi staf atau hak akses keuangan.' },
      { status: 401 }
    );
  }

  try {
    const { invoiceId, orderId, paymentMethod } = await request.json();
    const target = invoiceId || orderId;

    if (!target) {
      return NextResponse.json(
        { error: 'invoiceId atau orderId wajib diisi' },
        { status: 400 }
      );
    }

    const result = await PaymentService.simulatePaymentSuccess(target, paymentMethod || 'MIDTRANS_QRIS');
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Simulate payment error:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal memproses simulasi pembayaran' },
      { status: 500 }
    );
  }
}
