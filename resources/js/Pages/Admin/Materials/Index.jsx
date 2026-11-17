import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import { SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { fileSize, formatDate } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ materials, courses, filters }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [courseId, setCourseId] = useState(filters.course_id ?? '');

    const apply = (next = {}) => {
        router.get(
            route('admin.materials.index'),
            {
                q: next.q ?? q,
                course_id: next.course_id ?? courseId,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div>
            <Head title="Kelola Materi" />

            <PageHeader
                title="Kelola Materi"
                description="Unggah file atau tautan materi kuliah per pertemuan. Maksimal 20 MB per file."
            >
                <Link
                    href={route('admin.materials.create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Tambah materi
                </Link>
            </PageHeader>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    apply();
                }}
                className="mb-5 grid gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm sm:grid-cols-[1fr_16rem_auto]"
            >
                <div className="relative">
                    <Icon
                        name="search"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <TextInput
                        value={q}
                        onChange={(event) => setQ(event.target.value)}
                        placeholder="Cari judul atau nama file…"
                        className="pl-9"
                    />
                </div>
                <SelectInput
                    value={courseId}
                    onChange={(event) => {
                        setCourseId(event.target.value);
                        apply({ course_id: event.target.value });
                    }}
                >
                    <option value="">Semua mata kuliah</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.code} — {course.name}
                        </option>
                    ))}
                </SelectInput>
                <Button type="submit" variant="secondary">
                    Cari
                </Button>
            </form>

            {materials.data.length === 0 ? (
                <EmptyState
                    icon="book"
                    title="Belum ada materi"
                    description="Tambahkan materi pertama untuk membantu anggota kelas belajar."
                    action={
                        <Link
                            href={route('admin.materials.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Tambah materi
                        </Link>
                    }
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-left text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    <th className="px-4 py-3 font-semibold">Materi</th>
                                    <th className="px-4 py-3 font-semibold">Pertemuan</th>
                                    <th className="px-4 py-3 font-semibold">Sumber</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {materials.data.map((material) => (
                                    <tr key={material.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <Badge tone="indigo">
                                                    {material.course?.code}
                                                </Badge>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    {formatDate(material.created_at)}
                                                </span>
                                            </div>
                                            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                                                {material.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {material.course?.name} · diunggah{' '}
                                                {material.uploader?.name ?? 'Admin'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                                            {material.meeting_no
                                                ? `Pertemuan ${material.meeting_no}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {material.url ? (
                                                <a
                                                    href={material.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100"
                                                >
                                                    <Icon name="link" className="h-3.5 w-3.5" />
                                                    Tautan eksternal
                                                </a>
                                            ) : (
                                                <Link
                                                    href={route(
                                                        'admin.materials.download',
                                                        material.id
                                                    )}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100"
                                                >
                                                    <Icon name="download" className="h-3.5 w-3.5" />
                                                    {fileSize(material.file_size)}
                                                </Link>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route(
                                                        'admin.materials.edit',
                                                        material.id
                                                    )}
                                                    className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300"
                                                >
                                                    <Icon name="edit" className="h-4 w-4" />
                                                    Ubah
                                                </Link>
                                                <DeleteButton
                                                    href={route(
                                                        'admin.materials.destroy',
                                                        material.id
                                                    )}
                                                    message={`Hapus materi "${material.title}" beserta filenya?`}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Pagination links={materials.links} />
        </div>
    );
}
