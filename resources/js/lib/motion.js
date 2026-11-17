import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Track the visitor's reduced-motion preference and react to changes.
 */
export function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = (event) => setPrefersReducedMotion(event.matches);

        media.addEventListener('change', sync);

        return () => media.removeEventListener('change', sync);
    }, []);

    return prefersReducedMotion;
}

/**
 * Observe an element and report when it enters the viewport.
 */
export function useInView({ threshold = 0.18, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;

        if (!node) {
            return undefined;
        }

        if (typeof IntersectionObserver === 'undefined') {
            setInView(true);

            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);

                    if (once) {
                        observer.disconnect();
                    }
                } else if (!once) {
                    setInView(false);
                }
            },
            { threshold, rootMargin },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [once, rootMargin, threshold]);

    return [ref, inView];
}

/**
 * Animate a number from zero to its target once it is in view.
 */
export function useCountUp(target, active, { duration = 1400 } = {}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [value, setValue] = useState(0);

    useEffect(() => {
        const destination = Number(target) || 0;

        if (!active) {
            return undefined;
        }

        if (prefersReducedMotion) {
            setValue(destination);

            return undefined;
        }

        let frame = 0;
        const startedAt = performance.now();

        const tick = (now) => {
            const progress = Math.min(1, (now - startedAt) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);

            setValue(Math.round(destination * eased));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [active, duration, prefersReducedMotion, target]);

    return value;
}

/**
 * True once the page has scrolled past a small offset.
 */
export function useScrolledPast(offset = 24) {
    const [scrolled, setScrolled] = useState(
        () => typeof window !== 'undefined' && window.scrollY > offset,
    );

    useEffect(() => {
        let frame = 0;

        const update = () => {
            frame = 0;
            setScrolled(window.scrollY > offset);
        };

        const request = () => {
            if (!frame) {
                frame = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', request, { passive: true });

        return () => {
            window.removeEventListener('scroll', request);

            if (frame) {
                cancelAnimationFrame(frame);
            }
        };
    }, [offset]);

    return scrolled;
}

/**
 * Progress (0 to 1) through a tall section with a sticky child.
 */
export function usePinnedProgress(ref) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const node = ref.current;

        if (!node) {
            return undefined;
        }

        let frame = 0;

        const update = () => {
            frame = 0;
            const rect = node.getBoundingClientRect();
            const distance = Math.max(1, rect.height - window.innerHeight);
            const next = Math.min(1, Math.max(0, -rect.top / distance));

            setProgress(next);
        };

        const request = () => {
            if (!frame) {
                frame = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', request, { passive: true });
        window.addEventListener('resize', request);

        return () => {
            window.removeEventListener('scroll', request);
            window.removeEventListener('resize', request);

            if (frame) {
                cancelAnimationFrame(frame);
            }
        };
    }, [ref]);

    return progress;
}

/**
 * Normalised pointer offset (-1 to 1) over an element, for gentle parallax.
 */
export function usePointerParallax(ref, { disabled = false } = {}) {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const latest = useRef({ x: 0, y: 0 });
    const frame = useRef(0);

    useEffect(() => {
        const node = ref.current;

        if (!node || disabled) {
            return undefined;
        }

        if (!window.matchMedia('(pointer: fine)').matches) {
            return undefined;
        }

        const handleMove = (event) => {
            const rect = node.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

            latest.current = {
                x: Math.max(-1, Math.min(1, x)),
                y: Math.max(-1, Math.min(1, y)),
            };

            if (!frame.current) {
                frame.current = requestAnimationFrame(() => {
                    frame.current = 0;
                    setOffset(latest.current);
                });
            }
        };

        const handleLeave = () => {
            latest.current = { x: 0, y: 0 };
            setOffset({ x: 0, y: 0 });
        };

        node.addEventListener('pointermove', handleMove);
        node.addEventListener('pointerleave', handleLeave);

        return () => {
            node.removeEventListener('pointermove', handleMove);
            node.removeEventListener('pointerleave', handleLeave);

            if (frame.current) {
                cancelAnimationFrame(frame.current);
            }
        };
    }, [disabled, ref]);

    return offset;
}

/**
 * Rotate through indexes at an interval; pause it when asked.
 */
export function useRotatingIndex(count, { interval = 5600, paused = false } = {}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (paused || count < 2) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % count);
        }, interval);

        return () => window.clearInterval(timer);
    }, [count, interval, paused]);

    const select = useCallback(
        (next) => {
            setIndex(((next % count) + count) % count);
        },
        [count],
    );

    return [index, select];
}

/**
 * Lock page scrolling while a full-screen navigation sheet is open.
 */
export function useBodyScrollLock(locked) {
    useEffect(() => {
        if (!locked) {
            return undefined;
        }

        const previous = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previous;
        };
    }, [locked]);
}
