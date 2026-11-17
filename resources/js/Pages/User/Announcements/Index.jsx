import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import EmptyState from '@/Components/EmptyState';
import { SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { categoryLabel, categoryTone, excerpt, formatDate } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const categories = [
    { value: '', label: 'Semua' },
    { value: 'akademik', label: 'Akademik' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'umum', label: 'Umum' },
];

export default function Index({ announcements, filters }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [category, setCategory] = useState(filters.category ?? '');

    const applyFilters = (event) => {
        event?.preventDefault();
        router.get(
            route('announcements.index'),
            { q, category },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const selectCategory = (value) => {
        setCategory(value);
        router.get(
            route('announcements.index'),
            { q, category: value },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div>
            <Head title="Pengumuman" />

            <PageHeader
                title="Pengumuman"
                description="Informasi resmi kelas: akademik, kegiatan, dan hal umum lainnya."
            />

            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1">
                    {categories.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => selectCategory(item.value)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                category === item.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={applyFilters} className="flex gap-2">
                    <div className="relative flex-1 sm:w-64">
                        <Icon
                            name="search"
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                        />
                        <TextInput
                            value={q}
                            onChange={(event) => setQ(event.target.value)}
                            placeholder="Cari pengumuman…"
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="secondary" size="sm">
                        Cari
                    </Button>
                </form>
            </div>

            {announcements.data.length === 0 ? (
                <EmptyState
                    icon="megaphone"
                    title="Pengumuman tidak ditemukan"
                    description={
                        q || category
                            ? 'Coba ubah kata kunci atau filter kategori.'
                            : 'Belum ada pengumuman yang dipublikasikan.'
                    }
                    action={
                        (q || category) && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setQ('');
                                    setCategory('');
                                    router.get(route('announcements.index'));
                                }}
                            >
                                Reset filter
                            </Button>
                        )
                    }
                />
            ) : (
                <div className="space-y-3">
                    {announcements.data.map((announcement) => (
                        <Link
                            key={announcement.id}
                            href={route('announcements.show', announcement.id)}
                            className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-md"
                        >
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

                            <h2 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 sm:text-lg">
                                {announcement.title}
                            </h2>
                            <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                {excerpt(announcement.body, 220)}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                                <span className="font-medium text-slate-600 dark:text-slate-300">
                                    {announcement.author?.name ?? 'Admin'}
                                </span>
                                <span>·</span>
                                <span>Baca selengkapnya</span>
                                <Icon name="arrowRight" className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <Pagination links={announcements.links} />
        </div>
    );
}
