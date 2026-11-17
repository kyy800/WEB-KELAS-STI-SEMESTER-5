import Icon from '@/Components/Icon';
import { Link } from '@inertiajs/react';

const faqs = [
    {
        question: 'Siapa yang dapat mengakses portal ini?',
        answer:
            'Portal ini khusus untuk anggota Kelas STI Semester 5. Seluruh konten hanya dapat dilihat setelah masuk menggunakan akun yang dibuat oleh admin kelas.',
    },
    {
        question: 'Bagaimana cara mendapatkan akun?',
        answer:
            'Akun dibuat oleh admin atau pengurus kelas. Registrasi mandiri dinonaktifkan, jadi hubungi pengurus jika kamu belum memiliki akses.',
    },
    {
        question: 'Saya lupa password, apa yang harus dilakukan?',
        answer:
            'Gunakan tautan “Lupa password?” di halaman masuk untuk mengatur ulang password melalui email. Jika masih terkendala, hubungi admin kelas.',
    },
    {
        question: 'Apakah halaman publik ini menampilkan data asli?',
        answer:
            'Halaman ini hanya menampilkan angka agregat seperti jumlah anggota, mata kuliah, materi, dan tugas aktif. Kartu contoh, kabar, serta data rinci di dalam portal hanya terlihat setelah masuk.',
    },
    {
        question: 'Apakah portal bisa dibuka dari ponsel?',
        answer:
            'Bisa. Tampilan portal dirancang responsif sehingga nyaman digunakan di ponsel, tablet, maupun desktop.',
    },
];

export default function FaqSection() {
    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className="border-t border-ink/10 bg-parchment px-5 py-20 dark:border-white/10 dark:bg-ink-950 sm:px-8 lg:py-28"
        >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <p className="kicker text-dusk">FAQ</p>
                    <h2
                        id="faq-heading"
                        className="mt-3 max-w-sm font-display text-4xl leading-[1.02] tracking-[-0.02em] text-ink dark:text-parchment sm:text-5xl"
                    >
                        Pertanyaan yang sering muncul.
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-ink/55 dark:text-parchment/55">
                        Kalau jawabannya belum ada di sini, hubungi pengurus kelas. Mereka yang
                        mengatur akses dan akun anggota.
                    </p>

                    <div className="mt-8 space-y-3 rounded-2xl border border-ink/10 bg-parchment-50 p-5 dark:border-white/10 dark:bg-ink-900">
                        <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink/35 dark:text-parchment/35">
                            Akses cepat
                        </p>
                        <Link
                            href={route('login')}
                            className="flex items-center justify-between gap-3 text-sm font-semibold text-ink transition hover:text-dusk dark:text-parchment dark:hover:text-dusk"
                        >
                            Masuk ke portal
                            <Icon name="arrowRight" className="h-4 w-4" />
                        </Link>
                        <Link
                            href={route('password.request')}
                            className="flex items-center justify-between gap-3 text-sm font-semibold text-ink/60 transition hover:text-dusk dark:text-parchment/60 dark:hover:text-dusk"
                        >
                            Lupa password
                            <Icon name="arrowRight" className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq) => (
                        <details
                            key={faq.question}
                            className="group rounded-2xl border border-ink/10 bg-parchment-50 transition open:border-dusk/50 open:bg-parchment-50 dark:border-white/10 dark:bg-ink-900 dark:open:border-dusk/40"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden sm:px-6 sm:py-5">
                                <span className="text-sm font-semibold text-ink dark:text-parchment sm:text-base">
                                    {faq.question}
                                </span>
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/10 text-ink/50 transition group-open:rotate-45 group-open:border-dusk/50 group-open:text-dusk dark:border-white/10 dark:text-parchment/50">
                                    <Icon name="plus" className="h-3.5 w-3.5" />
                                </span>
                            </summary>
                            <div className="px-5 pb-5 sm:px-6">
                                <p className="max-w-2xl border-t border-ink/10 pt-4 text-sm leading-6 text-ink/55 dark:border-white/10 dark:text-parchment/55">
                                    {faq.answer}
                                </p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
