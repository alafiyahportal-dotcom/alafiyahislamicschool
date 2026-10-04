'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  KeyRound,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X
} from 'lucide-react';

interface SchoolItem {
  id: string;
  slug: string;
  name: string;
  unitLevel: string;
}

interface UserItem {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  schoolId: string | null;
  isActive: boolean;
  createdAt: string;
  school?: {
    id: string;
    slug: string;
    name: string;
    unitLevel: string;
  } | null;
}

interface UserManagerClientProps {
  initialUsers: UserItem[];
  schools: SchoolItem[];
}

export default function UserManagerClient({ initialUsers, schools }: UserManagerClientProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedSchool, setSelectedSchool] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Form States (Add)
  const [addForm, setAddForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'ADMIN_SD',
    schoolId: schools[1]?.id || '',
    password: '',
  });

  // Form States (Edit)
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    schoolId: '',
    newPassword: '',
  });

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    const matchesSchool =
      selectedSchool === 'ALL' ||
      (selectedSchool === 'FOUNDATION' && u.schoolId === null) ||
      u.school?.slug === selectedSchool;

    return matchesSearch && matchesRole && matchesSchool;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Superadmin Yayasan
          </span>
        );
      case 'ADMIN_TK':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Admin TK IT
          </span>
        );
      case 'ADMIN_SD':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
            Admin SD IT
          </span>
        );
      case 'ADMIN_SMP':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#064E3B] text-emerald-100 border border-emerald-700">
            Admin SMP IT
          </span>
        );
      case 'FINANCE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Bendahara / Kasir
          </span>
        );
      case 'PPDB_OFFICER':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Petugas PPDB
          </span>
        );
      case 'AFFILIATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Mitra Afiliasi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {role}
          </span>
        );
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    setLoadingAction(user.id);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isActive: !user.isActive } : u))
        );
        setActionMessage({ type: 'success', text: result.message });
      } else {
        setActionMessage({ type: 'error', text: result.error || 'Gagal mengubah status akun' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Terjadi kesalahan koneksi sistem' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('add');
    setActionMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setUsers((prev) => [result.user, ...prev]);
        setIsAddModalOpen(false);
        setAddForm({
          fullName: '',
          email: '',
          phone: '',
          role: 'ADMIN_SD',
          schoolId: schools[1]?.id || '',
          password: '',
        });
        setActionMessage({ type: 'success', text: 'Akun staf baru berhasil ditambahkan' });
      } else {
        setActionMessage({ type: 'error', text: result.error || 'Gagal menambahkan staf' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Terjadi kesalahan koneksi' });
    } finally {
      setLoadingAction(null);
    }
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      schoolId: user.schoolId || '',
      newPassword: '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoadingAction('edit');
    setActionMessage(null);
    try {
      const payload: any = {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
        schoolId: editForm.schoolId || null,
      };
      if (editForm.newPassword) {
        payload.password = editForm.newPassword;
      }

      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...result.user } : u))
        );
        setIsEditModalOpen(false);
        setActionMessage({ type: 'success', text: 'Perubahan akun berhasil disimpan' });
      } else {
        setActionMessage({ type: 'error', text: result.error || 'Gagal menyimpan perubahan' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun staf "${user.fullName}" (${user.email})?`)) {
      return;
    }
    setLoadingAction(user.id);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setActionMessage({ type: 'success', text: result.message });
      } else {
        setActionMessage({ type: 'error', text: result.error || 'Gagal menghapus pengguna' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#2D7A70] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Tata Kelola Hak Akses (RBAC)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Pengguna & Staf Yayasan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur kewenangan hak akses Kepala Sekolah, Panitia PPDB, Bendahara Kasir, dan Petugas Unit.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="py-2.5 px-4 bg-[#2D7A70] hover:bg-[#184F48] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center space-x-2 cursor-pointer w-fit"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Staf Baru</span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium animate-fadeIn ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama staf, alamat email, atau nomor HP..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
          />
        </div>

        {/* Role Filter */}
        <div className="relative w-full md:w-56">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
            aria-label="Filter Peran Akun"
          >
            <option value="ALL">Semua Peran (Roles)</option>
            <option value="SUPERADMIN">Superadmin Yayasan</option>
            <option value="ADMIN_TK">Admin TK IT</option>
            <option value="ADMIN_SD">Admin SD IT</option>
            <option value="ADMIN_SMP">Admin SMP IT</option>
            <option value="FINANCE">Bendahara / Kasir</option>
            <option value="PPDB_OFFICER">Petugas Seleksi PPDB</option>
            <option value="AFFILIATE">Mitra Afiliasi</option>
          </select>
        </div>

        {/* School Unit Filter */}
        <div className="relative w-full md:w-56">
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
            aria-label="Filter Unit Penugasan"
          >
            <option value="ALL">Semua Penugasan</option>
            <option value="FOUNDATION">Pusat Yayasan (Lintas Unit)</option>
            <option value="tk">PAUD / TK IT Al-Afiyah</option>
            <option value="sd">SD IT Al-Afiyah</option>
            <option value="smp">SMP IT Al-Afiyah</option>
          </select>
        </div>
      </div>

      {/* 3. User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & Email</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Unit Penugasan</th>
                <th className="py-3 px-4">Kontak Telepon</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>

                    {/* School Assignment */}
                    <td className="py-3.5 px-4">
                      {user.school ? (
                        <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-[#2D7A70]" />
                          <span>{user.school.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pusat Yayasan</span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {user.phone ? (
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{user.phone}</span>
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Active Status & Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        disabled={loadingAction === user.id}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          user.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        <span>{user.isActive ? 'Aktif' : 'Dinonaktifkan'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-slate-600 hover:text-[#2D7A70] hover:bg-[#E8F3F1] rounded-lg transition-colors cursor-pointer"
                          title="Edit Pengguna & Sandi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user.role !== 'SUPERADMIN' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Akun Staf"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    Tidak ada akun staf yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 text-[11px] font-semibold text-slate-500 flex justify-between">
          <span>Menampilkan {filteredUsers.length} dari {users.length} Akun Staf Terdaftar</span>
          <span>Yayasan Pendidikan Imam Bonjol Majalengka</span>
        </div>
      </div>

      {/* 4. Modal: Tambah Staf Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#2D7A70]">
                <UserPlus className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-900">Tambah Akun Staf Baru</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                  placeholder="Contoh: Ibu Nurul Hidayati, S.Pd.I"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="nama@alafiyah.sch.id"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Peran / Hak Akses <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                  >
                    <option value="ADMIN_TK">Admin Unit TK IT</option>
                    <option value="ADMIN_SD">Admin Unit SD IT</option>
                    <option value="ADMIN_SMP">Admin Unit SMP IT</option>
                    <option value="PPDB_OFFICER">Petugas Seleksi PPDB</option>
                    <option value="FINANCE">Bendahara / Kasir Tata Usaha</option>
                    <option value="SUPERADMIN">Superadmin Yayasan (Pusat)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Penugasan</label>
                  <select
                    disabled={addForm.role === 'SUPERADMIN'}
                    value={addForm.schoolId}
                    onChange={(e) => setAddForm({ ...addForm, schoolId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Kata Sandi Awal (Password)
                </label>
                <input
                  type="text"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Kosongkan jika menggunakan standar: password123"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Default sandi sistem: <strong>password123</strong> (staf dapat menggantinya saat login pertama kali).
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingAction === 'add'}
                  className="py-2 px-4 bg-[#2D7A70] hover:bg-[#184F48] text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {loadingAction === 'add' ? 'Menyimpan...' : 'Simpan Akun Staf'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Edit Akun & Ganti Sandi */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#2D7A70]">
                <Edit2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-900">Perbarui Akun & Hak Akses</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peran / Hak Akses</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                  >
                    <option value="ADMIN_TK">Admin Unit TK IT</option>
                    <option value="ADMIN_SD">Admin Unit SD IT</option>
                    <option value="ADMIN_SMP">Admin Unit SMP IT</option>
                    <option value="PPDB_OFFICER">Petugas Seleksi PPDB</option>
                    <option value="FINANCE">Bendahara / Kasir Tata Usaha</option>
                    <option value="SUPERADMIN">Superadmin Yayasan (Pusat)</option>
                    <option value="AFFILIATE">Mitra Afiliasi</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Penugasan</label>
                  <select
                    disabled={editForm.role === 'SUPERADMIN'}
                    value={editForm.schoolId}
                    onChange={(e) => setEditForm({ ...editForm, schoolId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">Pusat Yayasan</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ganti Kata Sandi Baru (Opsional)
                </label>
                <input
                  type="text"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  placeholder="Kosongkan jika tidak ingin mengubah kata sandi"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingAction === 'edit'}
                  className="py-2 px-4 bg-[#2D7A70] hover:bg-[#184F48] text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {loadingAction === 'edit' ? 'Menyimpan...' : 'Perbarui Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
