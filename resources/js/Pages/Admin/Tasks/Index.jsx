import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import { SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { deadlineInfo, formatDateTime } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statuses = [
    { value: '', label: 'Semua' },
    { value: 'aktif', label: 'Aktif' },
    { value: 'lewat', label: 'Lewat deadline' },
];

export default function Index({ tasks, courses, filters }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [courseId, setCourseId] = useState(filters.course_id ?? '');

    const apply = (next = {}) => {
        router.get(
            route('admin.tasks.index'),
            {
                q: next.q ?? q,
                status: next.status ?? status,
                course_id: next.course_id ?? courseId,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div>
            <Head title="Kelola Tugas" />

            <PageHeader
                title="Kelola Tugas"
                description="Buat tugas, atur deadline, dan pantau berapa anggota yang sudah menandainya selesai."
            >
                <Link
                    href={route('admin.tasks.create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Tambah tugas
                </Link>
            </PageHeader>

            <div className="mb-5 space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
                <div className="flex flex-wrap gap-1">
                    {statuses.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                                setStatus(item.value);
                                apply({ status: item.value });
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                status === item.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        apply();
                    }}
                    className="grid gap-2 sm:grid-cols-[1fr_14rem_auto]"
                >
                    <div className="relative">
                        <Icon
                            name="search"
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                        />
                        <TextInput
                            value={q}
                            onChange={(event) => setQ(event.target.value)}
                            placeholder="Cari judul atau deskripsi tugas…"
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
            </div>

            {tasks.data.length === 0 ? (
                <EmptyState
                    icon="clipboard"
                    title="Belum ada tugas"
                    description="Tambahkan tugas agar anggota kelas tahu deadline yang harus dipenuhi."
                    action={
                        <Link
                            href={route('admin.tasks.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Tambah tugas
                        </Link>
                    }
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-left text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    <th className="px-4 py-3 font-semibold">Tugas</th>
                                    <th className="px-4 py-3 font-semibold">Deadline</th>
                                    <th className="px-4 py-3 font-semibold">Selesai</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {tasks.data.map((task) => {
                                    const deadline = deadlineInfo(task.due_at, false);

                                    return (
                                        <tr key={task.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <Badge tone="indigo">
                                                        {task.course?.code}
                                                    </Badge>
                                                    {task.attachments_count > 0 && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                                                            <Icon name="file" className="h-3 w-3" />
                                                            {task.attachments_count}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                                                    {task.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {task.course?.name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                                    {formatDateTime(task.due_at)}
                                                </p>
                                                <Badge tone={deadline.tone}>
                                                    {deadline.label}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30">
                                                    <Icon name="check" className="h-3 w-3" />
                                                    {task.completed_count} anggota
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route(
                                                            'admin.tasks.edit',
                                                            task.id
                                                        )}
                                                        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300"
                                                    >
                                                        <Icon name="edit" className="h-4 w-4" />
                                                        Ubah
                                                    </Link>
                                                    <DeleteButton
                                                        href={route('admin.tasks.destroy', task.id)}
                                                        message={`Hapus tugas "${task.title}"? Progres anggota terkait juga akan terhapus.`}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Pagination links={tasks.links} />
        </div>
    );
}
