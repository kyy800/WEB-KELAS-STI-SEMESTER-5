import Avatar from '@/Components/Avatar';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import EmptyState from '@/Components/EmptyState';
import { SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { roleLabel } from '@/lib/format';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const roles = [
    { value: '', label: 'Semua peran' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Anggota' },
];

const statuses = [
    { value: '', label: 'Semua status' },
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' },
];

export default function Index({ users, filters }) {
    const { flash } = usePage().props;
    const [q, setQ] = useState(filters.q ?? '');
    const [role, setRole] = useState(filters.role ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const apply = (next = {}) => {
        router.get(
            route('admin.users.index'),
            {
                q: next.q ?? q,
                role: next.role ?? role,
                status: next.status ?? status,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const importResult = flash?.import_result;

    return (
        <div>
            <Head title="Kelola Pengguna" />

            <PageHeader
                title="Kelola Pengguna"
                description="Buat akun anggota, atur peran, dan nonaktifkan akun tanpa menghapus riwayatnya."
            >
                <Link
                    href={route('admin.users.import')}
                    className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                    <Icon name="upload" className="h-4 w-4" />
                    Impor CSV
                </Link>
                <Link
                    href={route('admin.users.create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Tambah pengguna
                </Link>
            </PageHeader>

            {importResult && (
                <div className="mb-5 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-500/10 p-5">
                    <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                            <Icon name="upload" className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                                Hasil impor akun
                            </h2>
                            <p className="mt-0.5 text-xs text-indigo-700 dark:text-indigo-300">
                                {importResult.created} akun dibuat, {importResult.skipped} baris
                                dilewati.
                            </p>
                            {importResult.errors?.length > 0 && (
                                <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-lg bg-white/70 dark:bg-slate-900/60 p-3 text-xs leading-5 text-rose-700 dark:text-rose-300">
                                    {importResult.errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    apply();
                }}
                className="mb-5 grid gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm sm:grid-cols-[1fr_10rem_10rem_auto]"
            >
                <div className="relative">
                    <Icon
                        name="search"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <TextInput
                        value={q}
                        onChange={(event) => setQ(event.target.value)}
                        placeholder="Cari nama, email, atau NIM…"
                        className="pl-9"
                    />
                </div>
                <SelectInput
                    value={role}
                    onChange={(event) => {
                        setRole(event.target.value);
                        apply({ role: event.target.value });
                    }}
                >
                    {roles.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </SelectInput>
                <SelectInput
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value);
                        apply({ status: event.target.value });
                    }}
                >
                    {statuses.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </SelectInput>
                <Button type="submit" variant="secondary">
                    Cari
                </Button>
            </form>

            {users.data.length === 0 ? (
                <EmptyState
                    icon="users"
                    title="Pengguna tidak ditemukan"
                    description="Coba ubah kata kunci atau filter."
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-left text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    <th className="px-4 py-3 font-semibold">Pengguna</th>
                                    <th className="px-4 py-3 font-semibold">Kontak</th>
                                    <th className="px-4 py-3 font-semibold">Peran</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Avatar user={user} size="sm" />
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {user.nim}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="text-xs text-slate-700 dark:text-slate-300">{user.email}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {user.phone || 'Kontak belum diisi'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Badge tone={user.role === 'admin' ? 'indigo' : 'slate'}>
                                                {roleLabel(user.role)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Badge tone={user.is_active ? 'emerald' : 'rose'}>
                                                {user.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex justify-end">
                                                <Link
                                                    href={route('admin.users.edit', user.id)}
                                                    className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300"
                                                >
                                                    <Icon name="edit" className="h-4 w-4" />
                                                    Ubah
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Pagination links={users.links} />
        </div>
    );
}
