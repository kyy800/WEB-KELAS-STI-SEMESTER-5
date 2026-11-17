import Icon from '@/Components/Icon';
import { useInView } from '@/lib/motion';
import { Link } from '@inertiajs/react';

const feed = [
    {
        time: 'Hari ini · 08.12',
        badge: 'Pengumuman',
        icon: 'megaphone',
        tone: 'dusk',
        title: 'Jadwal UTS Semester 5 sudah dipublikasikan',
        description:
            'Cek sesi, ruang, dan dosen pengampu di halaman jadwal. Pengumuman ini disematkan di dashboard.',
    },
    {
        time: 'Kemarin · 16.40',
        badge: 'Perubahan jadwal',
        icon: 'calendar',
        tone: 'dawn',
        title: 'Basis Data Lanjut pindah ke Ruang 3.2',
        description:
            'Berlaku mulai Senin pekan depan. Catatan perubahan tersimpan langsung di jadwal kelas.',
    },
    {
        time: '2 hari lagi',
        badge: 'Tugas',
        icon: 'clipboard',
        tone: 'rose',
        title: 'Rancangan Sistem menunggu sampai Jumat',
        description:
            'Deadline 20 November, 23.59. Tandai selesai saat tugas sudah dikumpulkan.',
    },
    {
        time: 'Minggu ini',
        badge: 'Materi',
        icon: 'book',
        tone: 'emerald',
        title: 'Materi Pertemuan 8 sudah diunggah',
        description:
            'Pemrograman Web Lanjut · PDF 2,4 MB. Unduh langsung dari halaman materi.',
    },
];

const badgeTones = {
    dusk: 'bg-dusk/20 text-[#8a5220] dark:bg-dusk/15 dark:text-dusk',
    dawn: 'bg-dawn/15 text-[#3d57b8] dark:bg-dawn/20 dark:text-[#aebfff]',
    rose: 'bg-rose-500/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
};

const dotTones = {
    dusk: 'border-dusk/40 bg-dusk/15 text-[#8a5220] dark:text-dusk',
    dawn: 'border-dawn/30 bg-dawn/15 text-[#3d57b8] dark:text-[#aebfff]',
    rose: 'border-rose-300/60 bg-rose-500/10 text-rose-700 dark:border-rose-400/30 dark:text-rose-300',
    emerald:
        'border-emerald-300/60 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-300',
};

function FeedItem({ item, index }) {
    const [ref, inView] = useInView({ threshold: 0.3 });

    return (
        <article
            ref={ref}
            style={{ transitionDelay: `${index * 60}ms` }}
            className={`reveal-up relative pl-10 ${inView ? 'is-visible' : ''}`}
        >
            <span
                className={`absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full border ${dotTones[item.tone]}`}
                aria-hidden="true"
            >
                <Icon name={item.icon} className="h-3 w-3" />
            </span>

            <div className="flex flex-wrap items-center gap-2">
                <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[0.55rem] font-semibold uppercase tracking-[0.16em] ${badgeTones[item.tone]}`}
                >
                    {item.badge}
                </span>
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/40 dark:text-parchment/40">
                    {item.time}
                </span>
            </div>

            <h3 className="mt-3 max-w-xl font-display text-2xl leading-tight tracking-tight text-ink dark:text-parchment">
                {item.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink/55 dark:text-parchment/55">
                {item.description}
            </p>
        </article>
    );
}

export default function KabarFeed() {
    return (
        <section
            id="kabar"
            aria-labelledby="kabar-heading"
            className="border-t border-ink/10 bg-parchment-50 px-5 py-20 dark:border-white/10 dark:bg-ink-900 sm:px-8 lg:py-28"
        >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <p className="kicker text-dusk">Kabar kelas</p>
                    <h2
                        id="kabar-heading"
                        className="mt-3 max-w-md font-display text-4xl leading-[1.02] tracking-[-0.02em] text-ink dark:text-parchment sm:text-5xl"
                    >
                        Kabar yang tidak tenggelam.
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-ink/55 dark:text-parchment/55">
                        Pengumuman penting, perubahan jadwal, dan deadline terdekat muncul di
                        tempat yang sama—tidak perlu scroll chat berhalaman-halaman.
                    </p>

                    <div className="mt-8 flex gap-3 rounded-2xl border border-ink/10 bg-parchment-100 p-4 dark:border-white/10 dark:bg-ink-950">
                        <Icon
                            name="info"
                            className="mt-0.5 h-4 w-4 shrink-0 text-ink/40 dark:text-parchment/40"
                        />
                        <p className="text-[11px] leading-5 text-ink/50 dark:text-parchment/50">
                            Kabar di atas adalah contoh tampilan. Data asli hanya bisa dilihat
                            setelah masuk.
                        </p>
                    </div>

                    <Link
                        href={route('login')}
                        className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-ink underline decoration-ink/20 underline-offset-4 transition hover:decoration-ink dark:text-parchment dark:decoration-parchment/25 dark:hover:decoration-parchment"
                    >
                        Masuk untuk melihat kabar asli
                        <Icon name="arrowRight" className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="relative">
                    <span
                        className="absolute bottom-2 left-3 top-2 w-px bg-ink/10 dark:bg-parchment/10"
                        aria-hidden="true"
                    />
                    <div className="space-y-10">
                        {feed.map((item, index) => (
                            <FeedItem key={item.title} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
