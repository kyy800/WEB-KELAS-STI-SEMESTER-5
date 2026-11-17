import Icon from '@/Components/Icon';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function TaskToggle({ task, showLabel = true, className = '' }) {
    const [processing, setProcessing] = useState(false);

    const toggle = () => {
        router.post(
            route('tasks.toggle', task.id),
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={processing}
            title={task.is_completed ? 'Tandai belum selesai' : 'Tandai selesai'}
            className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                task.is_completed
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30 dark:hover:bg-emerald-500/20'
                    : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:text-indigo-700 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800 dark:hover:text-indigo-300'
            } ${className}`}
        >
            <span
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                    task.is_completed
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
                }`}
            >
                {task.is_completed && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
            </span>
            {showLabel && (task.is_completed ? 'Selesai' : 'Tandai selesai')}
        </button>
    );
}
