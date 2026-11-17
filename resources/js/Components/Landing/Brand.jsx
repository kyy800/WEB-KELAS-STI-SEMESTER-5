export default function Brand({ variant = 'ink', compact = false }) {
    const isLight = variant === 'light';

    return (
        <span className="flex items-center gap-3">
            <span
                className={`grid place-items-center rounded-[0.7rem] border ${
                    compact ? 'h-9 w-9' : 'h-10 w-10'
                } ${
                    isLight
                        ? 'border-parchment/30 bg-parchment/10 text-parchment'
                        : 'border-ink/15 bg-ink text-parchment dark:border-parchment/25 dark:bg-parchment dark:text-ink'
                }`}
            >
                <svg
                    viewBox="0 0 24 24"
                    className={compact ? 'h-4 w-4' : 'h-[18px] w-[18px]'}
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M4 11a8 8 0 0 1 16 0v9H4v-9Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                    />
                    <path d="M12 3.5V20M4 12h16" stroke="currentColor" strokeWidth="1.6" />
                </svg>
            </span>
            <span className="leading-tight">
                <span
                    className={`block font-display text-lg leading-none tracking-tight ${
                        isLight ? 'text-parchment' : 'text-ink dark:text-parchment'
                    }`}
                >
                    Web Kelas STI
                </span>
                <span
                    className={`mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.24em] ${
                        isLight ? 'text-parchment/55' : 'text-ink/50 dark:text-parchment/50'
                    }`}
                >
                    Semester 5
                </span>
            </span>
        </span>
    );
}
