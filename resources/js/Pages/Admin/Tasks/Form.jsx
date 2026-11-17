import Button from '@/Components/Button';
import { FileInput, InputError, InputLabel, SelectInput, TextInput, TextareaInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import { fileSize, toDateTimeInput } from '@/lib/format';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Form({ task, courses }) {
    const editing = Boolean(task);
    const [fileInputKey, setFileInputKey] = useState(0);

    const form = useForm({
        course_id: task?.course_id ?? courses[0]?.id ?? '',
        title: task?.title ?? '',
        description: task?.description ?? '',
        due_at: toDateTimeInput(task?.due_at) || '',
        link: task?.link ?? '',
        attachments: [],
        remove_attachments: [],
    });

    const attachmentError =
        form.errors.attachments ||
        Object.keys(form.errors)
            .filter((key) => key.startsWith('attachments.'))
            .map((key) => form.errors[key])[0];

    const toggleRemoval = (id) => {
        const current = form.data.remove_attachments;
        form.setData(
            'remove_attachments',
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    };

    const submit = (event) => {
        event.preventDefault();

        const options = { forceFormData: true, preserveScroll: true };

        if (editing) {
            form.put(route('admin.tasks.update', task.id), options);
        } else {
            form.post(route('admin.tasks.store'), options);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <Head title={editing ? 'Ubah Tugas' : 'Tambah Tugas'} />

            <Link
                href={route('admin.tasks.index')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                Kembali ke daftar tugas
            </Link>

            <PageHeader
                title={editing ? 'Ubah Tugas' : 'Tambah Tugas'}
                description="Lengkapi detail tugas dan deadline. Anggota akan menandai progresnya masing-masing."
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
                            <InputLabel htmlFor="due_at" required>
                                Deadline
                            </InputLabel>
                            <TextInput
                                id="due_at"
                                type="datetime-local"
                                value={form.data.due_at}
                                onChange={(event) => form.setData('due_at', event.target.value)}
                            />
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                Waktu Indonesia Barat (WIB).
                            </p>
                            <InputError message={form.errors.due_at} />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="title" required>
                            Judul tugas
                        </InputLabel>
                        <TextInput
                            id="title"
                            value={form.data.title}
                            onChange={(event) => form.setData('title', event.target.value)}
                            placeholder="Contoh: Membuat CRUD Laravel"
                            maxLength={200}
                        />
                        <InputError message={form.errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="description">Deskripsi</InputLabel>
                        <TextareaInput
                            id="description"
                            rows={7}
                            value={form.data.description}
                            onChange={(event) => form.setData('description', event.target.value)}
                            placeholder="Jelaskan instruksi, format pengumpulan, dan kriteria penilaian…"
                        />
                        <InputError message={form.errors.description} />
                    </div>

                    <div>
                        <InputLabel htmlFor="link">Tautan pengumpulan</InputLabel>
                        <TextInput
                            id="link"
                            type="url"
                            value={form.data.link}
                            onChange={(event) => form.setData('link', event.target.value)}
                            placeholder="https://classroom.google.com/…"
                        />
                        <InputError message={form.errors.link} />
                    </div>

                    {editing && task.attachments?.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                Lampiran saat ini
                            </p>
                            <ul className="space-y-2">
                                {task.attachments.map((attachment) => (
                                    <li
                                        key={attachment.id}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3"
                                    >
                                        <Icon
                                            name="file"
                                            className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {attachment.name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {fileSize(attachment.size)}
                                            </p>
                                        </div>
                                        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-rose-600 dark:text-rose-400 focus:ring-rose-500"
                                                checked={form.data.remove_attachments.includes(
                                                    attachment.id
                                                )}
                                                onChange={() => toggleRemoval(attachment.id)}
                                            />
                                            Hapus
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                Centang lampiran yang ingin dihapus saat menyimpan.
                            </p>
                        </div>
                    )}

                    <div>
                        <InputLabel htmlFor="attachments">Tambah lampiran</InputLabel>
                        <FileInput
                            key={fileInputKey}
                            id="attachments"
                            multiple
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt,.jpg,.jpeg,.png"
                            onChange={(event) =>
                                form.setData('attachments', Array.from(event.target.files ?? []))
                            }
                        />
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            Maksimal 5 file, masing-masing maksimal 5 MB.
                        </p>
                        <InputError message={attachmentError} />

                        {form.data.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {form.data.attachments.map((file) => (
                                    <span
                                        key={file.name}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        <Icon name="file" className="h-3 w-3" />
                                        {file.name}
                                    </span>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        form.setData('attachments', []);
                                        setFileInputKey((value) => value + 1);
                                    }}
                                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
                                >
                                    Batalkan pilihan
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 sm:flex-row sm:justify-end">
                        <Link
                            href={route('admin.tasks.index')}
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
                                  : 'Tambah tugas'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
