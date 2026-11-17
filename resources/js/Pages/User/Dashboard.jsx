import Badge from "@/Components/Badge";
import EmptyState from "@/Components/EmptyState";
import Icon from "@/Components/Icon";
import StatCard from "@/Components/StatCard";
import TaskToggle from "@/Components/TaskToggle";
import {
    categoryLabel,
    categoryTone,
    deadlineInfo,
    formatDate,
    formatLongDate,
    formatTime,
} from "@/lib/format";
import { Head, Link, usePage } from "@inertiajs/react";

function greeting() {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
}

export default function Dashboard({
    announcements,
    tasks,
    todaySchedules,
    todayName,
    stats,
}) {
    const user = usePage().props.auth.user;

    return (
        <div className="space-y-6">
            <Head title="Dashboard" />

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-6 text-white shadow-sm sm:p-8">
                <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
                            {formatLongDate()}
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                            {greeting()}, {user.name.split(" ")[0]}!
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Ini ringkasan kelas hari {todayName}. Cek pengumuman
                            terbaru dan pastikan tidak ada tugas yang terlewat.
                        </p>
                    </div>
                    <Link
                        href={route("tasks.index", { status: "aktif" })}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold ring-1 ring-inset ring-white/25 backdrop-blur transition hover:bg-white/20"
                    >
                        Lihat tugas aktif
                        <Icon name="arrowRight" className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Anggota aktif"
                    value={stats.members}
                    icon="users"
                    tone="indigo"
                />
                <StatCard
                    label="Tugas aktif"
                    value={stats.activeTasks}
                    icon="clipboard"
                    tone="amber"
                />
                <StatCard
                    label="Materi kuliah"
                    value={stats.materials}
                    icon="book"
                    tone="emerald"
                />
                <StatCard
                    label="Pengumuman"
                    value={stats.announcements}
                    icon="megaphone"
                    tone="sky"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                                    <Icon
                                        name="megaphone"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Pengumuman terbaru
                                </h2>
                            </div>
                            <Link
                                href={route("announcements.index")}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                            >
                                Lihat semua
                            </Link>
                        </div>

                        {announcements.length === 0 ? (
                            <div className="p-5">
                                <EmptyState
                                    icon="megaphone"
                                    title="Belum ada pengumuman"
                                    description="Pengumuman dari admin akan muncul di sini."
                                />
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {announcements.map((announcement) => (
                                    <li key={announcement.id}>
                                        <Link
                                            href={route(
                                                "announcements.show",
                                                announcement.id,
                                            )}
                                            className="block px-5 py-4 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                {announcement.is_pinned && (
                                                    <Badge tone="amber">
                                                        <Icon
                                                            name="pin"
                                                            className="h-3 w-3"
                                                        />
                                                        Disematkan
                                                    </Badge>
                                                )}
                                                <Badge
                                                    tone={categoryTone(
                                                        announcement.category,
                                                    )}
                                                >
                                                    {categoryLabel(
                                                        announcement.category,
                                                    )}
                                                </Badge>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    {formatDate(
                                                        announcement.published_at,
                                                    )}
                                                </span>
                                            </div>
                                            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {announcement.title}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                {announcement.body}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                    <Icon
                                        name="clipboard"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Deadline terdekat
                                </h2>
                            </div>
                            <Link
                                href={route("tasks.index")}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                            >
                                Semua tugas
                            </Link>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="p-5">
                                <EmptyState
                                    icon="checkCircle"
                                    title="Tidak ada tugas aktif"
                                    description="Semua tugas sudah selesai atau belum ada tugas baru."
                                />
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {tasks.map((task) => {
                                    const deadline = deadlineInfo(
                                        task.due_at,
                                        false,
                                    );

                                    return (
                                        <li
                                            key={task.id}
                                            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge tone="indigo">
                                                        {task.course.code}
                                                    </Badge>
                                                    <Badge tone={deadline.tone}>
                                                        {deadline.label}
                                                    </Badge>
                                                </div>
                                                <Link
                                                    href={route(
                                                        "tasks.show",
                                                        task.id,
                                                    )}
                                                    className="mt-1.5 block truncate text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-700 dark:hover:text-indigo-300"
                                                >
                                                    {task.title}
                                                </Link>
                                                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                    <Icon
                                                        name="clock"
                                                        className="h-3.5 w-3.5"
                                                    />
                                                    {formatDate(task.due_at)} ·{" "}
                                                    {task.course.name}
                                                </p>
                                            </div>
                                            <TaskToggle
                                                task={{
                                                    ...task,
                                                    is_completed: false,
                                                }}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400">
                                <Icon name="calendar" className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Jadwal hari ini
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {todayName}
                                </p>
                            </div>
                        </div>

                        {todaySchedules.length === 0 ? (
                            <div className="p-5">
                                <EmptyState
                                    icon="calendar"
                                    title="Tidak ada kelas"
                                    description="Tidak ada jadwal kuliah hari ini."
                                />
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {todaySchedules.map((schedule) => {
                                    const exception = schedule.today_exception;
                                    const cancelled =
                                        exception?.type === "pembatalan";

                                    return (
                                        <li
                                            key={schedule.id}
                                            className="px-5 py-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p
                                                        className={`text-sm font-semibold ${cancelled ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-900 dark:text-slate-100"}`}
                                                    >
                                                        {schedule.course.name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                        {exception?.new_start_time
                                                            ? `${formatTime(exception.new_start_time)}–${formatTime(exception.new_end_time ?? schedule.end_time)}`
                                                            : `${formatTime(schedule.start_time)}–${formatTime(schedule.end_time)}`}
                                                        {" · "}
                                                        {exception?.new_room ||
                                                            schedule.room ||
                                                            "Ruang belum ditentukan"}
                                                    </p>
                                                </div>
                                                {cancelled ? (
                                                    <Badge tone="rose">
                                                        Dibatalkan
                                                    </Badge>
                                                ) : exception ? (
                                                    <Badge tone="amber">
                                                        Berubah
                                                    </Badge>
                                                ) : (
                                                    <Badge tone="indigo">
                                                        {schedule.course.code}
                                                    </Badge>
                                                )}
                                            </div>
                                            {(exception?.note ||
                                                schedule.note) && (
                                                <p className="mt-2 rounded-lg bg-amber-50 dark:bg-amber-500/15 px-3 py-2 text-xs leading-5 text-amber-800 dark:text-amber-200">
                                                    {exception?.note ||
                                                        schedule.note}
                                                </p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        <div className="border-t border-slate-100 dark:border-slate-800 p-3">
                            <Link
                                href={route("schedules.index")}
                                className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                            >
                                Lihat jadwal mingguan
                                <Icon
                                    name="arrowRight"
                                    className="h-3.5 w-3.5"
                                />
                            </Link>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Akses cepat
                        </h2>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {[
                                {
                                    label: "Materi",
                                    routeName: "materials.index",
                                    icon: "book",
                                },
                                {
                                    label: "Anggota",
                                    routeName: "members.index",
                                    icon: "users",
                                },
                                {
                                    label: "Pengumuman",
                                    routeName: "announcements.index",
                                    icon: "megaphone",
                                },
                                {
                                    label: "Profil",
                                    routeName: "profile.edit",
                                    icon: "user",
                                },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={route(item.routeName)}
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                    <Icon
                                        name={item.icon}
                                        className="h-4 w-4 text-slate-400 dark:text-slate-500"
                                    />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
