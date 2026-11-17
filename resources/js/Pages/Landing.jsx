import ClosingWindow from '@/Components/Landing/ClosingWindow';
import FaqSection from '@/Components/Landing/FaqSection';
import FeatureWindow from '@/Components/Landing/FeatureWindow';
import HeroWindow from '@/Components/Landing/HeroWindow';
import KabarFeed from '@/Components/Landing/KabarFeed';
import LandingFooter from '@/Components/Landing/LandingFooter';
import LandingHeader from '@/Components/Landing/LandingHeader';
import Manifesto from '@/Components/Landing/Manifesto';
import StatsStrip from '@/Components/Landing/StatsStrip';
import Walkthrough from '@/Components/Landing/Walkthrough';
import { Head } from '@inertiajs/react';

export default function Landing({ stats = {} }) {
    return (
        <div className="landing-page min-h-screen overflow-x-clip bg-parchment font-sans text-ink selection:bg-dusk/30 dark:bg-ink-950 dark:text-parchment">
            <Head title="Portal Kelas STI Semester 5">
                <meta
                    name="description"
                    content="Portal informasi dan administrasi Kelas STI Semester 5: pengumuman, jadwal kuliah, tugas, materi, dan data anggota dalam satu tempat."
                />
            </Head>

            <a
                href="#konten"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-parchment focus:shadow-lg focus:outline-none dark:focus:bg-parchment dark:focus:text-ink"
            >
                Lewati ke konten
            </a>

            <LandingHeader />

            <main id="konten">
                <HeroWindow />
                <StatsStrip stats={stats} />
                <Manifesto />
                <Walkthrough />
                <FeatureWindow />
                <KabarFeed />
                <FaqSection />
                <ClosingWindow />
            </main>

            <LandingFooter />
        </div>
    );
}
