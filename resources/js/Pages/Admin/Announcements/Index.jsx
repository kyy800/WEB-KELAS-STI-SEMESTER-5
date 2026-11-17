import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import { SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { categoryLabel, categoryTone, excerpt, formatDate } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const categories = [
    { value: '', label: 'Semua kategori' },
    { value: 'akademik', label: 'Akademik' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'umum', label: 'Umum' },
];

export default function Index({ announcements, filters }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [category, setCategory] = useState(filters.category ?? '');

    const apply = (next = {}) => {
        router.get(
            route('admin.announcements.index'),
            {
                q: next.q ?? q,
                category: next.category ?? category,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const togglePin = (announcement) => {
        router.patch(
            route('admin.announcements.pin', announcement.id),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <div>
            <Head title="Kelola Pengumuman" />

            <PageHeader
                title="Kelola Pengumuman"
                description="Publikasikan informasi akademik, kegiatan, dan pengumuman umum untuk seluruh kelas."
            >
                <Link
                    href={route('admin.announcements.create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Tambah pengumuman
                </Link>
            </PageHeader>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    apply();
                }}
                className="mb-5 grid gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm sm:grid-cols-[1fr_14rem_auto]"
            >
                <div className="relative">
                    <Icon
                        name="search"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <TextInput
                        value={q}
                        onChange={(event) => setQ(event.target.value)}
                        placeholder="Cari judul atau isi pengumuman…"
                        className="pl-9"
                    />
                </div>
                <SelectInput
                    value={category}
                    onChange={(event) => {
                        setCategory(event.target.value);
                        apply({ category: event.target.value });
                    }}
                >
                    {categories.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </SelectInput>
                <Button type="submit" variant="secondary">
                    Cari
                </Button>
            </form>

            {announcements.data.length === 0 ? (
                <EmptyState
                    icon="megaphone"
                    title="Belum ada pengumuman"
                    description="Buat pengumuman pertama agar informasi kelas tersampaikan."
                    action={
                        <Link
                            href={route('admin.announcements.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Tambah pengumuman
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {announcements.data.map((announcement) => (
                        <article
                            key={announcement.id}
                            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {announcement.is_pinned && (
                                            <Badge tone="amber">
                                                <Icon name="pin" className="h-3 w-3" />
                                                Disematkan
                                            </Badge>
                                        )}
                                        <Badge tone={categoryTone(announcement.category)}>
                                            {categoryLabel(announcement.category)}
                                        </Badge>
                                        <span className="text-xs text-slate-400 dark:text-slate-500">
                                            {formatDate(announcement.published_at)}
                                        </span>
                                        {announcement.attachments_count > 0 && (
                                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                                <Icon name="file" className="h-3.5 w-3.5" />
                                                {announcement.attachments_count} lampiran
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">
                                        {announcement.title}
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        {excerpt(announcement.body, 220)}
                                    </p>
                                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                        Penulis: {announcement.author?.name ?? 'Admin'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => togglePin(announcement)}
                                        title={
                                            announcement.is_pinned
                                                ? 'Lepas sematan'
                                                : 'Sematkan pengumuman'
                                        }
                                    >
                                        <Icon
                                            name="pin"
                                            className={`h-4 w-4 ${
                                                announcement.is_pinned ? 'text-amber-600 dark:text-amber-400' : ''
                                            }`}
                                        />
                                        {announcement.is_pinned ? 'Lepas' : 'Sematkan'}
                                    </Button>
                                    <Link
                                        href={route('admin.announcements.edit', announcement.id)}
                                        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300"
                                    >
                                        <Icon name="edit" className="h-4 w-4" />
                                        Ubah
                                    </Link>
                                    <DeleteButton
                                        href={route('admin.announcements.destroy', announcement.id)}
                                        message={`Hapus pengumuman "${announcement.title}"? Tindakan ini tidak dapat dibatalkan.`}
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <Pagination links={announcements.links} />
        </div>
    );
}
