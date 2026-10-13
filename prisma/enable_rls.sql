-- ==============================================================================
-- SQL Script: Aktifkan Row Level Security (RLS) di Seluruh Tabel Publik Supabase
-- Proyek: siakad-alafiyah (Ekosistem Pendidikan Terpadu Al-Afiyah)
-- ==============================================================================
-- RLS mengamankan tabel agar tidak dapat diakses/diubah secara liar melalui 
-- Supabase REST Data API (PostgREST) dengan anon key.
-- Koneksi Prisma (melalui DATABASE_URL dengan user postgres) tetap berjalan normal 
-- karena user postgres secara default memiliki hak bypass RLS.
-- ==============================================================================

-- 1. Opsi Otomatis: Aktifkan RLS untuk semua tabel di schema public (kecuali prisma migrations)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename NOT LIKE '_prisma%'
    ) 
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
    END LOOP;
END $$;

-- 2. Daftar Eksplisit Tabel Schema Al-Afiyah (Idempoten):
ALTER TABLE IF EXISTS public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ppdb_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ppdb_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.affiliate_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.re_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ppdb_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tuition_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tahfidz_progress ENABLE ROW LEVEL SECURITY;

-- 3. Proteksi Ekstra: Cabut akses PostgREST API publik (anon & authenticated)
-- Karena aplikasi Al-Afiyah berkomunikasi via Prisma backend, API publik tidak perlu dibuka.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon, authenticated;
