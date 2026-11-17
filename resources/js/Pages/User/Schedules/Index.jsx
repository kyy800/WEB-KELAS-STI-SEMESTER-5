import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import { formatDate, formatTime } from '@/lib/format';
import { Head } from '@inertiajs/react';

export default function Index({ days, todaySchedules, upcomingExceptions, todayName }) {
    return (
        <div>
            <Head title="Jadwal Kuliah" />

            <PageHeader
                title="Jadwal Kuliah"
                description="Jadwal mingguan kelas beserta perubahan dan pembatalan terbaru."
            />

            <section className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                        <Icon name="calendar" className="h-4 w-4" />
                    </span>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Hari ini — {todayName}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {todaySchedules.length > 0
                                ? `${todaySchedules.length} kelas terjadwal`
                                : 'Tidak ada kelas hari ini'}
                        </p>
                    </div>
                </div>

                {todaySchedules.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                        Tidak ada jadwal kuliah hari ini. Manfaatkan waktu untuk mengerjakan tugas.
                    </div>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                        {todaySchedules.map((schedule) => {
                            const exception = schedule.today_exception;
                            const cancelled = exception?.type === 'pembatalan';

                            return (
                                <div
                                    key={schedule.id}
                                    className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm ${
                                        cancelled ? 'border-rose-200 dark:border-rose-500/30' : 'border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge tone="indigo">{schedule.course.code}</Badge>
                                                {cancelled && <Badge tone="rose">Dibatalkan</Badge>}
                                                {exception?.type === 'perubahan' && (
                                                    <Badge tone="amber">Jadwal berubah</Badge>
                                                )}
                                            </div>
                                            <h3 className={`mt-2 text-base font-bold ${cancelled ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                                                {schedule.course.name}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                {exception?.new_start_time
                                                    ? formatTime(exception.new_start_time)
                                                    : formatTime(schedule.start_time)}
                                            </p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                s.d.{' '}
                                                {formatTime(
                                                    exception?.new_end_time ?? schedule.end_time
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <dl className="mt-3 grid gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                                        <div className="flex items-center gap-1.5">
                                            <Icon name="dashboard" className="h-3.5 w-3.5" />
                                            {exception?.new_room || schedule.room || 'Ruang belum ditentukan'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Icon name="user" className="h-3.5 w-3.5" />
                                            {schedule.course.lecturer || 'Dosen belum diisi'}
                                        </div>
                                    </dl>

                                    {(exception?.note || schedule.note) && (
                                        <p className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-500/15 px-3 py-2 text-xs leading-5 text-amber-800 dark:text-amber-200">
                                            {exception?.note || schedule.note}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section>
                <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">Jadwal mingguan</h2>
                <div className="grid gap-3 md:grid-cols-2">
                    {days.map((day) => (
                        <div
                            key={day.name}
                            className={`overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm ${
                                day.name === todayName ? 'border-indigo-200 dark:border-indigo-500/30' : 'border-slate-200 dark:border-slate-800'
                            }`}
                        >
                            <div
                                className={`flex items-center justify-between px-5 py-3 ${
                                    day.name === todayName ? 'bg-indigo-50/70 dark:bg-indigo-500/10' : 'bg-slate-50/70 dark:bg-slate-800/40'
                                }`}
                            >
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{day.name}</h3>
                                {day.name === todayName ? (
                                    <Badge tone="indigo">Hari ini</Badge>
                                ) : (
                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                        {day.schedules.length} kelas
                                    </span>
                                )}
                            </div>

                            {day.schedules.length === 0 ? (
                                <p className="px-5 py-6 text-sm text-slate-400 dark:text-slate-500">Tidak ada jadwal.</p>
                            ) : (
                                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {day.schedules.map((schedule) => (
                                        <li key={schedule.id} className="px-5 py-3.5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                        {schedule.course.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                        {schedule.course.code}
                                                        {schedule.course.lecturer
                                                            ? ` · ${schedule.course.lecturer}`
                                                            : ''}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                                        {schedule.room || 'Ruang belum ditentukan'}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    {formatTime(schedule.start_time)}–{formatTime(schedule.end_time)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-6">
                <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">Perubahan jadwal mendatang</h2>
                {upcomingExceptions.length === 0 ? (
                    <EmptyState
                        icon="calendar"
                        title="Tidak ada perubahan jadwal"
                        description="Perubahan atau pembatalan jadwal akan tampil di sini."
                    />
                ) : (
                    <div className="space-y-2">
                        {upcomingExceptions.map((exception) => (
                            <div
                                key={exception.id}
                                className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                            exception.type === 'pembatalan'
                                                ? 'bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                                : 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                        }`}
                                    >
                                        <Icon
                                            name={exception.type === 'pembatalan' ? 'alert' : 'clock'}
                                            className="h-4 w-4"
                                        />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {exception.schedule.course.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {formatDate(exception.date)} ·{' '}
                                            {exception.schedule.day},{' '}
                                            {formatTime(exception.schedule.start_time)}–
                                            {formatTime(exception.schedule.end_time)}
                                        </p>
                                        {exception.note && (
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{exception.note}</p>
                                        )}
                                    </div>
                                </div>
                                <Badge tone={exception.type === 'pembatalan' ? 'rose' : 'amber'}>
                                    {exception.type === 'pembatalan' ? 'Dibatalkan' : 'Perubahan'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
