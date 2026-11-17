import Icon from '@/Components/Icon';
import ThemeToggle from '@/Components/ThemeToggle';
import { useBodyScrollLock, useScrolledPast } from '@/lib/motion';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Brand from './Brand';

const navigation = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Kabar', href: '#kabar' },
    { label: 'Alur', href: '#alur' },
    { label: 'Fitur', href: '#fitur' },
    { label: 'FAQ', href: '#faq' },
];

export default function LandingHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const scrolled = useScrolledPast(24);
    const firstLinkRef = useRef(null);

    useBodyScrollLock(menuOpen);

    useEffect(() => {
        if (!menuOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 60);

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                    scrolled || menuOpen
                        ? 'border-b border-ink/10 bg-parchment/85 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/80'
                        : 'border-b border-transparent bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
                    <a
                        href="#beranda"
                        onClick={closeMenu}
                        className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dusk"
                    >
                        <Brand />
                    </a>

                    <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-[0.8rem] font-medium text-ink/60 underline-offset-4 transition hover:text-ink hover:underline dark:text-parchment/60 dark:hover:text-parchment"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle tone="landing" />

                        <Link
                            href={route('login')}
                            className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-parchment transition hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk dark:bg-parchment dark:text-ink dark:hover:bg-parchment-200 sm:inline-flex"
                        >
                            Masuk
                            <Icon name="arrowRight" className="h-3.5 w-3.5" />
                        </Link>

                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition hover:border-ink/35 hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk dark:border-parchment/25 dark:text-parchment/70 dark:hover:border-parchment/45 dark:hover:bg-parchment/10 dark:hover:text-parchment lg:hidden"
                        >
                            <Icon name={menuOpen ? 'close' : 'menu'} className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            {menuOpen && (
                <div
                    id="mobile-menu"
                    className="landing-sheet fixed inset-0 z-40 overflow-y-auto bg-parchment px-6 pb-10 pt-28 dark:bg-ink-950 lg:hidden"
                >
                    <div className="mx-auto flex min-h-full max-w-lg flex-col justify-between">
                        <nav className="space-y-1" aria-label="Navigasi seluler">
                            {navigation.map((item, index) => (
                                <a
                                    key={item.href}
                                    ref={index === 0 ? firstLinkRef : undefined}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className="group flex items-baseline justify-between border-b border-ink/10 py-4 font-display text-4xl leading-none text-ink transition hover:text-dusk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dusk dark:border-white/10 dark:text-parchment dark:hover:text-dusk"
                                >
                                    {item.label}
                                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink/35 dark:text-parchment/35">
                                        0{index + 1}
                                    </span>
                                </a>
                            ))}
                        </nav>

                        <div className="pt-10">
                            <Link
                                href={route('login')}
                                onClick={closeMenu}
                                className="flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-sm font-semibold text-parchment transition hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk dark:bg-parchment dark:text-ink dark:hover:bg-parchment-200"
                            >
                                Masuk ke portal
                                <Icon name="arrowRight" className="h-4 w-4" />
                            </Link>
                            <p className="mt-4 text-xs leading-6 text-ink/55 dark:text-parchment/55">
                                Akun dibuat oleh admin kelas. Registrasi mandiri dinonaktifkan.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
