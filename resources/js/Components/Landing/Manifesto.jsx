import { useInView } from '@/lib/motion';

const words = [
    { text: 'Info', accent: false },
    { text: 'kelas', accent: false },
    { text: 'tidak', accent: true },
    { text: 'seharusnya', accent: true },
    { text: 'tenggelam', accent: false },
    { text: 'di', accent: false },
    { text: 'chat.', accent: false },
];

export default function Manifesto() {
    const [ref, inView] = useInView({ threshold: 0.35 });

    return (
        <section
            aria-labelledby="manifesto-heading"
            className="border-b border-ink/10 bg-parchment px-5 py-20 dark:border-white/10 dark:bg-ink-950 sm:px-8 lg:py-28"
        >
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.28fr_1fr] lg:gap-16">
                <div className="flex items-start gap-5 lg:flex-col lg:gap-7">
                    <p className="kicker text-ink/40 dark:text-parchment/40">Manifesto</p>
                    <span className="mt-1 hidden h-14 w-px bg-ink/15 dark:bg-parchment/15 lg:block" />
                    <p className="font-mono text-[0.58rem] uppercase leading-5 tracking-[0.18em] text-ink/35 dark:text-parchment/35">
                        Kelas STI
                        <br />
                        Semester 5
                    </p>
                </div>

                <div ref={ref} className={`manifesto ${inView ? 'is-visible' : ''}`}>
                    <h2
                        id="manifesto-heading"
                        className="max-w-4xl font-display text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.02] tracking-[-0.025em] text-ink dark:text-parchment"
                    >
                        {words.map((word, index) => (
                            <span
                                key={`${word.text}-${index}`}
                                className={`manifesto-word ${
                                    word.accent
                                        ? 'italic text-[#a55f24] dark:text-dusk'
                                        : ''
                                }`}
                                style={{ transitionDelay: `${index * 55}ms` }}
                            >
                                {word.text}
                            </span>
                        ))}
                    </h2>

                    <div className="mt-10 flex flex-col gap-6 border-t border-ink/10 pt-6 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
                        <p className="max-w-xl text-sm leading-7 text-ink/55 dark:text-parchment/55">
                            Satu portal menjaga pengumuman, jadwal, tugas, dan materi tetap di
                            tempatnya — supaya kamu bisa fokus pada kuliah, bukan mencari tautan.
                        </p>
                        <p className="shrink-0 font-mono text-[0.58rem] uppercase leading-6 tracking-[0.18em] text-ink/35 dark:text-parchment/35">
                            Satu portal.
                            <br />
                            Empat kebutuhan.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
