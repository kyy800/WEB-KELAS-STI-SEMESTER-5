import Icon from '@/Components/Icon';
import { useCountUp, useInView } from '@/lib/motion';

const numberFormatter = new Intl.NumberFormat('id-ID');

const statItems = [
    { key: 'members', label: 'Anggota aktif', note: 'terdaftar & aktif' },
    { key: 'courses', label: 'Mata kuliah', note: 'di semester berjalan' },
    { key: 'materials', label: 'Materi kuliah', note: 'file & tautan' },
    { key: 'activeTasks', label: 'Tugas aktif', note: 'belum lewat tenggat' },
];

const marqueeItems = [
    'Pengumuman',
    'Jadwal kuliah',
    'Tugas & deadline',
    'Materi',
    'Anggota',
    'Panel pengurus',
    'Kabar kelas',
    'Progres pribadi',
];

function StatItem({ value, label, note, index }) {
    const [ref, inView] = useInView({ threshold: 0.4 });
    const counted = useCountUp(value ?? 0, inView);

    return (
        <div
            ref={ref}
            className="border-l border-ink/10 pl-5 dark:border-white/10 sm:pl-6"
        >
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-ink/35 dark:text-parchment/35">
                0{index + 1}
            </p>
            <p className="mt-3 font-display text-[2.9rem] leading-none tabular-nums text-ink dark:text-parchment sm:text-[3.4rem]">
                {numberFormatter.format(counted)}
            </p>
            <p className="mt-2 text-sm font-semibold text-ink dark:text-parchment">{label}</p>
            <p className="mt-1 text-[11px] text-ink/45 dark:text-parchment/45">{note}</p>
        </div>
    );
}

function MarqueeList({ duplicate = false }) {
    return (
        <ul
            aria-hidden={duplicate || undefined}
            className={`flex shrink-0 items-center ${duplicate ? 'marquee-duplicate' : ''}`}
        >
            {marqueeItems.map((item) => (
                <li key={item} className="flex items-center gap-7 pr-7">
                    <span className="whitespace-nowrap font-display text-xl leading-none text-ink/45 dark:text-parchment/45">
                        {item}
                    </span>
                    <span className="text-[9px] text-dusk" aria-hidden="true">
                        ✦
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default function StatsStrip({ stats = {} }) {
    return (
        <section
            aria-label="Statistik dan cakupan kelas"
            className="relative border-y border-ink/10 bg-parchment-50 dark:border-white/10 dark:bg-ink-900"
        >
            <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 lg:pb-12 lg:pt-16">
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-0">
                    {statItems.map((item, index) => (
                        <StatItem
                            key={item.key}
                            index={index}
                            label={item.label}
                            note={item.note}
                            value={stats[item.key]}
                        />
                    ))}
                </div>

                <p className="mt-10 flex items-start gap-2 text-[10px] leading-5 text-ink/40 dark:text-parchment/40">
                    <Icon name="info" className="mt-0.5 h-3 w-3 shrink-0" />
                    Angka agregat diambil langsung dari portal. Data rinci hanya terlihat setelah
                    masuk.
                </p>
            </div>

            <div className="marquee overflow-hidden border-t border-ink/10 py-4 dark:border-white/10">
                <div className="marquee-track">
                    <MarqueeList />
                    <MarqueeList duplicate />
                </div>
            </div>
        </section>
    );
}
