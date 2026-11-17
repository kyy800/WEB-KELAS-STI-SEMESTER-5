import { initials } from '@/lib/format';

const sizes = {
    xs: 'h-8 w-8 text-[11px]',
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
};

export default function Avatar({ user, size = 'md', className = '' }) {
    const sizeClass = sizes[size] ?? sizes.md;

    if (user?.avatar_url) {
        return (
            <img
                src={user.avatar_url}
                alt={user.name}
                className={`${sizeClass} shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 ${className}`}
            />
        );
    }

    return (
        <span
            className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 font-semibold text-white ring-2 ring-white dark:ring-slate-800 ${className}`}
        >
            {initials(user?.name)}
        </span>
    );
}
