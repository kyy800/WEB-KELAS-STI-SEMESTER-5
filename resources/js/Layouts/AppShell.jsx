import Avatar from '@/Components/Avatar';
import FlashMessages from '@/Components/FlashMessages';
import Icon from '@/Components/Icon';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function isActive(patterns) {
    return patterns.some((pattern) => route().current(pattern));
}

function Brand({ variant }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black tracking-tight text-white shadow-sm">
                STI
            </span>
            <span>
                <span className="block text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">
                    Kelas STI
                </span>
                <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {variant === 'admin' ? 'Panel Admin' : 'Semester 5'}
                </span>
            </span>
        </div>
    );
}

function Navigation({ sections, onNavigate }) {
    return (
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
            {sections.map((section, index) => (
                <div key={section.title ?? index}>
                    {section.title && (
                        <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            {section.title}
                        </p>
                    )}
                    <div className="space-y-0.5">
                        {section.items.map((item) => {
                            const active = isActive(item.patterns);

                            return (
                                <Link
                                    key={item.label}
                                    href={route(item.routeName)}
                                    onClick={onNavigate}
                                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                        active
                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
                                    }`}
                                >
                                    <Icon
                                        name={item.icon}
                                        className={`h-[18px] w-[18px] shrink-0 ${
                                            active
                                                ? 'text-indigo-600 dark:text-indigo-400'
                                                : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                                        }`}
                                    />
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}

function UserCard({ user, onNavigate }) {
    return (
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
                <Avatar user={user} size="sm" />
                <div className="min-w-0 flex-1">
                    <Link
                        href={route('profile.edit')}
                        onClick={onNavigate}
                        className="block truncate text-sm font-semibold text-slate-800 hover:text-indigo-700 dark:text-slate-200 dark:hover:text-indigo-300"
                    >
                        {user.name}
                    </Link>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.role === 'admin' ? 'Admin kelas' : user.nim}
                    </p>
                </div>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    title="Keluar"
                >
                    <Icon name="logout" className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

export default function AppShell({ variant = 'user', sections, bottomNav = [], children }) {
    const page = usePage();
    const user = page.props.auth.user;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [page.url]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
                    <Link href={route(variant === 'admin' ? 'admin.dashboard' : 'dashboard')}>
                        <Brand variant={variant} />
                    </Link>
                    <ThemeToggle />
                </div>
                <Navigation sections={sections} />
                <UserCard user={user} />
            </aside>

            <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/95">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        aria-label="Buka menu"
                    >
                        <Icon name="menu" className="h-5 w-5" />
                    </button>
                    <Brand variant={variant} />
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link href={route('profile.edit')} aria-label="Profil">
                        <Avatar user={user} size="sm" />
                    </Link>
                </div>
            </header>

            {open && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
                        onClick={() => setOpen(false)}
                        aria-label="Tutup menu"
                    />
                    <aside className="relative flex h-full w-[min(18rem,85vw)] flex-col bg-white shadow-xl dark:bg-slate-900">
                        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
                            <Brand variant={variant} />
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                aria-label="Tutup menu"
                            >
                                <Icon name="close" className="h-5 w-5" />
                            </button>
                        </div>
                        <Navigation sections={sections} onNavigate={() => setOpen(false)} />
                        <UserCard user={user} onNavigate={() => setOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="lg:pl-64">
                <main className="mx-auto max-w-7xl px-4 pb-28 pt-20 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
                    <FlashMessages />
                    {children}
                </main>
            </div>

            {bottomNav.length > 0 && (
                <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/95">
                    <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
                        {bottomNav.map((item) => {
                            const active = isActive(item.patterns);

                            return (
                                <Link
                                    key={item.label}
                                    href={route(item.routeName)}
                                    className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition ${
                                        active
                                            ? 'text-indigo-700 dark:text-indigo-300'
                                            : 'text-slate-500 dark:text-slate-400'
                                    }`}
                                >
                                    <Icon
                                        name={item.icon}
                                        className={`h-5 w-5 ${
                                            active
                                                ? 'text-indigo-600 dark:text-indigo-400'
                                                : 'text-slate-400 dark:text-slate-500'
                                        }`}
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
