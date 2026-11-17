import '../css/app.css';

import AdminLayout from '@/Layouts/AdminLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import UserLayout from '@/Layouts/UserLayout';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Web Kelas STI';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: async (name) => {
        const module = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        );

        const page = module.default;

        if (!page.layout) {
            if (name === 'Landing') {
                page.layout = (child) => child;
            } else if (name.startsWith('Auth/')) {
                page.layout = (child) => <GuestLayout>{child}</GuestLayout>;
            } else if (name.startsWith('Admin/')) {
                page.layout = (child) => <AdminLayout>{child}</AdminLayout>;
            } else {
                page.layout = (child) => <UserLayout>{child}</UserLayout>;
            }
        }

        return module;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4f46e5',
    },
});
