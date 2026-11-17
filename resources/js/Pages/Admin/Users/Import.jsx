import Button from '@/Components/Button';
import { FileInput, InputError, InputLabel, SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm } from '@inertiajs/react';

const templateCsv =
    'name,email,nim,phone\n' +
    'Aulia Rahma,aulia@kampus.ac.id,20230002,081234567890\n' +
    'Bagas Pratama,bagas@kampus.ac.id,20230003,\n';

export default function Import() {
    const form = useForm({
        file: null,
        default_password: '',
        role: 'user',
    });

    const submit = (event) => {
        event.preventDefault();

        form.post(route('admin.users.import.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const downloadTemplate = () => {
        const blob = new Blob([templateCsv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'template-impor-anggota.csv';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mx-auto max-w-2xl">
            <Head title="Impor Akun" />

            <Link
                href={route('admin.users.index')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                Kembali ke daftar pengguna
            </Link>

            <PageHeader
                title="Impor Akun dari CSV"
                description="Buat banyak akun sekaligus. Baris dengan email atau NIM duplikat akan dilewati."
            />

            <form
                onSubmit={submit}
                className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-7"
            >
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Format file CSV
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Pemisah koma atau titik koma. Maksimal 500 baris.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={downloadTemplate}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-500/30 transition hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                        >
                            <Icon name="download" className="h-3.5 w-3.5" />
                            Unduh template
                        </button>
                    </div>

                    <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-[11px] leading-5 text-slate-100">
{templateCsv}</pre>

                    <ul className="mt-3 space-y-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        <li>• Kolom wajib: name, email, nim.</li>
                        <li>• Kolom opsional: phone.</li>
                        <li>• Baris dengan email/NIM yang sudah terdaftar akan dilewati.</li>
                    </ul>
                </div>

                <div>
                    <InputLabel htmlFor="file" required>
                        File CSV
                    </InputLabel>
                    <FileInput
                        id="file"
                        accept=".csv,text/csv,text/plain"
                        onChange={(event) =>
                            form.setData('file', event.target.files[0] ?? null)
                        }
                    />
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        Maksimal 2 MB. Gunakan encoding UTF-8.
                    </p>
                    <InputError message={form.errors.file} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="default_password" required>
                            Password awal
                        </InputLabel>
                        <TextInput
                            id="default_password"
                            type="text"
                            value={form.data.default_password}
                            onChange={(event) =>
                                form.setData('default_password', event.target.value)
                            }
                            placeholder="Minimal 8 karakter"
                        />
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            Password yang sama dipakai untuk semua akun baru.
                        </p>
                        <InputError message={form.errors.default_password} />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" required>
                            Peran akun baru
                        </InputLabel>
                        <SelectInput
                            id="role"
                            value={form.data.role}
                            onChange={(event) => form.setData('role', event.target.value)}
                        >
                            <option value="user">Anggota</option>
                            <option value="admin">Admin</option>
                        </SelectInput>
                        <InputError message={form.errors.role} />
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 sm:flex-row sm:justify-end">
                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Batal
                    </Link>
                    <Button type="submit" disabled={form.processing}>
                        <Icon name="upload" className="h-4 w-4" />
                        {form.processing ? 'Mengimpor…' : 'Mulai impor'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
