import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import Icon from '@/Components/Icon';
import StatCard from '@/Components/StatCard';
import {
    categoryLabel,
    categoryTone,
    deadlineInfo,
    formatDate,
    formatDateTime,
    formatTime,
} from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

const shortcuts = [
    { label: 'Kelola pengumuman', routeName: 'admin.announcements.index', icon: 'megaphone' },
    { label: 'Atur jadwal', routeName: 'admin.schedules.index', icon: 'calendar' },
    { label: 'Perubahan jadwal', routeName: 'admin.schedule-exceptions.index', icon: 'clock' },
    { label: 'Mata kuliah', routeName: 'admin.courses.index', icon: 'book' },
    { label: 'Kelola tugas', routeName: 'admin.tasks.index', icon: 'clipboard' },
    { label: 'Kelola materi', routeName: 'admin.materials.index', icon: 'file' },
    { label: 'Kelola pengguna', routeName: 'admin.users.index', icon: 'users' },
    { label: 'Impor akun CSV', routeName: 'admin.users.import', icon: 'upload' },
];

export default function Dashboard({
    stats,
    latestAnnouncements,
    upcomingTasks,
    todaySchedules,
    todayName,
}) {
    return (
        <div className="space-y-6">
            <Head title="Dashboard Admin" />

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-700 p-6 text-white shadow-sm sm:p-8">
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-100 ring-1 ring-inset ring-white/20">
                            <Icon name="shield" className="h-3.5 w-3.5" />
                            Panel Admin
                        </p>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                            Selamat datang, pengelola kelas.
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
                            Kelola informasi kelas, jadwal, tugas, materi, dan akun anggota dari
                            satu tempat. Hari ini {todayName}.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('admin.announcements.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-800 shadow-sm transition hover:bg-indigo-50 dark:bg-white dark:text-indigo-900 dark:hover:bg-indigo-100"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Pengumuman
                        </Link>
                        <Link
                            href={route('admin.tasks.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur transition hover:bg-white/20"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Tugas
                        </Link>
                        <Link
                            href={route('admin.materials.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur transition hover:bg-white/20"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Materi
                        </Link>
                    </div>
                </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Anggota aktif" value={stats.members} icon="users" tone="indigo" />
                <StatCard label="Mata kuliah" value={stats.courses} icon="book" tone="sky" />
                <StatCard label="Tugas aktif" value={stats.activeTasks} icon="clipboard" tone="amber" />
                <StatCard label="Materi" value={stats.materials} icon="file" tone="emerald" />
                <StatCard label="Pengumuman" value={stats.announcements} icon="megaphone" tone="rose" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                                    <Icon name="megaphone" className="h-4 w-4" />
                                </span>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Pengumuman terbaru
                                </h2>
                            </div>
                            <Link
                                href={route('admin.announcements.index')}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                            >
                                Kelola
                            </Link>
                        </div>

                        {latestAnnouncements.length === 0 ? (
                            <div className="p-5">
                                <EmptyState
                                    icon="megaphone"
                                    title="Belum ada pengumuman"
                                    description="Buat pengumuman pertama untuk kelas."
                                />
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {latestAnnouncements.map((announcement) => (
                                    <li key={announcement.id}>
                                        <Link
                                            href={route('admin.announcements.edit', announcement.id)}
                                            className="block px-5 py-4 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
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
                                            </div>
                                            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {announcement.title}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                {announcement.body}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                    <Icon name="clipboard" className="h-4 w-4" />
                                </span>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Tugas mendatang</h2>
                            </div>
                            <Link
                                href={route('admin.tasks.index')}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                            >
                                Kelola
                            </Link>
                        </div>

                        {upcomingTasks.length === 0 ? (
                            <div className="p-5">
                                <EmptyState
                                    icon="checkCircle"
                                    title="Tidak ada tugas mendatang"
                                    description="Tugas baru akan tampil di sini setelah dibuat."
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                            <th className="px-5 py-2.5 font-semibold">Tugas</th>
                                            <th className="px-5 py-2.5 font-semibold">Mata kuliah</th>
                                            <th className="px-5 py-2.5 font-semibold">Deadline</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {upcomingTasks.map((task) => {
                                            const deadline = deadlineInfo(task.due_at, false);

                                            return (
                                                <tr key={task.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                                                    <td className="px-5 py-3">
                                                        <Link
                                                            href={route('admin.tasks.edit', task.id)}
                                                            className="font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300"
                                                        >
                                                            {task.title}
                                                        </Link>
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                                                        {task.course?.code}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {formatDateTime(task.due_at)}
                                                            </span>
                                                            <Badge tone={deadline.tone}>
                                                                {deadline.label}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400">
                                <Icon name="calendar" className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Jadwal hari ini</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{todayName}</p>
                            </div>
                        </div>

                        {todaySchedules.length === 0 ? (
                            <div className="p-5">
                                <EmptyState
                                    icon="calendar"
                                    title="Tidak ada kelas"
                                    description="Tidak ada jadwal kuliah hari ini."
                                />
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {todaySchedules.map((schedule) => {
                                    const exception = schedule.today_exception;
                                    const cancelled = exception?.type === 'pembatalan';

                                    return (
                                        <li key={schedule.id} className="px-5 py-3.5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className={`truncate text-sm font-semibold ${cancelled ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                                                        {schedule.course.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                        {formatTime(schedule.start_time)}–
                                                        {formatTime(schedule.end_time)} ·{' '}
                                                        {schedule.room || 'Ruang belum diisi'}
                                                    </p>
                                                </div>
                                                {cancelled ? (
                                                    <Badge tone="rose">Batal</Badge>
                                                ) : exception ? (
                                                    <Badge tone="amber">Berubah</Badge>
                                                ) : (
                                                    <Badge tone="indigo">{schedule.course.code}</Badge>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        <div className="border-t border-slate-100 dark:border-slate-800 p-3">
                            <Link
                                href={route('admin.schedules.index')}
                                className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                            >
                                Kelola jadwal
                                <Icon name="arrowRight" className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Akses cepat</h2>
                        <div className="mt-3 grid gap-1.5">
                            {shortcuts.map((item) => (
                                <Link
                                    key={item.routeName}
                                    href={route(item.routeName)}
                                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                    <Icon name={item.icon} className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
