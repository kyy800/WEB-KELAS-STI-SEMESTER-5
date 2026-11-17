import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import { InputError, InputLabel, SelectInput, TextInput, TextareaInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { formatDate, formatTime, toTimeInput } from '@/lib/format';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ exceptions, schedules, types }) {
    const [showForm, setShowForm] = useState(schedules.length > 0);

    const form = useForm({
        schedule_id: schedules[0]?.id ?? '',
        date: '',
        type: types.includes('perubahan') ? 'perubahan' : types[0] ?? 'perubahan',
        note: '',
        new_start_time: '',
        new_end_time: '',
        new_room: '',
    });

    const selectedSchedule = schedules.find(
        (schedule) => String(schedule.id) === String(form.data.schedule_id)
    );

    const isCancellation = form.data.type === 'pembatalan';

    const submit = (event) => {
        event.preventDefault();

        form.post(route('admin.schedule-exceptions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset('date', 'note', 'new_start_time', 'new_end_time', 'new_room');
            },
        });
    };

    return (
        <div>
            <Head title="Perubahan Jadwal" />

            <PageHeader
                title="Perubahan Jadwal"
                description="Catat perubahan jam, ruang, atau pembatalan kelas pada tanggal tertentu tanpa mengubah jadwal mingguan."
            >
                <Link
                    href={route('admin.schedules.index')}
                    className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                    <Icon name="calendar" className="h-4 w-4" />
                    Lihat jadwal
                </Link>
                {schedules.length > 0 && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowForm((value) => !value)}
                    >
                        <Icon name={showForm ? 'close' : 'plus'} className="h-4 w-4" />
                        {showForm ? 'Tutup formulir' : 'Tambah perubahan'}
                    </Button>
                )}
            </PageHeader>

            {schedules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/15 px-5 py-6 text-sm leading-6 text-amber-800 dark:text-amber-200">
                    Belum ada jadwal yang bisa diubah. Tambahkan{' '}
                    <Link
                        href={route('admin.schedules.create')}
                        className="font-semibold underline underline-offset-2"
                    >
                        jadwal kuliah
                    </Link>{' '}
                    terlebih dahulu.
                </div>
            ) : (
                showForm && (
                    <form
                        onSubmit={submit}
                        className="mb-6 space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                <Icon name="clock" className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Catat perubahan / pembatalan
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Tanggal harus jatuh pada hari yang sama dengan jadwal.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="schedule_id" required>
                                    Jadwal
                                </InputLabel>
                                <SelectInput
                                    id="schedule_id"
                                    value={form.data.schedule_id}
                                    onChange={(event) =>
                                        form.setData('schedule_id', event.target.value)
                                    }
                                >
                                    {schedules.map((schedule) => (
                                        <option key={schedule.id} value={schedule.id}>
                                            {schedule.day} · {schedule.course.code} —{' '}
                                            {schedule.course.name} (
                                            {toTimeInput(schedule.start_time)}–
                                            {toTimeInput(schedule.end_time)})
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError message={form.errors.schedule_id} />
                            </div>

                            <div>
                                <InputLabel htmlFor="date" required>
                                    Tanggal
                                </InputLabel>
                                <TextInput
                                    id="date"
                                    type="date"
                                    value={form.data.date}
                                    onChange={(event) => form.setData('date', event.target.value)}
                                />
                                <InputError message={form.errors.date} />
                            </div>
                        </div>

                        {selectedSchedule && (
                            <p className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                                Jadwal terpilih: <strong>{selectedSchedule.day}</strong>,{' '}
                                {toTimeInput(selectedSchedule.start_time)}–
                                {toTimeInput(selectedSchedule.end_time)} di{' '}
                                {selectedSchedule.room || 'ruang belum diisi'}.
                            </p>
                        )}

                        <div>
                            <InputLabel htmlFor="type" required>
                                Jenis
                            </InputLabel>
                            <SelectInput
                                id="type"
                                value={form.data.type}
                                onChange={(event) => form.setData('type', event.target.value)}
                            >
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type === 'perubahan'
                                            ? 'Perubahan jadwal'
                                            : 'Pembatalan kelas'}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={form.errors.type} />
                        </div>

                        {!isCancellation && (
                            <div className="grid gap-5 sm:grid-cols-3">
                                <div>
                                    <InputLabel htmlFor="new_start_time">Jam mulai baru</InputLabel>
                                    <TextInput
                                        id="new_start_time"
                                        type="time"
                                        value={form.data.new_start_time}
                                        onChange={(event) =>
                                            form.setData('new_start_time', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.new_start_time} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="new_end_time">Jam selesai baru</InputLabel>
                                    <TextInput
                                        id="new_end_time"
                                        type="time"
                                        value={form.data.new_end_time}
                                        onChange={(event) =>
                                            form.setData('new_end_time', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.new_end_time} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="new_room">Ruang baru</InputLabel>
                                    <TextInput
                                        id="new_room"
                                        value={form.data.new_room}
                                        onChange={(event) =>
                                            form.setData('new_room', event.target.value)
                                        }
                                        placeholder="Contoh: Lab Komputer 2"
                                    />
                                    <InputError message={form.errors.new_room} />
                                </div>
                            </div>
                        )}

                        <div>
                            <InputLabel
                                htmlFor="note"
                                required={!isCancellation}
                            >
                                Catatan
                            </InputLabel>
                            <TextareaInput
                                id="note"
                                rows={3}
                                value={form.data.note}
                                onChange={(event) => form.setData('note', event.target.value)}
                                placeholder={
                                    isCancellation
                                        ? 'Alasan pembatalan (opsional)'
                                        : 'Contoh: Kelas diundur karena dosen berhalangan.'
                                }
                            />
                            <InputError message={form.errors.note} />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.processing}>
                                <Icon name="check" className="h-4 w-4" />
                                {form.processing ? 'Menyimpan…' : 'Simpan perubahan'}
                            </Button>
                        </div>
                    </form>
                )
            )}

            <section>
                <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">Riwayat perubahan</h2>

                {exceptions.data.length === 0 ? (
                    <EmptyState
                        icon="clock"
                        title="Belum ada perubahan jadwal"
                        description="Perubahan dan pembatalan kelas akan tercatat di sini."
                    />
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                            {exceptions.data.map((exception) => {
                                const cancelled = exception.type === 'pembatalan';

                                return (
                                    <li
                                        key={exception.id}
                                        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span
                                                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                    cancelled
                                                        ? 'bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                                        : 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                                }`}
                                            >
                                                <Icon
                                                    name={cancelled ? 'alert' : 'clock'}
                                                    className="h-4 w-4"
                                                />
                                            </span>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge tone={cancelled ? 'rose' : 'amber'}>
                                                        {cancelled
                                                            ? 'Pembatalan'
                                                            : 'Perubahan'}
                                                    </Badge>
                                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        {formatDate(exception.date)}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                    {exception.schedule?.course?.name ?? 'Jadwal dihapus'}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Jadwal asal: {exception.schedule?.day},{' '}
                                                    {formatTime(exception.schedule?.start_time)}–
                                                    {formatTime(exception.schedule?.end_time)}
                                                </p>
                                                {exception.note && (
                                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                                        {exception.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                            {!cancelled && (
                                                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                                                    {exception.new_start_time ? (
                                                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {formatTime(exception.new_start_time)}
                                                            {exception.new_end_time
                                                                ? `–${formatTime(exception.new_end_time)}`
                                                                : ''}
                                                        </p>
                                                    ) : null}
                                                    {exception.new_room && (
                                                        <p>{exception.new_room}</p>
                                                    )}
                                                </div>
                                            )}
                                            <DeleteButton
                                                href={route(
                                                    'admin.schedule-exceptions.destroy',
                                                    exception.id
                                                )}
                                                message="Hapus catatan perubahan jadwal ini?"
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                <Pagination links={exceptions.links} />
            </section>
        </div>
    );
}
