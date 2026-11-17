import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import EmptyState from '@/Components/EmptyState';
import { SelectInput, TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { fileSize, formatDate } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ materials, courses, filters }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [courseId, setCourseId] = useState(filters.course_id ?? '');
    const [meeting, setMeeting] = useState(filters.meeting_no ?? '');

    const apply = (next = {}) => {
        router.get(
            route('materials.index'),
            {
                q: next.q ?? q,
                course_id: next.course_id ?? courseId,
                meeting_no: next.meeting_no ?? meeting,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div>
            <Head title="Materi Kuliah" />

            <PageHeader
                title="Materi Kuliah"
                description="Telusuri modul, slide, dan tautan materi berdasarkan mata kuliah dan pertemuan."
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    apply();
                }}
                className="mb-5 grid gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm sm:grid-cols-[1fr_14rem_8rem_auto]"
            >
                <div className="relative">
                    <Icon
                        name="search"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <TextInput
                        value={q}
                        onChange={(event) => setQ(event.target.value)}
                        placeholder="Cari judul atau nama file…"
                        className="pl-9"
                    />
                </div>
                <SelectInput
                    value={courseId}
                    onChange={(event) => {
                        setCourseId(event.target.value);
                        apply({ course_id: event.target.value });
                    }}
                >
                    <option value="">Semua mata kuliah</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.code} — {course.name}
                        </option>
                    ))}
                </SelectInput>
                <SelectInput
                    value={meeting}
                    onChange={(event) => {
                        setMeeting(event.target.value);
                        apply({ meeting_no: event.target.value });
                    }}
                >
                    <option value="">Semua pertemuan</option>
                    {Array.from({ length: 16 }, (_, index) => index + 1).map((number) => (
                        <option key={number} value={number}>
                            Pertemuan {number}
                        </option>
                    ))}
                </SelectInput>
                <Button type="submit" variant="secondary">
                    Cari
                </Button>
            </form>

            {materials.data.length === 0 ? (
                <EmptyState
                    icon="book"
                    title="Materi tidak ditemukan"
                    description="Coba ubah kata kunci, mata kuliah, atau pertemuan."
                    action={
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => router.get(route('materials.index'))}
                        >
                            Reset filter
                        </Button>
                    }
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {materials.data.map((material) => (
                        <div
                            key={material.id}
                            className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge tone="indigo">{material.course.code}</Badge>
                                    {material.meeting_no && (
                                        <Badge tone="slate">Pertemuan {material.meeting_no}</Badge>
                                    )}
                                </div>
                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                        material.url
                                            ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400'
                                            : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                    }`}
                                >
                                    <Icon
                                        name={material.url ? 'link' : 'file'}
                                        className="h-4 w-4"
                                    />
                                </span>
                            </div>

                            <h2 className="mt-3 line-clamp-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                                {material.title}
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{material.course.name}</p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
                                <span>{material.url ? 'Tautan eksternal' : 'File materi'}</span>
                                {material.file_size && (
                                    <>
                                        <span>·</span>
                                        <span>{fileSize(material.file_size)}</span>
                                    </>
                                )}
                                <span>·</span>
                                <span>{formatDate(material.created_at)}</span>
                            </div>

                            <div className="mt-auto pt-4">
                                {material.url ? (
                                    <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        <Icon name="external" className="h-3.5 w-3.5" />
                                        Buka materi
                                    </a>
                                ) : (
                                    <Link
                                        href={route('materials.download', material.id)}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        <Icon name="download" className="h-3.5 w-3.5" />
                                        Unduh materi
                                    </Link>
                                )}
                                <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
                                    Diunggah oleh {material.uploader?.name ?? 'Admin'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination links={materials.links} />
        </div>
    );
}
