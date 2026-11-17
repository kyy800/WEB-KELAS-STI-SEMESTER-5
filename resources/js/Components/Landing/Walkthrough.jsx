import Icon from '@/Components/Icon';
import { usePinnedProgress, usePrefersReducedMotion } from '@/lib/motion';
import { useRef, useState } from 'react';
import WindowFrame from './WindowFrame';

const steps = [
    {
        key: 'masuk',
        tone: 'dawn',
        icon: 'user',
        title: 'Masuk',
        summary: 'Satu akun untuk semua.',
        description:
            'Gunakan email kampus atau NIM yang sudah didaftarkan pengurus. Tidak ada registrasi mandiri, jadi akses kelas tetap terjaga.',
        points: ['Login dengan email atau NIM', 'Akun dibuat oleh admin kelas'],
    },
    {
        key: 'pantau',
        tone: 'noon',
        icon: 'dashboard',
        title: 'Pantau',
        summary: 'Hari ini, sekilas.',
        description:
            'Dashboard merangkum pengumuman terbaru, jadwal hari ini, dan deadline terdekat. Semua yang penting muncul lebih dulu.',
        points: ['Pengumuman penting disematkan', 'Jadwal dan ruang per hari'],
    },
    {
        key: 'tandai',
        tone: 'dusk',
        icon: 'checkCircle',
        title: 'Tandai',
        summary: 'Progres milikmu sendiri.',
        description:
            'Tandai tugas yang sudah selesai. Progres tersimpan di akunmu, tanpa mengubah data anggota lain.',
        points: ['Checklist per tugas', 'Deadline aktif terurut'],
    },
    {
        key: 'kelola',
        tone: 'night',
        icon: 'shield',
        title: 'Kelola',
        summary: 'Pengurus tetap pegang kendali.',
        description:
            'Pengurus memperbarui pengumuman, jadwal, tugas, materi, hingga akun anggota dari satu panel—termasuk impor CSV.',
        points: ['Kelola konten kelas', 'Impor anggota via CSV'],
    },
];

const fieldClass =
    'mt-1 rounded-lg border border-ink/10 bg-white px-3 py-2 text-[11px] text-ink/55';

function LoginCard() {
    return (
        <div className="paper-card w-full max-w-[320px] p-5">
            <p className="kicker text-ink/40">Masuk ke portal</p>
            <p className="mt-2 font-display text-2xl leading-tight text-ink">
                Selamat datang kembali.
            </p>

            <div className="mt-4 space-y-2.5">
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                        Email atau NIM
                    </p>
                    <div className={fieldClass}>namakamu@kelas.sti</div>
                </div>
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                        Password
                    </p>
                    <div className={fieldClass}>••••••••</div>
                </div>
                <div className="rounded-lg bg-ink px-3 py-2 text-center text-[11px] font-semibold text-parchment">
                    Masuk
                </div>
            </div>

            <p className="mt-3 text-center text-[9px] text-ink/40">
                Akun dibuat oleh admin kelas
            </p>
        </div>
    );
}

