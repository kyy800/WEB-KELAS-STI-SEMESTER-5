const fieldBase =
    'block w-full rounded-lg border-slate-300 bg-white text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-400';

export function InputLabel({ htmlFor, children, required = false }) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
            {children}
            {required && <span className="ml-0.5 text-rose-500 dark:text-rose-400">*</span>}
        </label>
    );
}

export function InputError({ message }) {
    if (!message) return null;
    return <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{message}</p>;
}

export function TextInput({ className = '', ...props }) {
    return <input className={`${fieldBase} ${className}`} {...props} />;
}

export function SelectInput({ className = '', children, ...props }) {
    return (
        <select className={`${fieldBase} ${className}`} {...props}>
            {children}
        </select>
    );
}

export function TextareaInput({ className = '', rows = 5, ...props }) {
    return <textarea rows={rows} className={`${fieldBase} ${className}`} {...props} />;
}

export function Checkbox({ label, description, className = '', ...props }) {
    return (
        <label className={`flex cursor-pointer items-start gap-3 ${className}`}>
            <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-indigo-500 dark:focus:ring-indigo-400"
                {...props}
            />
            <span>
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </span>
                {description && (
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {description}
                    </span>
                )}
            </span>
        </label>
    );
}

export function FileInput({ className = '', ...props }) {
    return (
        <input
            type="file"
            className={`block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-500 shadow-sm file:mr-3 file:border-0 file:bg-slate-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700 ${className}`}
            {...props}
        />
    );
}
