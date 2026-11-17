import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-1" aria-label="Navigasi halaman">
            {links.map((link, index) => {
                const label = link.label
                    .replace('&laquo; Previous', '‹ Sebelumnya')
                    .replace('Next &raquo;', 'Berikutnya ›');

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="rounded-lg px-3 py-2 text-sm text-slate-300 dark:text-slate-600"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                            link.active
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-white hover:text-indigo-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-indigo-300'
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </nav>
    );
}
