import Button from '@/Components/Button';
import { InputError, InputLabel, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const form = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('password.store'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <div>
            <Head title="Reset Password" />

            <div className="mb-8">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                    <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                    Kembali ke halaman masuk
                </Link>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Atur password baru
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Gunakan minimal 8 karakter agar akun tetap aman.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div>
                    <InputLabel htmlFor="email" required>
                        Email
                    </InputLabel>
                    <TextInput
                        id="email"
                        type="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        autoComplete="email"
                    />
                    <InputError message={form.errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="password" required>
                        Password baru
                    </InputLabel>
                    <TextInput
                        id="password"
                        type="password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                        autoComplete="new-password"
                        autoFocus
                    />
                    <InputError message={form.errors.password} />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" required>
                        Konfirmasi password
                    </InputLabel>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={form.data.password_confirmation}
                        onChange={(event) => form.setData('password_confirmation', event.target.value)}
                        autoComplete="new-password"
                    />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={form.processing}>
                    {form.processing ? 'Menyimpan…' : 'Simpan password baru'}
                </Button>
            </form>
        </div>
    );
}