function TodayCard() {
    const schedule = [
        { time: '08.00', course: 'Pemrograman Web Lanjut', room: 'Lab Komputer 1' },
        { time: '13.00', course: 'Basis Data Lanjut', room: 'Ruang 3.2' },
    ];

    return (
        <div className="paper-card w-full max-w-[330px] p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="kicker text-ink/40">Dashboard</p>
                    <p className="mt-1 font-display text-xl leading-none text-ink">
                        Halo, anggota.
                    </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Senin
                </span>
            </div>

            <div className="mt-3 rounded-lg border border-dusk/30 bg-dusk/10 p-2.5">
                <div className="flex items-center gap-1.5">
                    <Icon name="pin" className="h-3 w-3 text-[#8a5220]" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#8a5220]">
                        Disematkan
                    </span>
                </div>
                <p className="mt-1.5 text-[11px] font-semibold leading-4 text-ink">
                    Jadwal UTS Semester 5 sudah terbit
                </p>
            </div>

            <div className="mt-2.5 space-y-1.5">
                {schedule.map((item) => (
                    <div key={item.time} className="flex items-center gap-2">
                        <span className="w-9 shrink-0 rounded-md bg-ink/5 py-1 text-center font-mono text-[8px] font-semibold text-ink/60">
                            {item.time}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-[10px] font-semibold text-ink">{item.course}</p>
                            <p className="text-[8px] text-ink/45">{item.room}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TaskCard() {
    const tasks = [
        { title: 'Rancangan Sistem', meta: 'Deadline 2 hari lagi', done: false },
        { title: 'Pemrograman Web', meta: 'Sudah dikumpulkan', done: true },
        { title: 'Basis Data', meta: 'Sudah dikumpulkan', done: true },
    ];

    return (
        <div className="paper-card w-full max-w-[320px] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="kicker text-ink/40">Tugas</p>
                <span className="text-[9px] font-semibold text-ink/50">12 / 14 selesai</span>
            </div>
            <p className="mt-1.5 font-display text-xl leading-none text-ink">Minggu ini.</p>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full w-[86%] rounded-full bg-ink" />
            </div>

            <div className="mt-3 space-y-1.5">
                {tasks.map((task) => (
                    <div
                        key={task.title}
                        className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white/70 px-2.5 py-2"
                    >
                        <span
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                                task.done
                                    ? 'border-ink bg-ink text-parchment'
                                    : 'border-dusk bg-dusk/15'
                            }`}
                        >
                            {task.done && (
                                <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3} />
                            )}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-semibold text-ink">
                                {task.title}
                            </p>
                            <p className="text-[8px] text-ink/45">{task.meta}</p>
                        </div>
                        {!task.done && (
                            <span className="rounded-full bg-dusk/20 px-1.5 py-0.5 text-[7px] font-bold text-[#8a5220]">
                                H-2
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <p className="mt-2.5 text-[9px] text-ink/40">Progres tersimpan di akunmu.</p>
        </div>
    );
}

function AdminCard() {
    const rows = [
        { icon: 'megaphone', label: 'Pengumuman', count: '3' },
        { icon: 'calendar', label: 'Jadwal', count: '6' },
        { icon: 'clipboard', label: 'Tugas', count: '6' },
        { icon: 'book', label: 'Materi', count: '5' },
        { icon: 'users', label: 'Anggota', count: '7' },
    ];

    return (
        <div className="paper-card w-full max-w-[330px] p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-parchment">
                        <Icon name="shield" className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                            Panel pengurus
                        </p>
                        <p className="text-[11px] font-semibold text-ink">Kelola kelas</p>
                    </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Admin
                </span>
            </div>

            <div className="mt-3 space-y-1">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center gap-2.5 rounded-lg border border-ink/10 bg-white/70 px-2.5 py-1.5"
                    >
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-ink/5 text-ink/60">
                            <Icon name={row.icon} className="h-3 w-3" />
                        </span>
                        <span className="flex-1 text-[10px] font-semibold text-ink">{row.label}</span>
                        <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[8px] font-bold text-ink/45">
                            {row.count}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-ink/10 bg-ink/5 px-2.5 py-2">
                <Icon name="upload" className="h-3 w-3 text-ink/55" />
                <span className="text-[9px] font-medium text-ink/60">Impor anggota via CSV</span>
            </div>
        </div>
    );
}

function PreviewCard({ step }) {
    if (step.key === 'pantau') {
        return <TodayCard />;
    }

    if (step.key === 'tandai') {
        return <TaskCard />;
    }

    if (step.key === 'kelola') {
        return <AdminCard />;
    }

    return <LoginCard />;
}

function PreviewWindow({ step }) {
    return (
        <WindowFrame
            tone={step.tone}
            decorative
            className="h-full w-full"
            innerClassName="flex h-full items-center justify-center p-8"
            overlayClassName="bg-gradient-to-b from-ink/20 via-ink/10 to-ink/55"
        >
            <div key={step.key} className="preview-enter w-full max-w-[330px]">
                <PreviewCard step={step} />
            </div>
        </WindowFrame>
    );
}

export default function Walkthrough() {
    const sectionRef = useRef(null);
    const progress = usePinnedProgress(sectionRef);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [openIndex, setOpenIndex] = useState(0);

    const activeIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    const activeStep = steps[activeIndex];

    const goToStep = (index) => {
        setOpenIndex(index);

        if (
            typeof window === 'undefined' ||
            !window.matchMedia('(min-width: 1024px)').matches
        ) {
            return;
        }

        const node = sectionRef.current;

        if (!node) {
            return;
        }

        const top = node.getBoundingClientRect().top + window.scrollY;
        const travel = node.offsetHeight - window.innerHeight;
        const target = top + travel * ((index + 0.5) / steps.length);

        window.scrollTo({
            top: target,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
    };

    return (
        <section
            ref={sectionRef}
            id="alur"
            aria-labelledby="alur-heading"
            className="relative bg-parchment px-5 py-20 dark:bg-ink-950 sm:px-8 lg:h-[360vh] lg:py-0"
        >
            <div className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-16">
                <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14">
                    <div>
                        <p className="kicker text-dusk">Alur</p>
                        <h2
                            id="alur-heading"
                            className="mt-3 max-w-lg font-display text-4xl leading-[1.02] tracking-[-0.02em] text-ink dark:text-parchment sm:text-5xl"
                        >
                            Dari masuk sampai kelas terjaga.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-7 text-ink/55 dark:text-parchment/55">
                            Empat langkah kecil yang membuat informasi kelas tetap rapi—untuk
                            anggota maupun pengurus.
                        </p>

                        <div className="mt-10 hidden lg:block">
                            {steps.map((step, index) => {
                                const isActive = index === activeIndex;
                                const localProgress = Math.min(
                                    1,
                                    Math.max(0, progress * steps.length - index),
                                );
                                const fill = index < activeIndex ? 1 : localProgress;

                                return (
                                    <button
                                        key={step.key}
                                        type="button"
                                        onClick={() => goToStep(index)}
                                        className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dusk"
                                    >
                                        <span className="relative block h-px w-full overflow-hidden bg-ink/15 dark:bg-parchment/15">
                                            <span
                                                className="absolute inset-y-0 left-0 w-full origin-left bg-ink transition-transform duration-500 dark:bg-parchment"
                                                style={{ transform: `scaleX(${fill})` }}
                                            />
                                        </span>

                                        <span className="flex items-start gap-4 py-4">
                                            <span
                                                className={`mt-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] transition ${
                                                    isActive
                                                        ? 'text-ink dark:text-parchment'
                                                        : 'text-ink/35 dark:text-parchment/35'
                                                }`}
                                            >
                                                0{index + 1}
                                            </span>

                                            <span className="flex-1">
                                                <span
                                                    className={`flex items-center gap-2 font-display text-2xl leading-none transition ${
                                                        isActive
                                                            ? 'text-ink dark:text-parchment'
                                                            : 'text-ink/40 dark:text-parchment/40'
                                                    }`}
                                                >
                                                    {step.title}
                                                    <Icon
                                                        name={step.icon}
                                                        className={`h-4 w-4 transition ${
                                                            isActive ? 'opacity-100' : 'opacity-0'
                                                        }`}
                                                    />
                                                </span>
                                                <span
                                                    className={`mt-1.5 block text-xs leading-5 transition ${
                                                        isActive
                                                            ? 'text-ink/65 dark:text-parchment/65'
                                                            : 'text-ink/35 dark:text-parchment/35'
                                                    }`}
                                                >
                                                    {step.summary}
                                                </span>
                                                {isActive && (
                                                    <span className="mt-2 block max-w-md text-xs leading-5 text-ink/55 dark:text-parchment/55">
                                                        {step.description}
                                                    </span>
                                                )}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 space-y-3 lg:hidden">
                            {steps.map((step, index) => {
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        key={step.key}
                                        className="overflow-hidden rounded-2xl border border-ink/10 bg-parchment-50 dark:border-white/10 dark:bg-ink-900"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                            aria-expanded={isOpen}
                                            aria-controls={`alur-panel-${step.key}`}
                                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-dusk"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink/40 dark:text-parchment/40">
                                                    0{index + 1}
                                                </span>
                                                <span className="font-display text-xl leading-none text-ink dark:text-parchment">
                                                    {step.title}
                                                </span>
                                            </span>
                                            <Icon
                                                name="chevronDown"
                                                className={`h-4 w-4 shrink-0 text-ink/45 transition dark:text-parchment/45 ${
                                                    isOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        {isOpen && (
                                            <div
                                                id={`alur-panel-${step.key}`}
                                                className="px-5 pb-5"
                                            >
                                                <p className="text-sm leading-6 text-ink/60 dark:text-parchment/60">
                                                    {step.description}
                                                </p>
                                                <ul className="mt-3 space-y-1.5">
                                                    {step.points.map((point) => (
                                                        <li
                                                            key={point}
                                                            className="flex items-start gap-2 text-xs text-ink/55 dark:text-parchment/55"
                                                        >
                                                            <Icon
                                                                name="check"
                                                                className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400"
                                                                strokeWidth={3}
                                                            />
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="mt-4 rounded-2xl bg-gradient-to-br from-ink-700 via-ink-900 to-ink-950 p-4">
                                                    <div className="mx-auto max-w-[330px]">
                                                        <PreviewCard step={step} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="h-[540px]">
                            <PreviewWindow step={activeStep} />
                        </div>
                        <p className="mt-4 text-right font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink/35 dark:text-parchment/35">
                            Contoh tampilan · {activeStep.title}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
