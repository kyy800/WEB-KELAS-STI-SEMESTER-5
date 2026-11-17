import { useState } from 'react';

export const landingPhotos = {
    dawn: {
        id: 'photo-1500534314209-a25ddb2bd429',
        alt: 'Lapisan pegunungan biru saat fajar',
    },
    noon: {
        id: 'photo-1469474968028-56623f02e42e',
        alt: 'Batuan besar di bawah cahaya keemasan',
    },
    dusk: {
        id: 'photo-1506905925346-21bda4d32df4',
        alt: 'Lautan awan saat senja',
    },
    night: {
        id: 'photo-1519681393784-d120267933ba',
        alt: 'Langit malam berbintang di atas pegunungan',
    },
};

const tones = {
    dawn: {
        sky: 'from-[#213456] via-[#4b6595] to-[#d8a98a]',
        sun: '#f4d7b0',
        ridges: ['#101c33', '#1b2b49', '#2b4066', '#3c567f'],
    },
    noon: {
        sky: 'from-[#3d2f22] via-[#9b6b3f] to-[#e4b878]',
        sun: '#ffe2b0',
        ridges: ['#241a12', '#3a2a1c', '#5b422a', '#7b5a38'],
    },
    dusk: {
        sky: 'from-[#1c2440] via-[#5a4a6b] to-[#e3a06d]',
        sun: '#ffd3a3',
        ridges: ['#121729', '#202945', '#323c5c', '#4b5577'],
    },
    night: {
        sky: 'from-[#050914] via-[#0b1630] to-[#1d2c4d]',
        sun: '#dbe7ff',
        ridges: ['#04070f', '#080f1f', '#0f1a30', '#182642'],
    },
};

const ridgePaths = [
    'M0 380 L140 320 L260 350 L390 270 L520 330 L680 250 L820 310 L960 240 L1120 300 L1200 270 L1200 600 L0 600 Z',
    'M0 440 L160 390 L320 430 L470 360 L620 420 L780 350 L940 410 L1080 360 L1200 400 L1200 600 L0 600 Z',
    'M0 500 L200 455 L360 490 L540 430 L720 485 L900 440 L1060 480 L1200 450 L1200 600 L0 600 Z',
    'M0 545 L180 520 L380 550 L560 520 L760 552 L980 525 L1200 545 L1200 600 L0 600 Z',
];

export function unsplashUrl(id, width) {
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export default function WindowFrame({
    tone = 'dawn',
    className = '',
    innerClassName = '',
    overlayClassName = '',
    children,
    priority = false,
    decorative = false,
    imageStyle,
}) {
    const photo = landingPhotos[tone] ?? landingPhotos.dawn;
    const palette = tones[tone] ?? tones.dawn;
    const [status, setStatus] = useState('loading');

    return (
        <div
            className={`landing-grain relative isolate overflow-hidden rounded-[1.75rem] border border-ink/10 bg-ink-900 shadow-[0_35px_90px_-45px_rgba(11,16,32,0.85)] dark:border-white/10 ${className}`}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-b ${palette.sky}`}
                aria-hidden="true"
            />

            <div
                className="absolute right-[13%] top-[14%] h-16 w-16 rounded-full opacity-80 sm:h-24 sm:w-24"
                style={{
                    backgroundColor: palette.sun,
                    boxShadow: `0 0 70px 28px ${palette.sun}22`,
                }}
                aria-hidden="true"
            />

            <svg
                viewBox="0 0 1200 600"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
            >
                {palette.ridges.map((color, index) => (
                    <path
                        key={color}
                        d={ridgePaths[index]}
                        fill={color}
                        opacity={index === 3 ? 1 : 0.92}
                    />
                ))}
            </svg>

            <img
                src={unsplashUrl(photo.id, 1600)}
                srcSet={[800, 1200, 1600, 2000]
                    .map((width) => `${unsplashUrl(photo.id, width)} ${width}w`)
                    .join(', ')}
                sizes="(min-width: 1024px) 720px, 100vw"
                alt={decorative ? '' : photo.alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => setStatus('loaded')}
                onError={() => setStatus('error')}
                style={imageStyle}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    status === 'loaded' ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {overlayClassName ? (
                <div
                    className={`pointer-events-none absolute inset-0 ${overlayClassName}`}
                    aria-hidden="true"
                />
            ) : null}

            <div className={`relative z-10 ${innerClassName}`}>{children}</div>
        </div>
    );
}
