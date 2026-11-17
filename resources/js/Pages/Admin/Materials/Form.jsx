import Button from '@/Components/Button';
import { FileInput, InputError, InputLabel, SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import { fileSize } from '@/lib/format';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ material, courses }) {
    const editing = Boolean(material);

    const form = useForm({
        course_id: material?.course_id ?? courses[0]?.id ?? '',
        title: material?.title ?? '',
        meeting_no: material?.meeting_no ?? '',
        file: null,
        url: material?.url ?? '',
    });

    const submit = (event) => {
        event.preventDefault();

        const options = { forceFormData: true, preserveScroll: true };

        if (editing) {
            form.put(route('admin.materials.update', material.id), options);
        } else {
            form.post(route('admin.materials.store'), options);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <Head title={editing ? 'Ubah Materi' : 'Tambah Materi'} />

            <Link
                href={route('admin.materials.index')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                Kembali ke daftar materi
            </Link>

            <PageHeader
                title={editing ? 'Ubah Materi' : 'Tambah Materi'}
                description="Unggah file materi atau simpan tautan eksternal seperti Google Drive."
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
                    terlebih dahulu.
                </div>
            ) : (
                <form
                    onSubmit={submit}
                    className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-7"
                >
                    <div className="grid gap-5 sm:grid-cols-2">
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

                        <div>
                            <InputLabel htmlFor="meeting_no">Pertemuan ke-</InputLabel>
                            <TextInput
                                id="meeting_no"
                                type="number"
                                min="1"
                                max="99"
                                value={form.data.meeting_no}
                                onChange={(event) =>
                                    form.setData('meeting_no', event.target.value)
                                }
                                placeholder="Contoh: 1"
                            />
                            <InputError message={form.errors.meeting_no} />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="title" required>
                            Judul materi
                        </InputLabel>
                        <TextInput
                            id="title"
                            value={form.data.title}
                            onChange={(event) => form.setData('title', event.target.value)}
                            placeholder="Contoh: Modul 1 — Routing dan Controller"
                            maxLength={200}
                        />
                        <InputError message={form.errors.title} />
                    </div>

                    {editing && material.file_path && (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                File saat ini
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                                <Icon name="file" className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <Link
                                    href={route('admin.materials.download', material.id)}
                                    className="min-w-0 flex-1 truncate text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100"
                                >
                                    {material.original_name || 'Unduh file materi'}
                                </Link>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {fileSize(material.file_size)}
                                </span>
                            </div>
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                Mengunggah file baru akan menggantikan file ini.
                            </p>
                        </div>
                    )}

                    <div>
                        <InputLabel htmlFor="file">File materi</InputLabel>
                        <FileInput
                            id="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt,.jpg,.jpeg,.png"
                            onChange={(event) =>
                                form.setData('file', event.target.files[0] ?? null)
                            }
                        />
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            Maksimal 20 MB. Format: PDF, dokumen, presentasi, spreadsheet, arsip,
                            teks, atau gambar.
                        </p>
                        <InputError message={form.errors.file} />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                atau
                            </span>
                            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <InputLabel htmlFor="url">Tautan materi</InputLabel>
                        <TextInput
                            id="url"
                            type="url"
                            value={form.data.url}
                            onChange={(event) => form.setData('url', event.target.value)}
                            placeholder="https://drive.google.com/…"
                        />
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            Isi minimal salah satu: file atau tautan.
                        </p>
                        <InputError message={form.errors.url} />
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 sm:flex-row sm:justify-end">
                        <Link
                            href={route('admin.materials.index')}
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
                                  : 'Tambah materi'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
