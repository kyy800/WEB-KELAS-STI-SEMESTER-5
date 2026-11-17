import Icon from '@/Components/Icon';

const tones = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    sky: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
};

export default function StatCard({ label, value, icon, tone = 'indigo' }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {value}
                    </p>
                </div>
                <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone] ?? tones.indigo}`}
                >
                    <Icon name={icon} className="h-5 w-5" />
                </span>
            </div>
        </div>
    );
}
