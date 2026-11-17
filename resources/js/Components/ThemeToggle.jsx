import Icon from '@/Components/Icon';
import { useEffect, useState } from 'react';

function documentIsDark() {
    return document.documentElement.classList.contains('dark');
}

const baseClasses =
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition';

const toneClasses = {
    default:
        'border-slate-200 bg-white text-slate-500 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300',
    landing:
        'rounded-full border-ink/15 bg-transparent text-ink/65 hover:border-ink/35 hover:bg-ink/5 hover:text-ink dark:border-parchment/25 dark:text-parchment/70 dark:hover:border-parchment/45 dark:hover:bg-parchment/10 dark:hover:text-parchment',
};

export default function ThemeToggle({ className = '', tone = 'default' }) {
    const [dark, setDark] = useState(() => documentIsDark());

    useEffect(() => {
        const sync = () => setDark(documentIsDark());
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        const followSystem = (event) => {
            let hasPreference = false;

            try {
                hasPreference = Boolean(localStorage.getItem('theme'));
            } catch (error) {
                hasPreference = false;
            }

            if (!hasPreference) {
                document.documentElement.classList.toggle('dark', event.matches);
                sync();
            }
        };

        window.addEventListener('theme-change', sync);
        media.addEventListener('change', followSystem);

        return () => {
            window.removeEventListener('theme-change', sync);
            media.removeEventListener('change', followSystem);
        };
    }, []);

    const toggle = () => {
        const next = !documentIsDark();

        document.documentElement.classList.toggle('dark', next);

        try {
            localStorage.setItem('theme', next ? 'dark' : 'light');
        } catch (error) {
            // Ignore storage failures; the theme still applies for this session.
        }

        window.dispatchEvent(new Event('theme-change'));
    };

    return (
        <button
            type="button"
            onClick={toggle}
            title={dark ? 'Aktifkan mode terang' : 'Aktifkan mode malam'}
            aria-label={dark ? 'Aktifkan mode terang' : 'Aktifkan mode malam'}
            className={`${baseClasses} ${toneClasses[tone] ?? toneClasses.default} ${className}`}
        >
            <Icon name={dark ? 'sun' : 'moon'} className="h-4 w-4" />
        </button>
    );
}
