'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

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
}

const CATEGORIES = ['Kegiatan', 'Prestasi', 'Tahfidz', 'Pengumuman', 'Kajian'];

export default function NewsManagerClient({
  initialNews,
  schoolSlug,
  schoolName,
  schoolId,
}: NewsManagerClientProps) {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Kegiatan');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formAuthor, setFormAuthor] = useState(`Humas ${schoolName}`);
  const [formIsPublished, setFormIsPublished] = useState(true);

  const openAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Kegiatan');
    setFormExcerpt('');
    setFormContent('');
    setFormCoverImage('/images/sd-activity-classroom-6b.jpg');
    setFormAuthor(`Humas ${schoolName}`);
    setFormIsPublished(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormExcerpt(item.excerpt);
    setFormContent(item.content);
    setFormCoverImage(item.coverImage || '');
    setFormAuthor(item.author);
    setFormIsPublished(item.isPublished);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      setErrorMessage('Judul artikel dan isi konten berita wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingItem) {
        // Update Article
        const res = await fetch(`/api/admin/news/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle.trim(),
            category: formCategory,
            excerpt: formExcerpt.trim() || formContent.slice(0, 150) + '...',
            content: formContent.trim(),
            coverImage: formCoverImage.trim() || null,
            author: formAuthor.trim(),
            isPublished: formIsPublished,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal memperbarui artikel');

        setNewsList((prev) =>
          prev.map((n) => (n.id === editingItem.id ? data.news : n))
        );
      } else {
        // Create Article
        const res = await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolId,
            title: formTitle.trim(),
            category: formCategory,
            excerpt: formExcerpt.trim() || formContent.slice(0, 150) + '...',
            content: formContent.trim(),
            coverImage: formCoverImage.trim() || null,
            author: formAuthor.trim(),
            isPublished: formIsPublished,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menerbitkan artikel');

        setNewsList((prev) => [data.news, ...prev]);
      }
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (item: NewsItem) => {
    const updatedStatus = !item.isPublished;
    try {
      const res = await fetch(`/api/admin/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: updatedStatus }),
      });
      if (res.ok) {
        setNewsList((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isPublished: updatedStatus } : n))
        );
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel berita "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNewsList((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert('Gagal menghapus artikel berita');
      }
    } catch (err) {
      console.error('Failed to delete news:', err);
      alert('Terjadi kesalahan saat menghapus artikel');
    }
  };

  const filteredNews = newsList.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (categoryFilter !== 'ALL' && n.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Prestasi':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Tahfidz':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pengumuman':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Kajian':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul berita, ringkasan, atau penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                categoryFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({newsList.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = newsList.filter((n) => n.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Add News Button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Berita Baru</span>
          </button>
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Newspaper className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak ada artikel berita ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Silakan tambahkan artikel kegiatan sekolah untuk menginformasikan agenda terbaru ke wali murid dan masyarakat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Cover Image */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={
                    item.coverImage ||
                    '/images/sd-activity-classroom-6b.jpg'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border shadow-xs backdrop-blur-xs ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-xs backdrop-blur-xs ${
                      item.isPublished
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-slate-700/80 text-slate-200'
                    }`}
                  >
                    {item.isPublished ? 'Tayang' : 'Draft'}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(item.publishedAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                    <span>•</span>
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{item.author}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 line-clamp-2 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau Artikel</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-all"
                      title="Edit Artikel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem ? 'Edit Artikel Berita' : 'Tulis Berita & Agenda Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">Unit: {schoolName}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Artikel / Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Semarak Wisuda Tahfidz Juz 30 Angkatan Ke-IV"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Berita
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Penulis / Redaksi
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Gambar Utama (*Cover Image*)
                </label>
                <input
                  type="url"
                  placeholder="/images/sd-activity-classroom-6b.jpg"
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Singkat (*Excerpt*)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat pengantar artikel..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Lengkap Berita (*Content*) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Tuliskan jalannya kegiatan, kutipan pimpinan, hasil acara, dan dokumentasi selengkapnya..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedToggle"
                  checked={formIsPublished}
                  onChange={(e) => setFormIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300"
                />
                <label htmlFor="isPublishedToggle" className="text-xs font-semibold text-slate-700">
                  Terbitkan artikel ini secara publik di landing page ({schoolName})
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 rounded-lg transition-all shadow-sm active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan & Publikasikan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pratinjau Artikel Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCategoryBadgeClass(
                  previewItem.category
                )}`}
              >
                {previewItem.category}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {previewItem.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span>{previewItem.author}</span>
                <span>•</span>
                <span>
                  {new Date(previewItem.publishedAt).toLocaleDateString('id-ID', {
                    dateStyle: 'full',
                  })}
                </span>
              </div>

              {previewItem.coverImage && (
                <div className="rounded-xl overflow-hidden shadow-sm max-h-72">
                  <img
                    src={previewItem.coverImage}
                    alt={previewItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-2">
                {previewItem.content}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
