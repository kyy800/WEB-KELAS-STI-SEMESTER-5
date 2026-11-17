import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import { InputError, InputLabel, SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const emptyCourse = {
    code: '',
    name: '',
    lecturer: '',
    credits: 2,
};

export default function Index({ courses, filters }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [editing, setEditing] = useState(null);

    const form = useForm({ ...emptyCourse });

    const startEdit = (course) => {
        setEditing(course);
        form.setData({
            code: course.code,
            name: course.name,
            lecturer: course.lecturer ?? '',
            credits: course.credits ?? 2,
        });
        form.clearErrors();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setEditing(null);
            },
        };

        if (editing) {
            form.put(route('admin.courses.update', editing.id), options);
        } else {
            form.post(route('admin.courses.store'), options);
        }
    };

    const search = (event) => {
        event.preventDefault();
        router.get(
            route('admin.courses.index'),
            { q },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div>
            <Head title="Mata Kuliah" />

            <PageHeader
                title="Mata Kuliah"
                description="Daftar mata kuliah Semester 5 yang dipakai pada jadwal, tugas, dan materi."
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-1">
                    <form
                        onSubmit={submit}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
                    >
                        <div className="mb-4 flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                                <Icon name={editing ? 'edit' : 'plus'} className="h-4 w-4" />
                            </span>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {editing ? 'Ubah mata kuliah' : 'Tambah mata kuliah'}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="code" required>
                                    Kode
                                </InputLabel>
                                <TextInput
                                    id="code"
                                    value={form.data.code}
                                    onChange={(event) => form.setData('code', event.target.value)}
                                    placeholder="STI507"
                                    maxLength={20}
                                />
                                <InputError message={form.errors.code} />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" required>
                                    Nama mata kuliah
                                </InputLabel>
                                <TextInput
                                    id="name"
                                    value={form.data.name}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    placeholder="Contoh: Pemrograman Web Lanjut"
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="lecturer">Dosen</InputLabel>
                                <TextInput
                                    id="lecturer"
                                    value={form.data.lecturer}
                                    onChange={(event) => form.setData('lecturer', event.target.value)}
                                    placeholder="Nama dosen pengampu"
                                />
                                <InputError message={form.errors.lecturer} />
                            </div>

                            <div>
                                <InputLabel htmlFor="credits" required>
                                    SKS
                                </InputLabel>
                                <SelectInput
                                    id="credits"
                                    value={form.data.credits}
                                    onChange={(event) => form.setData('credits', event.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6].map((credit) => (
                                        <option key={credit} value={credit}>
                                            {credit} SKS
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError message={form.errors.credits} />
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-2">
                            <Button type="submit" disabled={form.processing}>
                                <Icon name="check" className="h-4 w-4" />
                                {form.processing
                                    ? 'Menyimpan…'
                                    : editing
                                      ? 'Simpan perubahan'
                                      : 'Tambah mata kuliah'}
                            </Button>
                            {editing && (
                                <Button type="button" variant="secondary" onClick={cancelEdit}>
                                    Batal ubah
                                </Button>
                            )}
                        </div>

                        <p className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Mata kuliah yang sudah dipakai jadwal, tugas, atau materi tidak dapat
                            dihapus.
                        </p>
                    </form>
                </section>

                <section className="lg:col-span-2">
                    <form onSubmit={search} className="mb-4 flex gap-2">
                        <div className="relative flex-1">
                            <Icon
                                name="search"
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                            />
                            <TextInput
                                value={q}
                                onChange={(event) => setQ(event.target.value)}
                                placeholder="Cari kode, nama, atau dosen…"
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Cari
                        </Button>
                    </form>

                    {courses.data.length === 0 ? (
                        <EmptyState
                            icon="book"
                            title="Belum ada mata kuliah"
                            description="Tambahkan mata kuliah melalui formulir di samping."
                        />
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-left text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                            <th className="px-4 py-3 font-semibold">Mata kuliah</th>
                                            <th className="px-4 py-3 font-semibold">SKS</th>
                                            <th className="px-4 py-3 font-semibold">Pemakaian</th>
                                            <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {courses.data.map((course) => (
                                            <tr key={course.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <Badge tone="indigo">{course.code}</Badge>
                                                        {editing?.id === course.id && (
                                                            <Badge tone="amber">Sedang diubah</Badge>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                                                        {course.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {course.lecturer || 'Dosen belum diisi'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                                                    {course.credits}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5">
                                                            {course.schedules_count} jadwal
                                                        </span>
                                                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5">
                                                            {course.tasks_count} tugas
                                                        </span>
                                                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5">
                                                            {course.materials_count} materi
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => startEdit(course)}
                                                        >
                                                            <Icon name="edit" className="h-4 w-4" />
                                                            Ubah
                                                        </Button>
                                                        <DeleteButton
                                                            href={route(
                                                                'admin.courses.destroy',
                                                                course.id
                                                            )}
                                                            message={`Hapus mata kuliah "${course.name}"?`}
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

                    <Pagination links={courses.links} />
                </section>
            </div>
        </div>
    );
}
