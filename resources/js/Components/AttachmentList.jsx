import Icon from '@/Components/Icon';
import { fileSize } from '@/lib/format';

function isImageAttachment(attachment) {
    if (typeof attachment.is_image === 'boolean') {
        return attachment.is_image;
    }

    return (attachment.mime_type ?? '').startsWith('image/');
}

export default function AttachmentList({ attachments = [], title = 'Lampiran' }) {
    if (!attachments.length) {
        return null;
    }

    const images = attachments.filter(isImageAttachment);
    const files = attachments.filter((attachment) => !isImageAttachment(attachment));

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>

            {images.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {images.map((attachment) => {
                        const previewUrl = route('attachments.preview', attachment.id);
                        const downloadUrl = route('attachments.download', attachment.id);

                        return (
                            <figure
                                key={attachment.id}
                                className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                            >
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group block bg-slate-50 dark:bg-slate-800"
                                    title="Buka gambar ukuran penuh"
                                >
                                    <img
                                        src={previewUrl}
                                        alt={attachment.name}
                                        loading="lazy"
                                        className="h-56 w-full object-contain transition group-hover:opacity-90"
                                    />
                                </a>
                                <figcaption className="flex items-center gap-3 border-t border-slate-100 px-3.5 py-2.5 dark:border-slate-800">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                                        <Icon name="image" className="h-4 w-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                                            {attachment.name}
                                        </span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                            {attachment.size_label || fileSize(attachment.size)}
                                        </span>
                                    </span>
                                    <a
                                        href={downloadUrl}
                                        className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                                        title="Unduh gambar"
                                    >
                                        <Icon name="download" className="h-4 w-4" />
                                        Unduh
                                    </a>
                                </figcaption>
                            </figure>
                        );
                    })}
                </div>
            )}

            {files.length > 0 && (
                <ul className="space-y-2">
                    {files.map((attachment) => (
                        <li key={attachment.id}>
                            <a
                                href={route('attachments.download', attachment.id)}
                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                    <Icon name="file" className="h-4 w-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-medium text-slate-800 dark:text-slate-200">
                                        {attachment.name}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {attachment.size_label || fileSize(attachment.size)}
                                    </span>
                                </span>
                                <Icon
                                    name="download"
                                    className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
