import Icon from '@/Components/Icon';
import {
    usePointerParallax,
    usePrefersReducedMotion,
    useRotatingIndex,
} from '@/lib/motion';
import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import HeroPreviewCard, { heroScenarios } from './PortalPreviews';
import WindowFrame from './WindowFrame';

export default function HeroWindow() {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [paused, setPaused] = useState(false);
    const [activeIndex, selectScenario] = useRotatingIndex(heroScenarios.length, {
        interval: 5600,
        paused: paused || prefersReducedMotion,
    });
    const windowRef = useRef(null);
    const parallax = usePointerParallax(windowRef, { disabled: prefersReducedMotion });

    return (
        <section
            id="beranda"
            className="relative overflow-x-clip pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-28 lg:pt-36"
        >
            <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
                <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-dawn/15 blur-3xl" />
                <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-dusk/15 blur-3xl" />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
                <div className="max-w-2xl">
                    <p className="kicker flex items-center gap-2.5 text-ink/55 dark:text-parchment/55">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-dusk opacity-75 motion-reduce:animate-none" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-dusk" />
                        </span>
                        Portal internal · Kelas STI Semester 5
                    </p>

                    <h1 className="mt-6 font-display text-[clamp(2.9rem,6vw,4.6rem)] leading-[0.95] tracking-[-0.03em] text-ink dark:text-parchment">
                        <span className="hero-mask">
                            <span>Satu jendela</span>
                        </span>
                        <span className="hero-mask">
                            <span className="italic text-ink/85 dark:text-parchment/85">
                                untuk seluruh kelas.
                            </span>
                        </span>
                    </h1>

                    <p className="mt-6 max-w-lg text-sm leading-7 text-ink/60 dark:text-parchment/60 sm:text-base">
                        Pengumuman, jadwal, tugas, dan materi kuliah dalam satu tempat yang tenang.
                        Tidak perlu lagi menyusuri chat grup untuk mencari informasi penting.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href={route('login')}
                            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-parchment shadow-lg shadow-ink/15 transition hover:-translate-y-0.5 hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk dark:bg-parchment dark:text-ink dark:hover:bg-parchment-200"
                        >
                            Masuk ke portal
                            <Icon
                                name="arrowRight"
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                            />
                        </Link>
                        <a
                            href="#alur"
                            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm font-semibold text-ink/75 transition hover:border-ink/40 hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk dark:border-parchment/25 dark:text-parchment/75 dark:hover:border-parchment/45 dark:hover:bg-parchment/10 dark:hover:text-parchment"
                        >
                            Lihat alurnya
                        </a>
                    </div>

                    <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink/40 dark:text-parchment/40">
                        Akun dibuat admin · Registrasi mandiri nonaktif
                    </p>
                </div>

                <div ref={windowRef} className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
                    <div className="window-open">
                        <WindowFrame
                            tone="dawn"
                            priority
                            className="aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]"
                            innerClassName="h-full"
                            imageStyle={{
                                transform: `translate3d(${parallax.x * -12}px, ${parallax.y * -10}px, 0) scale(1.06)`,
                            }}
                        >
                            <div className="flex h-full flex-col justify-between p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="rounded-full border border-white/25 bg-ink/25 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.22em] text-white/85 backdrop-blur-md">
                                        Jendela pagi
                                    </span>
                                    <span className="hidden rounded-full border border-white/20 bg-ink/20 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md sm:inline-flex">
                                        Kelas STI · 06.40
                                    </span>
                                </div>

                                <div
                                    className="mt-6"
                                    onMouseEnter={() => setPaused(true)}
                                    onMouseLeave={() => setPaused(false)}
                                    onFocusCapture={() => setPaused(true)}
                                    onBlurCapture={() => setPaused(false)}
                                >
                                    <HeroPreviewCard
                                        activeIndex={activeIndex}
                                        onSelect={selectScenario}
                                    />
                                </div>
                            </div>
                        </WindowFrame>
                    </div>

                    <div className="float-slow absolute -left-4 top-[15%] hidden w-[172px] rounded-2xl border border-white/40 bg-parchment-50/95 p-3.5 text-ink shadow-xl shadow-ink/25 backdrop-blur sm:block">
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink/45">
                                Progres tugas
                            </p>
                            <Icon name="checkCircle" className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <p className="mt-2 font-display text-2xl leading-none">
                            12 <span className="text-sm text-ink/40">/ 14</span>
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                            <div className="h-full w-[86%] rounded-full bg-ink" />
                        </div>
                        <p className="mt-2 text-[9px] text-ink/45">Selesai minggu ini</p>
                    </div>

                    <p className="mt-4 text-right font-mono text-[8px] uppercase tracking-[0.18em] text-ink/35 dark:text-parchment/35">
                        Ilustrasi tampilan portal
                    </p>
                </div>
            </div>
        </section>
    );
}
