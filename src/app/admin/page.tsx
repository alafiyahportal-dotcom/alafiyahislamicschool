import { redirect } from 'next/navigation';
import { getSession, getRedirectUrlForRole } from '@/lib/session';

export default async function AdminRootPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }
  const redirectUrl = getRedirectUrlForRole(session.role, session.schoolSlug);
  redirect(redirectUrl);
}
