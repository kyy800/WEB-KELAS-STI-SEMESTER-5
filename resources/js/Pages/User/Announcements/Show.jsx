import AttachmentList from '@/Components/AttachmentList';
import Badge from '@/Components/Badge';
import Icon from '@/Components/Icon';
import { categoryLabel, categoryTone, formatDateTime } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

export default function Show({ announcement }) {
    return (
        <div className="mx-auto max-w-3xl">
            <Head title={announcement.title} />

            <Link
                href={route('announcements.index')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                Kembali ke daftar pengumuman
            </Link>

            <article className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
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
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                    {announcement.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                        {announcement.author?.name ?? 'Admin kelas'}
                    </span>
                    <span>·</span>
                    <span>{formatDateTime(announcement.published_at)}</span>
                </div>

                <div className="mt-6 whitespace-pre-line border-t border-slate-100 dark:border-slate-800 pt-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
                    {announcement.body}
                </div>

                {announcement.attachments?.length > 0 && (
                    <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <AttachmentList attachments={announcement.attachments} />
                    </div>
                )}
            </article>
        </div>
    );
}
