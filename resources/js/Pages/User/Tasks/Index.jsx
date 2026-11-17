import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import EmptyState from '@/Components/EmptyState';
import { SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import TaskToggle from '@/Components/TaskToggle';
import { deadlineInfo, formatDateTime } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statuses = [
    { value: '', label: 'Semua' },
    { value: 'aktif', label: 'Aktif' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'lewat', label: 'Lewat deadline' },
];

export default function Index({ tasks, courses, filters }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [courseId, setCourseId] = useState(filters.course_id ?? '');

    const apply = (next = {}) => {
        router.get(
            route('tasks.index'),
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
            <Head title="Tugas & Deadline" />

            <PageHeader
                title="Tugas & Deadline"
                description="Pantau tugas aktif, tandai progres pribadi, dan jangan lewatkan deadline."
            />

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
                    title="Tidak ada tugas"
                    description="Tidak ada tugas yang cocok dengan filter saat ini."
                    action={
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => router.get(route('tasks.index'))}
                        >
                            Reset filter
                        </Button>
                    }
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {tasks.data.map((task) => {
                            const deadline = deadlineInfo(task.due_at, task.is_completed);

                            return (
                                <li
                                    key={task.id}
                                    className={`flex flex-col gap-3 px-4 py-4 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/50 sm:flex-row sm:items-center sm:px-5 ${
                                        task.is_completed ? 'bg-emerald-50/30 dark:bg-emerald-500/10' : ''
                                    }`}
                                >
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                        <div className="pt-0.5">
                                            <TaskToggle task={task} showLabel={false} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge tone="indigo">{task.course.code}</Badge>
                                                <Badge tone={deadline.tone}>{deadline.label}</Badge>
                                                {task.attachments_count > 0 && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                                                        <Icon name="file" className="h-3 w-3" />
                                                        {task.attachments_count}
                                                    </span>
                                                )}
                                            </div>
                                            <Link
                                                href={route('tasks.show', task.id)}
                                                className={`mt-1.5 block text-sm font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 ${
                                                    task.is_completed
                                                        ? 'text-slate-400 dark:text-slate-500 line-through'
                                                        : 'text-slate-900 dark:text-slate-100'
                                                }`}
                                            >
                                                {task.title}
                                            </Link>
                                            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                <span>{task.course.name}</span>
                                                <span>·</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Icon name="clock" className="h-3.5 w-3.5" />
                                                    {formatDateTime(task.due_at)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('tasks.show', task.id)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                                    >
                                        Detail
                                        <Icon name="arrowRight" className="h-3.5 w-3.5" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <Pagination links={tasks.links} />
        </div>
    );
}
