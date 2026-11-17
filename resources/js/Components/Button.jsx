const variants = {
    primary:
        'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-800',
    secondary:
        'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-500 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800 dark:disabled:text-slate-500',
    outline:
        'bg-transparent text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50 focus-visible:outline-indigo-600 disabled:text-indigo-300 dark:text-indigo-300 dark:ring-indigo-800 dark:hover:bg-indigo-500/10 dark:disabled:text-indigo-500/40',
    danger:
        'bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:outline-rose-600 disabled:bg-rose-300 dark:disabled:bg-rose-800',
    success:
        'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-800',
    ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-slate-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
};

const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
};

export function buttonClasses({ variant = 'primary', size = 'md', className = '' } = {}) {
    return `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    children,
    ...props
}) {
    return (
        <button
            type={type}
            className={buttonClasses({ variant, size, className })}
            {...props}
        >
            {children}
        </button>
    );
}
