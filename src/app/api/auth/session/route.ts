import { NextResponse } from 'next/server';
import { getSession, clearSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }
  return NextResponse.json({ authenticated: true, user: session });
}

export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}
