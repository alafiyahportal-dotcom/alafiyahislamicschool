'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Eye,
  Upload,
  ImageIcon,
  Loader2,
  Video,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Lock,
  Film,
} from 'lucide-react';
import { compressImageClient } from '@/lib/image-compress';
import {
  DEFAULT_NEWS_CATEGORIES,
  getDefaultNewsAuthors,
  mergeUniqueStrings,
  NewsMediaItem,
  parseNewsMedia,
  serializeNewsContent,
  isVideoUrl,
} from '@/lib/news-media';

export interface NewsItem {
  id: string;
  schoolId: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  isPublished: boolean;
  publishedAt: string | Date;
  createdAt: string | Date;
  school: {
    slug: string;
    name: string;
  };
}

interface NewsManagerClientProps {
  initialNews: NewsItem[];
  schoolSlug: string;
  schoolName: string;
  schoolId: string;
  initialCategories?: string[];
  initialAuthors?: string[];
}

export default function NewsManagerClient({
  initialNews,
  schoolSlug,
  schoolName,
  schoolId,
  initialCategories,
  initialAuthors,
}: NewsManagerClientProps) {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Synchronized Categories & Authors State
  const [categories, setCategories] = useState<string[]>(() => {
    const base =
      initialCategories && initialCategories.length > 0
        ? initialCategories
        : DEFAULT_NEWS_CATEGORIES;
    const fromPosts = initialNews.map((n) => (n.category || '').trim()).filter(Boolean);
    return mergeUniqueStrings(base, fromPosts);
  });

  const [authors, setAuthors] = useState<string[]>(() => {
    const base =
      initialAuthors && initialAuthors.length > 0
        ? initialAuthors
        : getDefaultNewsAuthors(schoolName);
    const fromPosts = initialNews.map((n) => (n.author || '').trim()).filter(Boolean);
    return mergeUniqueStrings(base, fromPosts);
  });

  // Article Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Category & Author Manager Modals
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isAuthorManagerOpen, setIsAuthorManagerOpen] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);

  // Category CRUD Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');

  // Author CRUD Form State
  const [newAuthorName, setNewAuthorName] = useState('');
  const [editingAuthorIndex, setEditingAuthorIndex] = useState<number | null>(null);
  const [editingAuthorValue, setEditingAuthorValue] = useState('');

  // Article Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0] || 'Kegiatan');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formExtraMedia, setFormExtraMedia] = useState<NewsMediaItem[]>([]);
  const [formAuthor, setFormAuthor] = useState(authors[0] || `Redaksi ${schoolName}`);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingExtraMedia, setIsUploadingExtraMedia] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'url'>('upload');
  const [extraMediaUrlInput, setExtraMediaUrlInput] = useState('');
  const [extraMediaTypeInput, setExtraMediaTypeInput] = useState<'image' | 'video'>('image');

  // Count how many news posts use each category (case-insensitive)
  const categoryUsageMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of categories) {
      const lower = cat.trim().toLowerCase();
      map[cat] = newsList.filter(
        (item) => (item.category || '').trim().toLowerCase() === lower
      ).length;
    }
    return map;
  }, [categories, newsList]);

  // Count how many news posts use each author
  const authorUsageMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const auth of authors) {
      const lower = auth.trim().toLowerCase();
      map[auth] = newsList.filter(
        (item) => (item.author || '').trim().toLowerCase() === lower
      ).length;
    }
    return map;
  }, [authors, newsList]);

  // Persist categories & authors to server
  const saveNewsConfigToServer = async (payload: {
    categories: string[];
    authors: string[];
    renameCategory?: { oldName: string; newName: string };
    deleteCategory?: string;
    renameAuthor?: { oldName: string; newName: string };
  }): Promise<boolean> => {
    setIsSavingConfig(true);
    setConfigError(null);
    setConfigSuccess(null);

    try {
      const res = await fetch('/api/admin/news/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          ...payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan konfigurasi');
      }
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.authors)) setAuthors(data.authors);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan konfigurasi';
      setConfigError(message);
      return false;
    } finally {
      setIsSavingConfig(false);
    }
  };

  // --- CATEGORY CRUD HANDLERS ---
  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setConfigError(`Kategori "${trimmed}" sudah ada dalam daftar.`);
      return;
    }
    const updated = [...categories, trimmed];
    const ok = await saveNewsConfigToServer({ categories: updated, authors });
    if (ok) {
      setNewCategoryName('');
      setFormCategory(trimmed);
      setConfigSuccess(`Kategori "${trimmed}" berhasil ditambahkan.`);
    }
  };

  const handleSaveRenameCategory = async (index: number) => {
    const oldName = categories[index];
    const newName = editingCategoryValue.trim();
    if (!newName || oldName === newName) {
      setEditingCategoryIndex(null);
      return;
    }
    if (
      categories.some(
        (c, idx) => idx !== index && c.toLowerCase() === newName.toLowerCase()
      )
    ) {
      setConfigError(`Kategori "${newName}" sudah ada.`);
      return;
    }

    const updated = categories.map((c, idx) => (idx === index ? newName : c));
    const ok = await saveNewsConfigToServer({
      categories: updated,
      authors,
      renameCategory: { oldName, newName },
    });

    if (ok) {
      // Update local newsList so category badges and filters stay 100% in sync immediately
      setNewsList((prev) =>
        prev.map((item) =>
          (item.category || '').trim().toLowerCase() === oldName.toLowerCase()
            ? { ...item, category: newName }
            : item
        )
      );
      if (formCategory.toLowerCase() === oldName.toLowerCase()) {
        setFormCategory(newName);
      }
      if (categoryFilter.toLowerCase() === oldName.toLowerCase()) {
        setCategoryFilter(newName);
      }
      setEditingCategoryIndex(null);
      setConfigSuccess(`Kategori "${oldName}" berhasil diubah menjadi "${newName}".`);
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    const usedCount = categoryUsageMap[cat] || 0;
    if (usedCount > 0) {
      setConfigError(
        `Kategori "${cat}" tidak dapat dihapus karena sedang terpilih pada ${usedCount} berita.`
      );
      return;
    }
    if (categories.length <= 1) {
      setConfigError('Minimal harus terdapat 1 kategori berita.');
      return;
    }

    const updated = categories.filter((c) => c !== cat);
    const ok = await saveNewsConfigToServer({
      categories: updated,
      authors,
      deleteCategory: cat,
    });

    if (ok) {
      if (formCategory === cat) {
        setFormCategory(updated[0] || 'Kegiatan');
      }
      if (categoryFilter === cat) {
        setCategoryFilter('ALL');
      }
      setConfigSuccess(`Kategori "${cat}" berhasil dihapus.`);
    }
  };

  // --- AUTHOR CRUD HANDLERS ---
  const handleAddAuthor = async () => {
    const trimmed = newAuthorName.trim();
    if (!trimmed) return;
    if (authors.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setConfigError(`Penulis "${trimmed}" sudah ada dalam daftar.`);
      return;
    }
    const updated = [...authors, trimmed];
    const ok = await saveNewsConfigToServer({ categories, authors: updated });
    if (ok) {
      setNewAuthorName('');
      setFormAuthor(trimmed);
      setConfigSuccess(`Penulis "${trimmed}" berhasil ditambahkan.`);
    }
  };

  const handleSaveRenameAuthor = async (index: number) => {
    const oldName = authors[index];
    const newName = editingAuthorValue.trim();
    if (!newName || oldName === newName) {
      setEditingAuthorIndex(null);
      return;
    }
    if (
      authors.some(
        (a, idx) => idx !== index && a.toLowerCase() === newName.toLowerCase()
      )
    ) {
      setConfigError(`Penulis "${newName}" sudah ada.`);
      return;
    }

    const updated = authors.map((a, idx) => (idx === index ? newName : a));
    const ok = await saveNewsConfigToServer({
      categories,
      authors: updated,
      renameAuthor: { oldName, newName },
    });

    if (ok) {
      setNewsList((prev) =>
        prev.map((item) =>
          (item.author || '').trim().toLowerCase() === oldName.toLowerCase()
            ? { ...item, author: newName }
            : item
        )
      );
      if (formAuthor.toLowerCase() === oldName.toLowerCase()) {
        setFormAuthor(newName);
      }
      setEditingAuthorIndex(null);
      setConfigSuccess(`Nama penulis "${oldName}" berhasil diubah menjadi "${newName}".`);
    }
  };

  const handleDeleteAuthor = async (authorName: string) => {
    if (authors.length <= 1) {
      setConfigError('Minimal harus terdapat 1 data penulis/redaksi.');
      return;
    }
    const updated = authors.filter((a) => a !== authorName);
    const ok = await saveNewsConfigToServer({
      categories,
      authors: updated,
    });
    if (ok) {
      if (formAuthor === authorName) {
        setFormAuthor(updated[0] || `Redaksi ${schoolName}`);
      }
      setConfigSuccess(`Data penulis "${authorName}" berhasil dihapus.`);
    }
  };

  // --- COVER IMAGE & MULTI-MEDIA UPLOAD HANDLERS ---
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Berkas sampul utama harus berupa gambar (JPG, PNG, WebP)');
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage(null);

    try {
      const compressed = await compressImageClient(file, 1200, 800, 0.85);
      setFormCoverImage(compressed.dataUrl);
    } catch (err: unknown) {
      console.error('Image compression error:', err);
      const message = err instanceof Error ? err.message : 'Gagal memproses gambar sampul artikel';
      setErrorMessage(message);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleExtraPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingExtraMedia(true);
    setErrorMessage(null);

    try {
      const uploadedItems: NewsMediaItem[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageClient(file, 1200, 800, 0.84);
        uploadedItems.push({
          type: 'image',
          url: compressed.dataUrl,
        });
      }
      if (uploadedItems.length > 0) {
        setFormExtraMedia((prev) => [...prev, ...uploadedItems]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengunggah foto tambahan';
      setErrorMessage(message);
    } finally {
      setIsUploadingExtraMedia(false);
      e.target.value = '';
    }
  };

  const handleExtraVideosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingExtraMedia(true);
    setErrorMessage(null);

    try {
      const uploadedVideos: NewsMediaItem[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('schoolSlug', schoolSlug);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Gagal mengunggah video ${file.name}`);
        }
        uploadedVideos.push({
          type: 'video',
          url: data.url,
        });
      }
      if (uploadedVideos.length > 0) {
        setFormExtraMedia((prev) => [...prev, ...uploadedVideos]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengunggah video berita';
      setErrorMessage(message);
    } finally {
      setIsUploadingExtraMedia(false);
      e.target.value = '';
    }
  };

  const handleAddExtraMediaByUrl = () => {
    const trimmed = extraMediaUrlInput.trim();
    if (!trimmed) return;
    const detectedType: 'image' | 'video' =
      extraMediaTypeInput === 'video' || isVideoUrl(trimmed) ? 'video' : 'image';
    setFormExtraMedia((prev) => [...prev, { type: detectedType, url: trimmed }]);
    setExtraMediaUrlInput('');
  };

  const handleMoveExtraMedia = (index: number, direction: 'left' | 'right') => {
    setFormExtraMedia((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleRemoveExtraMedia = (index: number) => {
    setFormExtraMedia((prev) => prev.filter((_, idx) => idx !== index));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory(categories[0] || 'Kegiatan');
    setFormExcerpt('');
    setFormContent('');
    setFormCoverImage('/images/sd-activity-classroom-6b.jpg');
    setFormExtraMedia([]);
    setFormAuthor(authors[0] || `Redaksi ${schoolName}`);
    setFormIsPublished(true);
    setImageUploadMode('upload');
    setExtraMediaUrlInput('');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    const parsed = parseNewsMedia(item.content, item.coverImage);
    setEditingItem(item);
    setFormTitle(item.title);

    // Ensure item's category & author exist in dropdown lists
    if (
      item.category &&
      !categories.some((c) => c.toLowerCase() === item.category.trim().toLowerCase())
    ) {
      setCategories((prev) => [...prev, item.category.trim()]);
    }
    if (
      item.author &&
      !authors.some((a) => a.toLowerCase() === item.author.trim().toLowerCase())
    ) {
      setAuthors((prev) => [...prev, item.author.trim()]);
    }

    setFormCategory(item.category || categories[0] || 'Kegiatan');
    setFormExcerpt(item.excerpt || '');
    setFormContent(parsed.cleanContent);
    setFormCoverImage(item.coverImage || '/images/sd-activity-classroom-6b.jpg');
    setFormExtraMedia(parsed.extraMedia);
    setFormAuthor(item.author || authors[0] || `Redaksi ${schoolName}`);
    setFormIsPublished(item.isPublished);
    setImageUploadMode(
      item.coverImage?.startsWith('data:') || !item.coverImage?.startsWith('http')
        ? 'upload'
        : 'url'
    );
    setExtraMediaUrlInput('');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanText = formContent.trim();
    if (!formTitle.trim() || !cleanText) {
      setErrorMessage('Judul berita dan isi artikel wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const serializedContent = serializeNewsContent(cleanText, formExtraMedia);
      const computedExcerpt =
        formExcerpt.trim() || cleanText.slice(0, 150) + (cleanText.length > 150 ? '...' : '');

      if (editingItem) {
        const res = await fetch(`/api/admin/news/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle.trim(),
            category: formCategory,
            excerpt: computedExcerpt,
            content: serializedContent,
            coverImage: formCoverImage.trim() || '/images/sd-activity-classroom-6b.jpg',
            author: formAuthor,
            isPublished: formIsPublished,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal memperbarui berita');

        setNewsList((prev) =>
          prev.map((item) => (item.id === editingItem.id ? data.news : item))
        );
      } else {
        const res = await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolId,
            title: formTitle.trim(),
            category: formCategory,
            excerpt: computedExcerpt,
            content: serializedContent,
            coverImage: formCoverImage.trim() || '/images/sd-activity-classroom-6b.jpg',
            author: formAuthor,
            isPublished: formIsPublished,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menerbitkan berita');

        setNewsList((prev) => [data.news, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus artikel');

      setNewsList((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus artikel';
      alert(message);
    }
  };

  const handleTogglePublish = async (item: NewsItem) => {
    try {
      const res = await fetch(`/api/admin/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah status publikasi');

      setNewsList((prev) =>
        prev.map((n) => (n.id === item.id ? data.news : n))
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah status publikasi';
      alert(message);
    }
  };

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      const parsed = parseNewsMedia(item.content, item.coverImage);
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        parsed.cleanContent.toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.author || '').toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === 'ALL' ||
        (item.category || '').trim().toLowerCase() === categoryFilter.trim().toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [newsList, searchQuery, categoryFilter]);

  const previewMediaData = useMemo(() => {
    if (!previewItem) return null;
    return parseNewsMedia(previewItem.content, previewItem.coverImage);
  }, [previewItem]);

  return (
    <div className="space-y-6">
      {/* Top Action & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul berita, topik, atau penulis..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setConfigError(null);
                setConfigSuccess(null);
                setIsCategoryManagerOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              Kelola Kategori ({categories.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setConfigError(null);
                setConfigSuccess(null);
                setIsAuthorManagerOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-700" />
              Kelola Penulis ({authors.length})
            </button>

            <a
              href={`/${schoolSlug === 'sd' ? 'sd/berita' : schoolSlug === 'smp' ? 'smp/berita' : 'berita'}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Halaman Publik
            </a>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tulis Berita Baru
            </button>
          </div>
        </div>

        {/* Synchronized Dynamic Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Semua</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                categoryFilter === 'ALL'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {newsList.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = categoryUsageMap[cat] || 0;
            const isActive =
              categoryFilter.trim().toLowerCase() === cat.trim().toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Belum Ada Artikel Berita</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Publikasikan kabar kegiatan murid, prestasi lomba, wisuda tahfidz, atau pengumuman resmi untuk {schoolName}.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            Tulis Berita Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNews.map((item) => {
            const parsed = parseNewsMedia(item.content, item.coverImage);
            const totalSlides = parsed.allMedia.length;
            const videoCount = parsed.allMedia.filter((m) => m.type === 'video').length;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div
                  onClick={() => {
                    setPreviewItem(item);
                    setPreviewSlideIndex(0);
                  }}
                  className="relative h-52 bg-slate-100 overflow-hidden cursor-pointer"
                  title="Klik untuk pratinjau penuh artikel"
                >
                  <Image
                    src={item.coverImage || '/images/sd-activity-classroom-6b.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 text-xs font-bold shadow-sm">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      Pratinjau Penuh ({totalSlides} Slide)
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/75 text-white backdrop-blur-xs">
                      {item.category}
                    </span>
                    {totalSlides > 1 && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-700/90 text-white backdrop-blur-xs flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {totalSlides} Media
                        {videoCount > 0 ? ` (${videoCount} Video)` : ''}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePublish(item);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-xs transition-colors cursor-pointer ${
                        item.isPublished
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-amber-500/90 text-white'
                      }`}
                    >
                      {item.isPublished ? 'Tayang' : 'Draft'}
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3.5 h-3.5" />
                      {item.author}
                    </span>
                  </div>

                  <h3
                    onClick={() => {
                      setPreviewItem(item);
                      setPreviewSlideIndex(0);
                    }}
                    className="font-bold text-slate-900 text-base line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {item.excerpt || parsed.cleanContent}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewItem(item);
                          setPreviewSlideIndex(0);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Baca
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Berita
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 1: KELOLA KATEGORI BERITA (Tambah, Edit/Rename, Hapus Aman) */}
      {/* ================================================================= */}
      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Kelola Kategori Berita
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sinkron otomatis antara Form Admin dan Filter Pengunjung Website
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryManagerOpen(false);
                  setEditingCategoryIndex(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {configError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{configError}</span>
                </div>
              )}
              {configSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{configSuccess}</span>
                </div>
              )}

              {/* Add New Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tambah Kategori Baru
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                    placeholder="Contoh: Field Study, Ekstrakurikuler, Prestasi..."
                    className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    disabled={isSavingConfig || !newCategoryName.trim()}
                    onClick={handleAddCategory}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah
                  </button>
                </div>
              </div>

              {/* Category List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Daftar Kategori Saat Ini ({categories.length})
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Kategori terpakai tidak dapat dihapus
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {categories.map((cat, idx) => {
                    const usedCount = categoryUsageMap[cat] || 0;
                    const isEditing = editingCategoryIndex === idx;

                    return (
                      <div
                        key={cat}
                        className="p-3 bg-white hover:bg-slate-50/80 flex items-center justify-between gap-3"
                      >
                        {isEditing ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editingCategoryValue}
                              onChange={(e) => setEditingCategoryValue(e.target.value)}
                              className="flex-1 px-3 py-1.5 text-sm border border-emerald-400 rounded-lg focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              disabled={isSavingConfig}
                              onClick={() => handleSaveRenameCategory(idx)}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategoryIndex(null)}
                              className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="font-bold text-sm text-slate-800 truncate">
                                {cat}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                  usedCount > 0
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {usedCount} berita
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategoryIndex(idx);
                                  setEditingCategoryValue(cat);
                                  setConfigError(null);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                                title="Ubah nama kategori"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                              </button>

                              {usedCount > 0 ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfigError(
                                      `Kategori "${cat}" sedang digunakan pada ${usedCount} berita sehingga tidak dapat dihapus.`
                                    )
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
                                  title={`Tidak dapat dihapus karena digunakan pada ${usedCount} berita`}
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                  Terkunci
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isSavingConfig}
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus kategori ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Hapus
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryManagerOpen(false);
                  setEditingCategoryIndex(null);
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: KELOLA DATA PENULIS / REDAKSI (Tambah, Edit, Hapus)      */}
      {/* ================================================================= */}
      {isAuthorManagerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Kelola Data Penulis / Redaksi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tambah, ubah, atau hapus pilihan nama penulis pada dropdown berita
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAuthorManagerOpen(false);
                  setEditingAuthorIndex(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {configError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{configError}</span>
                </div>
              )}
              {configSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{configSuccess}</span>
                </div>
              )}

              {/* Add New Author */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tambah Penulis / Redaksi Baru
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAuthor();
                      }
                    }}
                    placeholder="Contoh: Ust. Febrian Fauzi, S.Pd., M.Pd. / Tim Humas SDIT"
                    className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    disabled={isSavingConfig || !newAuthorName.trim()}
                    onClick={handleAddAuthor}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah
                  </button>
                </div>
              </div>

              {/* Authors List */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Daftar Penulis Tersedia ({authors.length})
                </label>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {authors.map((authorName, idx) => {
                    const usedCount = authorUsageMap[authorName] || 0;
                    const isEditing = editingAuthorIndex === idx;

                    return (
                      <div
                        key={authorName}
                        className="p-3 bg-white hover:bg-slate-50/80 flex items-center justify-between gap-3"
                      >
                        {isEditing ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editingAuthorValue}
                              onChange={(e) => setEditingAuthorValue(e.target.value)}
                              className="flex-1 px-3 py-1.5 text-sm border border-emerald-400 rounded-lg focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              disabled={isSavingConfig}
                              onClick={() => handleSaveRenameAuthor(idx)}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingAuthorIndex(null)}
                              className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="font-bold text-sm text-slate-800 truncate">
                                {authorName}
                              </span>
                              {usedCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {usedCount} berita
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAuthorIndex(idx);
                                  setEditingAuthorValue(authorName);
                                  setConfigError(null);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={isSavingConfig}
                                onClick={() => handleDeleteAuthor(authorName)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAuthorManagerOpen(false);
                  setEditingAuthorIndex(null);
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: PRATINJAU PENUH ARTIKEL (Full-Area + Media Carousel)     */}
      {/* ================================================================= */}
      {previewItem && previewMediaData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-[96vw] max-w-[1440px] h-[92vh] max-h-[94vh] overflow-hidden flex flex-col lg:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
              aria-label="Tutup pratinjau"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Interactive Media Carousel (Cover Image at Slide 1 + Extra Photos/Videos) */}
            <div className="relative w-full lg:w-[54%] h-[38vh] sm:h-[44vh] lg:h-full bg-slate-950 shrink-0 flex flex-col justify-between overflow-hidden select-none">
              <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
                {(() => {
                  const slides = previewMediaData.allMedia;
                  const activeSlide =
                    slides[previewSlideIndex] ||
                    slides[0] || {
                      type: 'image',
                      url: '/images/sd-activity-classroom-6b.jpg',
                    };

                  if (activeSlide.type === 'video') {
                    return (
                      <video
                        key={activeSlide.url}
                        src={activeSlide.url}
                        controls
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      />
                    );
                  }

                  return (
                    <Image
                      key={activeSlide.url}
                      src={activeSlide.url}
                      alt={previewItem.title}
                      fill
                      className="object-contain bg-slate-950"
                      unoptimized
                    />
                  );
                })()}

                {/* Top Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                    {previewItem.category}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                      previewItem.isPublished
                        ? 'bg-white/90 text-emerald-800'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {previewItem.isPublished ? 'Publik (Tayang)' : 'Draft Internal'}
                  </span>
                  {previewMediaData.allMedia.length > 1 && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      Slide {previewSlideIndex + 1} / {previewMediaData.allMedia.length}
                      {previewSlideIndex === 0 ? ' (Sampul Utama)' : ''}
                    </span>
                  )}
                </div>

                {/* Prev / Next Navigation Buttons */}
                {previewMediaData.allMedia.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewSlideIndex((prev) =>
                          prev === 0 ? previewMediaData.allMedia.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
                      title="Slide Sebelumnya"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewSlideIndex((prev) =>
                          prev === previewMediaData.allMedia.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
                      title="Slide Berikutnya"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip at Bottom of Media Column */}
              {previewMediaData.allMedia.length > 1 && (
                <div className="bg-slate-900/95 border-t border-white/10 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
                  {previewMediaData.allMedia.map((media, idx) => (
                    <button
                      key={`${media.url}-${idx}`}
                      type="button"
                      onClick={() => setPreviewSlideIndex(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        idx === previewSlideIndex
                          ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-105'
                          : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {media.type === 'video' ? (
                        <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-white">
                          <Film className="w-4 h-4 text-emerald-400" />
                          <span className="text-[9px] font-bold mt-0.5">VIDEO</span>
                        </div>
                      ) : (
                        <Image
                          src={media.url}
                          alt={`Slide ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-[8px] font-bold text-white text-center leading-tight py-0.5">
                          SAMPUL
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Full Article Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
              <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                    {previewItem.school?.name || schoolName}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(previewItem.publishedAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {previewItem.author}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-5">
                  {previewItem.title}
                </h2>

                {previewItem.excerpt && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 text-sm font-medium leading-relaxed mb-6">
                    {previewItem.excerpt}
                  </div>
                )}

                <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {previewMediaData.cleanContent}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const itemToEdit = previewItem;
                    setPreviewItem(null);
                    openEditModal(itemToEdit);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Artikel Ini
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 4: TULIS / EDIT ARTIKEL BERITA                              */}
      {/* ================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingItem ? 'Edit Artikel Berita' : 'Tulis Artikel Berita Baru'}
                </h2>
                <p className="text-xs text-slate-500">{schoolName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Kegiatan Market Day & Pameran Karya Sains Siswa SDIT Al-Afiyah"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Dropdown Kategori Berita & Dropdown Nama Penulis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5 inline mr-1" />
                      Kategori Berita
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setConfigError(null);
                        setConfigSuccess(null);
                        setIsCategoryManagerOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      <Settings2 className="w-3 h-3" />
                      Tambah / Edit Kategori
                    </button>
                  </div>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <User className="w-3.5 h-3.5 inline mr-1" />
                      Nama Penulis / Redaksi
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setConfigError(null);
                        setConfigSuccess(null);
                        setIsAuthorManagerOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      <Settings2 className="w-3 h-3" />
                      Tambah / Edit Penulis
                    </button>
                  </div>
                  <select
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                  >
                    {authors.map((authName) => (
                      <option key={authName} value={authName}>
                        {authName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SLIDE #1: FOTO SAMPUL UTAMA */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Slide #1 (Paling Depan) — Foto Sampul Utama *
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Foto ini menjadi sampul kartu berita dan selalu tampil pada urutan pertama slide
                    </p>
                  </div>
                  <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('upload')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        imageUploadMode === 'upload'
                          ? 'bg-white text-emerald-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Unggah Berkas
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        imageUploadMode === 'url'
                          ? 'bg-white text-emerald-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tautan URL
                    </button>
                  </div>
                </div>

                {imageUploadMode === 'upload' ? (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-white hover:bg-emerald-50/30 transition-colors">
                      <div className="flex flex-col items-center justify-center py-4 px-4 text-center">
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mb-1.5" />
                            <p className="text-xs font-semibold text-emerald-700">
                              Mengoptimalkan gambar sampul...
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                            <p className="text-xs font-semibold text-slate-700">
                              Klik untuk memilih foto sampul utama dari perangkat
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              JPG, PNG, atau WebP (Otomatis dikompresi agar cepat dimuat)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formCoverImage.startsWith('data:') ? '' : formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="/images/sd-activity-classroom-6b.jpg atau https://..."
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                )}
              </div>

              {/* SLIDE #2..N: GALERI FOTO & VIDEO TAMBAHAN */}
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Galeri Slide Tambahan (Multi-Foto & Video Dokumentasi)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Tambahkan banyak foto maupun video kegiatan. Pengunjung dapat menggeser tombol Next / Prev pada berita.
                    </p>
                  </div>
                  {isUploadingExtraMedia && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengunggah media...
                    </span>
                  )}
                </div>

                {/* Upload Buttons for Multiple Photos & Videos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs">
                    <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>+ Unggah Foto Tambahan (Bisa Banyak)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploadingExtraMedia}
                      onChange={handleExtraPhotosUpload}
                      className="hidden"
                    />
                  </label>

                  <label className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs">
                    <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>+ Unggah Video (MP4 / WebM / MOV)</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      multiple
                      disabled={isUploadingExtraMedia}
                      onChange={handleExtraVideosUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Optional Direct URL Input for Extra Media */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={extraMediaTypeInput}
                    onChange={(e) =>
                      setExtraMediaTypeInput(e.target.value as 'image' | 'video')
                    }
                    className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-700"
                  >
                    <option value="image">URL Foto</option>
                    <option value="video">URL Video</option>
                  </select>
                  <input
                    type="text"
                    value={extraMediaUrlInput}
                    onChange={(e) => setExtraMediaUrlInput(e.target.value)}
                    placeholder="Atau tempel tautan URL foto/video tambahan di sini..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddExtraMediaByUrl}
                    disabled={!extraMediaUrlInput.trim()}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Tambah Slide
                  </button>
                </div>

                {/* Ordered Slide Preview Strip (Slide 1 = Cover Image, Slide 2..N = Extra Media) */}
                <div>
                  <div className="text-[11px] font-bold text-slate-600 mb-2 flex items-center justify-between">
                    <span>
                      Urutan Tampilan Slide ({1 + formExtraMedia.length} Media):
                    </span>
                    <span className="text-emerald-700">
                      Slide #1 selalu Foto Sampul Utama
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Slide 1: Cover Image */}
                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 bg-slate-900 aspect-video group">
                      <Image
                        src={formCoverImage || '/images/sd-activity-classroom-6b.jpg'}
                        alt="Sampul Utama"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold shadow-xs">
                        SLIDE 1 • SAMPUL
                      </div>
                    </div>

                    {/* Slides 2..N: Extra Photos & Videos */}
                    {formExtraMedia.map((media, idx) => (
                      <div
                        key={`${media.url}-${idx}`}
                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video group"
                      >
                        {media.type === 'video' ? (
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <Image
                            src={media.url}
                            alt={`Slide ${idx + 2}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}

                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold flex items-center gap-1">
                          {media.type === 'video' ? (
                            <>
                              <Film className="w-3 h-3 text-emerald-400" />
                              SLIDE {idx + 2} • VIDEO
                            </>
                          ) : (
                            <>SLIDE {idx + 2} • FOTO</>
                          )}
                        </div>

                        {/* Reorder & Delete Controls */}
                        <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between bg-slate-950/75 backdrop-blur-xs rounded-lg px-1.5 py-1">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveExtraMedia(idx, 'left')}
                              className="p-1 text-white hover:text-emerald-400 disabled:opacity-30 cursor-pointer"
                              title="Geser ke kiri"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formExtraMedia.length - 1}
                              onClick={() => handleMoveExtraMedia(idx, 'right')}
                              className="p-1 text-white hover:text-emerald-400 disabled:opacity-30 cursor-pointer"
                              title="Geser ke kanan"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveExtraMedia(idx)}
                            className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                            title="Hapus slide ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat yang tampil pada kartu halaman depan..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Isi Lengkap Artikel Berita *
                </label>
                <textarea
                  rows={7}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Tuliskan laporan lengkap kegiatan, tanggal pelaksanaan, antusiasme murid, serta hikmah/pesan pendidikan..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    Langsung Tayangkan di Halaman Publik
                  </span>
                </label>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    {isSubmitting
                      ? 'Menyimpan...'
                      : editingItem
                        ? 'Simpan Perubahan'
                        : 'Terbitkan Berita'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
