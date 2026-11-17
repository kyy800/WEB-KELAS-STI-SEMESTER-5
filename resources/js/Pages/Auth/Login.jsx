import Button from '@/Components/Button';
import { Checkbox, InputError, InputLabel, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ canResetPassword, status, demo }) {
    const form = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('login'), {
            onFinish: () => form.reset('password'),
        });
    };

    const fillDemo = () => {
        form.setData({
            login: demo.login,
            password: demo.password,
            remember: false,
        });
    };

    return (
        <div>
            <Head title="Masuk" />

            <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    Selamat datang kembali
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Masuk ke portal kelas
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Gunakan email kampus atau NIM yang terdaftar.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-xl border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-7">
                <div>
                    <InputLabel htmlFor="login" required>
                        Email atau NIM
                    </InputLabel>
                    <TextInput
                        id="login"
                        type="text"
                        name="login"
                        value={form.data.login}
                        onChange={(event) => form.setData('login', event.target.value)}
                        autoComplete="username"
                        autoFocus
                        placeholder="nama@kampus.ac.id atau 20230001"
                    />
                    <InputError message={form.errors.login} />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" required>
                            Password
                        </InputLabel>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="mb-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                        autoComplete="current-password"
                        placeholder="••••••••"
                    />
                    <InputError message={form.errors.password} />
                </div>

                <Checkbox
                    label="Ingat saya"
                    checked={form.data.remember}
                    onChange={(event) => form.setData('remember', event.target.checked)}
                />

                <Button type="submit" className="w-full" size="lg" disabled={form.processing}>
                    {form.processing ? 'Memproses…' : 'Masuk'}
                    {!form.processing && <Icon name="arrowRight" className="h-4 w-4" />}
                </Button>
            </form>

            {demo && (
                <div className="mt-5 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/60 dark:bg-indigo-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        <div className="text-xs leading-5 text-indigo-900 dark:text-indigo-100">
                            <p className="font-semibold">Akun demo (data seeder)</p>
                            <p>
                                Admin: <span className="font-mono">{demo.login}</span> /{' '}
                                <span className="font-mono">{demo.password}</span>
                            </p>
                            <p className="mt-0.5 text-indigo-700 dark:text-indigo-300">
                                Anggota: gunakan NIM <span className="font-mono">20230002</span> dengan
                                password yang sama.
                            </p>
                            <button
                                type="button"
                                onClick={fillDemo}
                                className="mt-2 font-semibold text-indigo-700 dark:text-indigo-300 underline underline-offset-2 hover:text-indigo-900 dark:hover:text-indigo-100"
                            >
                                Isi otomatis akun admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p className="mt-6 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                Akun dibuat oleh admin kelas. Registrasi mandiri dinonaktifkan.
            </p>
        </div>
    );
}
