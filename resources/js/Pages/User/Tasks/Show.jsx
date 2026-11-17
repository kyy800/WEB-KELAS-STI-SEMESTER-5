import AttachmentList from '@/Components/AttachmentList';
import Badge from '@/Components/Badge';
import Icon from '@/Components/Icon';
import TaskToggle from '@/Components/TaskToggle';
import { deadlineInfo, formatDateTime } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

export default function Show({ task }) {
    const deadline = deadlineInfo(task.due_at, task.is_completed);

    return (
        <div className="mx-auto max-w-3xl">
            <Head title={task.title} />

            <Link
                href={route('tasks.index')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                Kembali ke daftar tugas
            </Link>

            <article className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="indigo">{task.course.code}</Badge>
                    <Badge tone={deadline.tone}>{deadline.label}</Badge>
                    {task.is_completed && (
                        <Badge tone="emerald">
                            <Icon name="check" className="h-3 w-3" />
                            Sudah ditandai selesai
                        </Badge>
                    )}
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                    {task.title}
                </h1>

                <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-sm sm:grid-cols-2">
                    <div className="flex items-start gap-2.5">
                        <Icon name="book" className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Mata kuliah</p>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{task.course.name}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <Icon name="clock" className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Deadline</p>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{formatDateTime(task.due_at)}</p>
                        </div>
                    </div>
                </div>

                {task.description && (
                    <div className="mt-6">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Deskripsi tugas</h2>
                        <div className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {task.description}
                        </div>
                    </div>
                )}

                {task.link && (
                    <a
                        href={task.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                        <Icon name="external" className="h-4 w-4" />
                        Buka tautan pengumpulan
                    </a>
                )}

                {task.attachments?.length > 0 && (
                    <div className="mt-7 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <AttachmentList attachments={task.attachments} />
                    </div>
                )}

                <div className="mt-7 flex flex-col gap-3 rounded-xl border border-indigo-100 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Progres pribadi</p>
                        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Penanda selesai hanya terlihat untuk akun Anda dan tidak memengaruhi
                            anggota lain.
                        </p>
                    </div>
                    <TaskToggle task={task} />
                </div>
            </article>
        </div>
    );
}
