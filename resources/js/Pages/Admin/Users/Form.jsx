import Button from '@/Components/Button';
import { Checkbox, InputError, InputLabel, SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ user }) {
    const editing = Boolean(user);

    const form = useForm({
        name: user?.name ?? '',
        nim: user?.nim ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'user',
        phone: user?.phone ?? '',
        is_active: user?.is_active ?? true,
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onFinish: () => form.reset('password', 'password_confirmation'),
        };

        if (editing) {
            form.put(route('admin.users.update', user.id), options);
        } else {
            form.post(route('admin.users.store'), options);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <Head title={editing ? 'Ubah Pengguna' : 'Tambah Pengguna'} />

            <Link
                href={route('admin.users.index')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                Kembali ke daftar pengguna
            </Link>

            <PageHeader
                title={editing ? 'Ubah Pengguna' : 'Tambah Pengguna'}
                description="Akun dibuat oleh admin. Anggota dapat masuk menggunakan email atau NIM."
            />

            <form
                onSubmit={submit}
                className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-7"
            >
                <div>
                    <InputLabel htmlFor="name" required>
                        Nama lengkap
                    </InputLabel>
                    <TextInput
                        id="name"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                        placeholder="Nama sesuai daftar kelas"
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="nim" required>
                            NIM
                        </InputLabel>
                        <TextInput
                            id="nim"
                            value={form.data.nim}
                            onChange={(event) => form.setData('nim', event.target.value)}
                            placeholder="20230001"
                            maxLength={30}
                        />
                        <InputError message={form.errors.nim} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" required>
                            Email
                        </InputLabel>
                        <TextInput
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(event) => form.setData('email', event.target.value)}
                            placeholder="nama@kampus.ac.id"
                        />
                        <InputError message={form.errors.email} />
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="role" required>
                            Peran
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

                    <div>
                        <InputLabel htmlFor="phone">Nomor kontak</InputLabel>
                        <TextInput
                            id="phone"
                            value={form.data.phone}
                            onChange={(event) => form.setData('phone', event.target.value)}
                            placeholder="08xxxxxxxxxx"
                        />
                        <InputError message={form.errors.phone} />
                    </div>
                </div>

                <Checkbox
                    label="Akun aktif"
                    description="Akun nonaktif tidak dapat masuk ke portal."
                    checked={form.data.is_active}
                    onChange={(event) => form.setData('is_active', event.target.checked)}
                />

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {editing ? 'Ganti password (opsional)' : 'Password awal'}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {editing
                            ? 'Biarkan kosong jika tidak ingin mengganti password.'
                            : 'Minimal 8 karakter. Sampaikan password ini kepada anggota.'}
                    </p>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="password" required={!editing}>
                                Password
                            </InputLabel>
                            <TextInput
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                                autoComplete="new-password"
                            />
                            <InputError message={form.errors.password} />
                        </div>
                        <div>
                            <InputLabel htmlFor="password_confirmation" required={!editing}>
                                Konfirmasi password
                            </InputLabel>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(event) =>
                                    form.setData('password_confirmation', event.target.value)
                                }
                                autoComplete="new-password"
                            />
                        </div>
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
                        <Icon name="check" className="h-4 w-4" />
                        {form.processing
                            ? 'Menyimpan…'
                            : editing
                              ? 'Simpan perubahan'
                              : 'Buat akun'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
