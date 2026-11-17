import Icon from '@/Components/Icon';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    const success = flash?.success;
    const error = flash?.error;

    useEffect(() => {
        setVisible(true);
        if (!success && !error) return undefined;

        const timer = window.setTimeout(() => setVisible(false), 6000);
        return () => window.clearTimeout(timer);
    }, [success, error]);

    if (!visible || (!success && !error)) {
        return null;
    }

    const message = error || success;
    const isError = Boolean(error);

    return (
        <div className="fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
            <div
                className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg ${
                    isError
                        ? 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/40 dark:bg-rose-950/90 dark:text-rose-200'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/90 dark:text-emerald-200'
                }`}
            >
                <Icon
                    name={isError ? 'alert' : 'checkCircle'}
                    className="mt-0.5 h-5 w-5 shrink-0"
                />
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="rounded p-0.5 opacity-60 transition hover:opacity-100"
                    aria-label="Tutup notifikasi"
                >
                    <Icon name="close" className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
