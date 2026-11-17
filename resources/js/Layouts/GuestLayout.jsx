import Icon from '@/Components/Icon';
import ThemeToggle from '@/Components/ThemeToggle';

const features = [
    'Satu tempat untuk pengumuman, jadwal, dan materi kuliah.',
    'Pantau deadline tugas dan progres pribadi.',
    'Transparan untuk seluruh anggota kelas.',
];

export default function GuestLayout({ title, children }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid lg:grid-cols-2">
            <div className="fixed right-4 top-4 z-40">
                <ThemeToggle />
            </div>

            <aside className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl dark:bg-indigo-500/10" />
                <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/10" />

                <div className="relative">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-sm font-black ring-1 ring-white/20">
                            STI
                        </span>
                        <div>
                            <p className="text-sm font-bold">Web Kelas STI</p>
                            <p className="text-xs text-indigo-200">Semester 5</p>
                        </div>
                    </div>

                    <h1 className="mt-16 max-w-md text-4xl font-bold leading-tight tracking-tight">
                        Informasi kelas, rapi dan mudah dicari.
                    </h1>
                    <p className="mt-4 max-w-md text-sm leading-6 text-indigo-100">
                        Portal internal kelas untuk memusatkan informasi akademik dan administrasi
                        — dari pengumuman sampai materi perkuliahan.
                    </p>

                    <ul className="mt-10 space-y-4">
                        {features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm text-indigo-100">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                                </span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-indigo-300">
                    © {new Date().getFullYear()} Kelas STI Semester 5. Portal internal.
                </p>
            </aside>

            <main className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white">
                            STI
                        </span>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Web Kelas STI
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Semester 5</p>
                        </div>
                    </div>

                    {children}

                    <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
                        © {new Date().getFullYear()} Kelas STI Semester 5
                    </p>
                </div>
            </main>
        </div>
    );
}
