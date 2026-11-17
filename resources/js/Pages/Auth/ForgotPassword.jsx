import Button from '@/Components/Button';
import { InputError, InputLabel, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const form = useForm({ email: '' });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('password.email'));
    };

    return (
        <div>
            <Head title="Lupa Password" />

            <div className="mb-8">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                    <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                    Kembali ke halaman masuk
                </Link>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Lupa password?
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Masukkan email terdaftar. Kami akan mengirim tautan untuk mengatur ulang
                    password.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-xl border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {status}
                </div>
            )}

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
                        autoFocus
                        placeholder="nama@kampus.ac.id"
                    />
                    <InputError message={form.errors.email} />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={form.processing}>
                    {form.processing ? 'Mengirim…' : 'Kirim tautan reset'}
                </Button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                Di lingkungan lokal, tautan reset tercatat di <span className="font-mono">storage/logs/laravel.log</span>.
            </p>
        </div>
    );
}
