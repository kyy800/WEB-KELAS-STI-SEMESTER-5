import Icon from '@/Components/Icon';
import { Link } from '@inertiajs/react';
import Brand from './Brand';

const navigation = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Kabar', href: '#kabar' },
    { label: 'Alur', href: '#alur' },
    { label: 'Fitur', href: '#fitur' },
    { label: 'FAQ', href: '#faq' },
];

export default function LandingFooter() {
    return (
        <footer className="border-t border-white/10 bg-ink-950 text-parchment">
            <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-sm">
                        <Brand variant="light" />
                        <p className="mt-4 text-xs leading-6 text-parchment/50">
                            Portal informasi dan administrasi internal Kelas STI Semester 5.
                            Halaman publik hanya menampilkan angka agregat; konten kelas hanya
                            terbuka setelah masuk.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-10 sm:gap-16">
                        <div>
                            <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-parchment/30">
                                Navigasi
                            </p>
                            <ul className="mt-3 space-y-2">
                                {navigation.map((item) => (
                                    <li key={item.href}>
                                        <a
                                            href={item.href}
                                            className="text-sm text-parchment/60 transition hover:text-parchment"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-parchment/30">
                                Akses
                            </p>
                            <ul className="mt-3 space-y-2">
                                <li>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-1.5 text-sm text-parchment/60 transition hover:text-parchment"
                                    >
                                        Masuk ke portal
                                        <Icon name="arrowRight" className="h-3 w-3" />
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-parchment/60 transition hover:text-parchment"
                                    >
                                        Lupa password
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-parchment/30 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Kelas STI Semester 5</p>
                    <p>Dibangun dengan Laravel, React &amp; Tailwind CSS</p>
                </div>
            </div>
        </footer>
    );
}
