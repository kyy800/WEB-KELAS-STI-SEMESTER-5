import Icon from '@/Components/Icon';
import { useInView } from '@/lib/motion';
import { Link } from '@inertiajs/react';
import WindowFrame from './WindowFrame';

export default function ClosingWindow() {
    const [ref, inView] = useInView({ threshold: 0.2 });

    return (
        <section className="bg-parchment px-5 py-16 dark:bg-ink-950 sm:px-8 lg:py-24">
            <div
                ref={ref}
                className={`mx-auto max-w-6xl transition-all duration-1000 ease-out motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
                    inView ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'
                }`}
            >
                <WindowFrame
                    tone="night"
                    decorative
                    className="rounded-[2rem]"
                    innerClassName="relative flex min-h-[540px] flex-col items-center justify-center px-6 py-20 text-center sm:px-12"
                    overlayClassName="bg-gradient-to-b from-ink/30 via-ink/50 to-ink/80"
                >
                    <div className="landing-stars pointer-events-none absolute inset-0 opacity-60" />
                    <div
                        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dawn/15 blur-3xl"
                        aria-hidden="true"
                    />

                    <div className="relative max-w-3xl">
                        <p className="kicker text-parchment/55">Jendela malam · 21.30</p>
                        <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-[-0.02em] text-parchment sm:text-5xl lg:text-6xl">
                            Kapan pun kamu siap,
                            <br className="hidden sm:block" /> kelas tetap di sini.
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-parchment/65">
                            Masuk untuk melihat kabar terbaru, jadwal besok, dan tugas yang
                            menunggu. Semuanya sudah tersusun, tinggal dibuka.
                        </p>

                        <div className="mt-8 flex justify-center">
                            <Link
                                href={route('login')}
                                className="group inline-flex items-center gap-2 rounded-full bg-parchment px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-ink/30 transition hover:-translate-y-0.5 hover:bg-parchment-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parchment"
                            >
                                Masuk ke portal
                                <Icon
                                    name="arrowRight"
                                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                />
                            </Link>
                        </div>

                        <p className="mt-5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-parchment/40">
                            Akun dibuat admin kelas · registrasi mandiri nonaktif
                        </p>
                    </div>
                </WindowFrame>
            </div>
        </section>
    );
}
