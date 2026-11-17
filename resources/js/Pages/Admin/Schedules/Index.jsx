import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import { formatDate, formatTime } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

export default function Index({ days, totalSchedules }) {
    return (
        <div>
            <Head title="Kelola Jadwal" />

            <PageHeader
                title="Kelola Jadwal"
                description="Jadwal kuliah mingguan kelas. Perubahan atau pembatalan tercatat terpisah agar riwayat tetap jelas."
            >
                <Link
                    href={route('admin.schedule-exceptions.index')}
                    className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                    <Icon name="clock" className="h-4 w-4" />
                    Perubahan jadwal
                </Link>
                <Link
                    href={route('admin.schedules.create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Tambah jadwal
                </Link>
            </PageHeader>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-900 px-3 py-1 font-semibold ring-1 ring-inset ring-slate-200 dark:ring-slate-700">
                    <Icon name="calendar" className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                    {totalSchedules} jadwal aktif
                </span>
                <span>Tabrakan jam pada hari yang sama otomatis ditolak.</span>
            </div>

            {totalSchedules === 0 ? (
                <EmptyState
                    icon="calendar"
                    title="Belum ada jadwal"
                    description="Tambahkan jadwal kuliah pertama untuk kelas."
                    action={
                        <Link
                            href={route('admin.schedules.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            Tambah jadwal
                        </Link>
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {days.map((day) => (
                        <section
                            key={day.name}
                            className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 px-5 py-3">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{day.name}</h2>
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                    {day.schedules.length} kelas
                                </span>
                            </div>

                            {day.schedules.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                                    Tidak ada jadwal.
                                </p>
                            ) : (
                                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {day.schedules.map((schedule) => {
                                        const upcoming = schedule.exceptions ?? [];

                                        return (
                                            <li key={schedule.id} className="px-5 py-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <Badge tone="indigo">
                                                                {schedule.course.code}
                                                            </Badge>
                                                            {upcoming.length > 0 && (
                                                                <Badge tone="amber">
                                                                    {upcoming.length} perubahan
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="mt-1.5 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                            {schedule.course.name}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            {formatTime(schedule.start_time)}–
                                                            {formatTime(schedule.end_time)} ·{' '}
                                                            {schedule.room || 'Ruang belum diisi'}
                                                        </p>
                                                        {schedule.note && (
                                                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                                {schedule.note}
                                                            </p>
                                                        )}
                                                        {upcoming[0] && (
                                                            <p className="mt-2 rounded-lg bg-amber-50 dark:bg-amber-500/15 px-2.5 py-1.5 text-[11px] leading-5 text-amber-800 dark:text-amber-200">
                                                                {formatDate(upcoming[0].date)}:{' '}
                                                                {upcoming[0].type === 'pembatalan'
                                                                    ? 'dibatalkan'
                                                                    : upcoming[0].note ||
                                                                      'jadwal berubah'}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                                        <Link
                                                            href={route(
                                                                'admin.schedules.edit',
                                                                schedule.id
                                                            )}
                                                            className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                            title="Ubah jadwal"
                                                        >
                                                            <Icon name="edit" className="h-4 w-4" />
                                                        </Link>
                                                        <DeleteButton
                                                            href={route(
                                                                'admin.schedules.destroy',
                                                                schedule.id
                                                            )}
                                                            message={`Hapus jadwal ${schedule.course.name} hari ${schedule.day}? Perubahan jadwal terkait juga akan terhapus.`}
                                                            iconOnly
                                                        />
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
