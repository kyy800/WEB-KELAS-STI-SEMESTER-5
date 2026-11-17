import Avatar from '@/Components/Avatar';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import EmptyState from '@/Components/EmptyState';
import { TextInput } from '@/Components/Field';
import Icon from '@/Components/Icon';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ members, filters }) {
    const [q, setQ] = useState(filters.q ?? '');

    const submit = (event) => {
        event.preventDefault();
        router.get(
            route('members.index'),
            { q },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div>
            <Head title="Anggota Kelas" />

            <PageHeader
                title="Anggota Kelas"
                description={`${members.total} anggota aktif terdaftar di portal kelas.`}
            >
                <form onSubmit={submit} className="flex gap-2">
                    <div className="relative">
                        <Icon
                            name="search"
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                        />
                        <TextInput
                            value={q}
                            onChange={(event) => setQ(event.target.value)}
                            placeholder="Cari nama atau NIM…"
                            className="w-56 pl-9"
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        Cari
                    </Button>
                </form>
            </PageHeader>

            {members.data.length === 0 ? (
                <EmptyState
                    icon="users"
                    title="Anggota tidak ditemukan"
                    description="Coba kata kunci lain."
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {members.data.map((member) => (
                        <div
                            key={member.id}
                            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <Avatar user={member} size="md" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                            {member.name}
                                        </h2>
                                        {member.role === 'admin' && (
                                            <Badge tone="indigo">Admin</Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.nim}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                                <a
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300 transition hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                    <Icon name="mail" className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                    <span className="truncate">{member.email}</span>
                                </a>
                                {member.phone && (
                                    <a
                                        href={`tel:${member.phone}`}
                                        className="flex items-center gap-2 text-slate-600 dark:text-slate-300 transition hover:text-indigo-700 dark:hover:text-indigo-300"
                                    >
                                        <Icon name="phone" className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                        {member.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination links={members.links} />
        </div>
    );
}
