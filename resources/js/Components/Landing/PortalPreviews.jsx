import Icon from '@/Components/Icon';

export const heroScenarios = [
    { key: 'pengumuman', label: 'Pengumuman', icon: 'megaphone' },
    { key: 'jadwal', label: 'Jadwal', icon: 'calendar' },
    { key: 'tugas', label: 'Tugas', icon: 'clipboard' },
];

function AnnouncementPreview() {
    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-dusk/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8a5220]">
                    Disematkan
                </span>
                <span className="text-[10px] text-ink/45">Akademik</span>
            </div>
            <p className="mt-2 font-display text-[1.35rem] leading-[1.15] tracking-tight text-ink">
                Jadwal UTS Semester 5 sudah dipublikasikan.
            </p>
            <p className="mt-2 text-[11px] leading-5 text-ink/60">
                Cek sesi, ruang, dan dosen pengampu di halaman jadwal.
            </p>
            <p className="mt-3 text-[10px] text-ink/40">2 jam lalu · oleh Pengurus</p>
        </div>
    );
}

function SchedulePreview() {
    const rows = [
        { time: '08.00', course: 'Pemrograman Web Lanjut', room: 'Lab Komputer 1' },
        { time: '13.00', course: 'Basis Data Lanjut', room: 'Ruang 3.2' },
    ];

    return (
        <div>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-display text-lg leading-none text-ink">Senin</p>
                    <p className="mt-1 text-[10px] text-ink/45">17 November 2026</p>
                </div>
                <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink/50">
                    2 kelas
                </span>
            </div>
            <div className="mt-3 space-y-2">
                {rows.map((row) => (
                    <div
                        key={row.course}
                        className="flex items-center gap-2.5 rounded-lg border border-ink/10 bg-white/70 px-2.5 py-2"
                    >
                        <span className="w-9 shrink-0 rounded-md bg-ink/5 py-1 text-center font-mono text-[9px] font-semibold text-ink/60">
                            {row.time}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-[11px] font-semibold text-ink">{row.course}</p>
                            <p className="text-[9px] text-ink/45">{row.room}</p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-3 text-[10px] text-ink/40">Jadwal pekan ini sudah disesuaikan.</p>
        </div>
    );
}

function TaskPreview() {
    const tasks = [
        { title: 'Rancangan Sistem', meta: 'Deadline 2 hari lagi', pending: true },
        { title: 'Pemrograman Web', meta: 'Sudah dikumpulkan', pending: false },
        { title: 'Basis Data', meta: 'Sudah dikumpulkan', pending: false },
    ];

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <p className="font-display text-lg leading-none text-ink">Tugas terdekat</p>
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink/40">
                    3 aktif
                </span>
            </div>
            <div className="mt-3 space-y-2">
                {tasks.map((task) => (
                    <div
                        key={task.title}
                        className="flex items-center gap-2.5 rounded-lg border border-ink/10 bg-white/70 px-2.5 py-2"
                    >
                        <span
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                                task.pending
                                    ? 'border-dusk bg-dusk/15 text-[#8a5220]'
                                    : 'border-ink/20 bg-ink text-parchment'
                            }`}
                        >
                            {!task.pending && <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3} />}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-semibold text-ink">{task.title}</p>
                            <p className="text-[9px] text-ink/45">{task.meta}</p>
                        </div>
                        {task.pending && (
                            <span className="rounded-full bg-dusk/20 px-2 py-0.5 text-[8px] font-bold text-[#8a5220]">
                                H-2
                            </span>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-3">
                <div className="flex items-center justify-between text-[9px] font-medium text-ink/50">
                    <span>Progresmu</span>
                    <span>12 dari 14 selesai</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full w-[86%] rounded-full bg-ink" />
                </div>
            </div>
        </div>
    );
}

function ScenarioContent({ scenarioKey }) {
    if (scenarioKey === 'jadwal') {
        return <SchedulePreview />;
    }

    if (scenarioKey === 'tugas') {
        return <TaskPreview />;
    }

    return <AnnouncementPreview />;
}

export default function HeroPreviewCard({ activeIndex, onSelect }) {
    const active = heroScenarios[activeIndex] ?? heroScenarios[0];

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            onSelect(activeIndex + 1);
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            onSelect(activeIndex - 1);
        }
    };

    return (
        <div className="paper-card overflow-hidden rounded-[1.1rem] shadow-[0_30px_70px_-25px_rgba(7,11,22,0.7)]">
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-2.5">
                <span className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-ink text-parchment">
                        <Icon name="dashboard" className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] font-semibold text-ink">Portal kelas</span>
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink/35">
                    Ilustrasi
                </span>
            </div>

            <div
                role="tablist"
                aria-label="Pratinjau portal kelas"
                onKeyDown={handleKeyDown}
                className="flex gap-1 px-3 pt-3"
            >
                {heroScenarios.map((scenario, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <button
                            key={scenario.key}
                            type="button"
                            role="tab"
                            id={`hero-tab-${scenario.key}`}
                            aria-selected={isActive}
                            aria-controls={`hero-panel-${scenario.key}`}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => onSelect(index)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[10px] font-semibold transition ${
                                isActive
                                    ? 'bg-ink text-parchment shadow-sm'
                                    : 'text-ink/50 hover:bg-ink/5 hover:text-ink'
                            }`}
                        >
                            <Icon name={scenario.icon} className="h-3 w-3" />
                            {scenario.label}
                        </button>
                    );
                })}
            </div>

            <div
                key={active.key}
                id={`hero-panel-${active.key}`}
                role="tabpanel"
                aria-labelledby={`hero-tab-${active.key}`}
                className="preview-enter min-h-[190px] px-4 pb-4 pt-3"
            >
                <ScenarioContent scenarioKey={active.key} />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-4 py-2.5">
                <span className="flex items-center gap-1.5 text-[9px] font-medium text-ink/45">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Contoh tampilan
                </span>
                <span className="text-[9px] font-medium text-ink/40">Terbuka setelah masuk</span>
            </div>
        </div>
    );
}
