import Icon from '@/Components/Icon';
import { useInView } from '@/lib/motion';
import WindowFrame from './WindowFrame';

const features = [
    {
        icon: 'megaphone',
        title: 'Pengumuman',
        description:
            'Info akademik, kegiatan, dan umum tersusun rapi. Pengumuman penting dapat disematkan di paling atas.',
    },
    {
        icon: 'calendar',
        title: 'Jadwal Kuliah',
        description:
            'Jadwal mingguan lengkap dengan ruang, dosen, serta catatan perubahan atau pembatalan kelas.',
    },
    {
        icon: 'clipboard',
        title: 'Tugas & Deadline',
        description:
            'Pantau deadline terdekat dan tandai tugas yang sudah selesai. Progres tersimpan untuk akunmu sendiri.',
    },
    {
        icon: 'book',
        title: 'Materi Kuliah',
        description:
            'Materi dikelompokkan per mata kuliah dan pertemuan, tersedia sebagai file unduhan atau tautan eksternal.',
    },
    {
        icon: 'users',
        title: 'Daftar Anggota',
        description:
            'Temukan kontak anggota kelas dengan mudah. Data anggota hanya dapat diakses setelah masuk ke portal.',
    },
    {
        icon: 'shield',
        title: 'Panel Pengurus',
        description:
            'Pengurus dapat mengelola seluruh konten, jadwal, akun, hingga impor anggota secara massal via CSV.',
    },
];

export default function FeatureWindow() {
    const [ref, inView] = useInView({ threshold: 0.08 });

    return (
        <section
            id="fitur"
            ref={ref}
            aria-labelledby="fitur-heading"
            className="bg-parchment px-5 py-20 dark:bg-ink-950 sm:px-8 lg:py-28"
        >
            <WindowFrame
                tone="noon"
                decorative
                className="mx-auto max-w-7xl rounded-[2rem]"
                innerClassName="px-5 py-14 sm:px-10 lg:px-14 lg:py-20"
                overlayClassName="bg-gradient-to-b from-ink/60 via-ink/35 to-ink/70"
            >
                <div className="max-w-2xl">
                    <p className="kicker text-parchment/60">Fitur · Jendela siang</p>
                    <h2
                        id="fitur-heading"
                        className="mt-3 font-display text-4xl leading-[1.02] tracking-[-0.02em] text-parchment sm:text-5xl lg:text-[3.4rem]"
                    >
                        Enam ruang, satu jendela.
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-parchment/70">
                        Setiap kebutuhan kelas punya tempatnya. Tidak ada lagi tautan yang hilang
                        atau jadwal yang tertimbun percakapan.
                    </p>
                </div>

                <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <article
                            key={feature.title}
                            style={{ transitionDelay: `${index * 70}ms` }}
                            className={`reveal-up ${
                                inView ? 'is-visible' : ''
                            } group rounded-2xl border border-white/40 bg-parchment-50/95 p-5 text-ink shadow-xl shadow-ink/10 backdrop-blur-sm dark:border-white/10 dark:bg-ink-900/90 dark:text-parchment`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-parchment dark:bg-parchment dark:text-ink">
                                    <Icon name={feature.icon} className="h-4 w-4" />
                                </span>
                                <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-ink/30 dark:text-parchment/30">
                                    0{index + 1}
                                </span>
                            </div>

                            <h3 className="mt-4 font-display text-xl leading-tight text-ink dark:text-parchment">
                                {feature.title}
                            </h3>
                            <p className="mt-1.5 text-xs leading-5 text-ink/55 dark:text-parchment/55">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>

                <p className="mt-10 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-parchment/50">
                    <span className="h-px w-8 bg-parchment/30" aria-hidden="true" />
                    Semua modul dalam satu portal · data rinci hanya untuk anggota
                </p>
            </WindowFrame>
        </section>
    );
}
