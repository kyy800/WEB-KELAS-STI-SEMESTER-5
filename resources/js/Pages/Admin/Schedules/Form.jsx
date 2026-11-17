import Button from '@/Components/Button';
import { InputError, InputLabel, SelectInput, TextInput, TextareaInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import { toTimeInput } from '@/lib/format';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ schedule, courses, days }) {
    const editing = Boolean(schedule);

    const form = useForm({
        course_id: schedule?.course_id ?? courses[0]?.id ?? '',
        day: schedule?.day ?? days[0] ?? 'Senin',
        start_time: toTimeInput(schedule?.start_time) || '08:00',
        end_time: toTimeInput(schedule?.end_time) || '10:30',
        room: schedule?.room ?? '',
        note: schedule?.note ?? '',
    });

    const submit = (event) => {
        event.preventDefault();

        const options = { preserveScroll: true };

        if (editing) {
            form.put(route('admin.schedules.update', schedule.id), options);
        } else {
            form.post(route('admin.schedules.store'), options);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <Head title={editing ? 'Ubah Jadwal' : 'Tambah Jadwal'} />

            <Link
                href={route('admin.schedules.index')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                Kembali ke jadwal
            </Link>

            <PageHeader
                title={editing ? 'Ubah Jadwal' : 'Tambah Jadwal'}
                description="Pastikan jam tidak bertabrakan dengan jadwal lain pada hari yang sama."
            />

            {courses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/15 px-5 py-6 text-sm leading-6 text-amber-800 dark:text-amber-200">
                    Belum ada mata kuliah. Tambahkan{' '}
                    <Link
                        href={route('admin.courses.index')}
                        className="font-semibold underline underline-offset-2"
                    >
                        mata kuliah
                    </Link>{' '}
                    terlebih dahulu sebelum membuat jadwal.
                </div>
            ) : (
                <form
                    onSubmit={submit}
                    className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-7"
                >
                    <div>
                        <InputLabel htmlFor="course_id" required>
                            Mata kuliah
                        </InputLabel>
                        <SelectInput
                            id="course_id"
                            value={form.data.course_id}
                            onChange={(event) => form.setData('course_id', event.target.value)}
                        >
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.code} — {course.name}
                                </option>
                            ))}
                        </SelectInput>
                        <InputError message={form.errors.course_id} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <InputLabel htmlFor="day" required>
                                Hari
                            </InputLabel>
                            <SelectInput
                                id="day"
                                value={form.data.day}
                                onChange={(event) => form.setData('day', event.target.value)}
                            >
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={form.errors.day} />
                        </div>

                        <div>
                            <InputLabel htmlFor="start_time" required>
                                Jam mulai
                            </InputLabel>
                            <TextInput
                                id="start_time"
                                type="time"
                                value={form.data.start_time}
                                onChange={(event) => form.setData('start_time', event.target.value)}
                            />
                            <InputError message={form.errors.start_time} />
                        </div>

                        <div>
                            <InputLabel htmlFor="end_time" required>
                                Jam selesai
                            </InputLabel>
                            <TextInput
                                id="end_time"
                                type="time"
                                value={form.data.end_time}
                                onChange={(event) => form.setData('end_time', event.target.value)}
                            />
                            <InputError message={form.errors.end_time} />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="room">Ruang</InputLabel>
                        <TextInput
                            id="room"
                            value={form.data.room}
                            onChange={(event) => form.setData('room', event.target.value)}
                            placeholder="Contoh: Lab Komputer 1"
                        />
                        <InputError message={form.errors.room} />
                    </div>

                    <div>
                        <InputLabel htmlFor="note">Catatan</InputLabel>
                        <TextareaInput
                            id="note"
                            rows={3}
                            value={form.data.note}
                            onChange={(event) => form.setData('note', event.target.value)}
                            placeholder="Contoh: Bawa laptop."
                        />
                        <InputError message={form.errors.note} />
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 sm:flex-row sm:justify-end">
                        <Link
                            href={route('admin.schedules.index')}
                            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Batal
                        </Link>
                        <Button type="submit" disabled={form.processing}>
                            <Icon name="check" className="h-4 w-4" />
                            {form.processing
                                ? 'Menyimpan…'
                                : editing
                                  ? 'Simpan perubahan'
                                  : 'Tambah jadwal'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
