import React from 'react';
import SchoolCMSEditorPage from '@/app/admin/[schoolSlug]/cms/page';

export const dynamic = 'force-dynamic';

export default async function FoundationCMSEditorPage() {
  return <SchoolCMSEditorPage params={Promise.resolve({ schoolSlug: 'foundation' })} />;
}
