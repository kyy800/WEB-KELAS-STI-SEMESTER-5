import Avatar from '@/Components/Avatar';
import Button from '@/Components/Button';
import { FileInput, InputError, InputLabel, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function AvatarPreview({ user, file }) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return undefined;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    if (preview) {
        return <img src={preview} alt="Pratinjau avatar" className="h-24 w-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-800" />;
    }

    return <Avatar user={user} size="xl" />;
}

export default function Edit({ user }) {
    const profile = useForm({
        name: user.name,
        phone: user.phone ?? '',
        avatar: null,
    });

    const password = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (event) => {
        event.preventDefault();
        profile.patch(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const submitPassword = (event) => {
        event.preventDefault();
        password.put(route('profile.password'), {
            preserveScroll: true,
            onFinish: () => password.reset(),
        });
    };

    return (
        <div>
            <Head title="Profil Saya" />

            <PageHeader
                title="Profil Saya"
                description="Perbarui informasi yang terlihat oleh anggota kelas lain dan jaga keamanan akun."
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-1">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <AvatarPreview user={user} file={profile.data.avatar} />
                            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.nim}</p>
                            <span className="mt-3 inline-flex rounded-full bg-indigo-50 dark:bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-500/30">
                                {user.role === 'admin' ? 'Admin kelas' : 'Anggota kelas'}
                            </span>
                        </div>

                        <dl className="mt-6 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 text-sm">
                            <div className="flex items-start gap-3">
                                <Icon name="mail" className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <div className="min-w-0">
                                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Email</dt>
                                    <dd className="truncate font-medium text-slate-800 dark:text-slate-200">{user.email}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Icon name="phone" className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Kontak</dt>
                                    <dd className="font-medium text-slate-800 dark:text-slate-200">{user.phone || 'Belum diisi'}</dd>
                                </div>
                            </div>
                        </dl>

                        <p className="mt-6 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Email dan NIM hanya dapat diubah oleh admin kelas.
                        </p>
                    </div>
                </section>

                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Informasi profil</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Nama tampilan dan kontak ini terlihat oleh anggota lain yang sudah login.
                            </p>
                        </div>

                        <form onSubmit={submitProfile} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="name" required>
                                        Nama tampilan
                                    </InputLabel>
                                    <TextInput
                                        id="name"
                                        value={profile.data.name}
                                        onChange={(event) => profile.setData('name', event.target.value)}
                                    />
                                    <InputError message={profile.errors.name} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="phone">Nomor kontak</InputLabel>
                                    <TextInput
                                        id="phone"
                                        value={profile.data.phone}
                                        onChange={(event) => profile.setData('phone', event.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    <InputError message={profile.errors.phone} />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="avatar">Foto profil</InputLabel>
                                <FileInput
                                    id="avatar"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(event) => profile.setData('avatar', event.target.files[0] ?? null)}
                                />
                                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    JPG, PNG, atau WebP. Maksimal 2 MB.
                                </p>
                                <InputError message={profile.errors.avatar} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={profile.processing}>
                                    {profile.processing ? 'Menyimpan…' : 'Simpan profil'}
                                </Button>
                            </div>
                        </form>
                    </section>

                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Ganti password</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Gunakan password yang kuat dan tidak dipakai di layanan lain.
                            </p>
                        </div>

                        <form onSubmit={submitPassword} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="current_password" required>
                                    Password saat ini
                                </InputLabel>
                                <TextInput
                                    id="current_password"
                                    type="password"
                                    value={password.data.current_password}
                                    onChange={(event) => password.setData('current_password', event.target.value)}
                                    autoComplete="current-password"
                                />
                                <InputError message={password.errors.current_password} />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="new_password" required>
                                        Password baru
                                    </InputLabel>
                                    <TextInput
                                        id="new_password"
                                        type="password"
                                        value={password.data.password}
                                        onChange={(event) => password.setData('password', event.target.value)}
                                        autoComplete="new-password"
                                    />
                                    <InputError message={password.errors.password} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="password_confirmation" required>
                                        Konfirmasi password
                                    </InputLabel>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        value={password.data.password_confirmation}
                                        onChange={(event) =>
                                            password.setData('password_confirmation', event.target.value)
                                        }
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" variant="secondary" disabled={password.processing}>
                                    {password.processing ? 'Menyimpan…' : 'Perbarui password'}
                                </Button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
