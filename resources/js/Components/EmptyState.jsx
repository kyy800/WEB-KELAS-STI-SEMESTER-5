import Icon from '@/Components/Icon';

export default function EmptyState({ icon = 'info', title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Icon name={icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
