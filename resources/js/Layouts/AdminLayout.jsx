import AppShell from '@/Layouts/AppShell';

export default function AdminLayout({ children }) {
    const sections = [
        {
            title: 'Utama',
            items: [
                { label: 'Dashboard', routeName: 'admin.dashboard', patterns: ['admin.dashboard'], icon: 'dashboard' },
                { label: 'Lihat sebagai anggota', routeName: 'dashboard', patterns: ['dashboard'], icon: 'user' },
            ],
        },
        {
            title: 'Kelola Kelas',
            items: [
                {
                    label: 'Pengumuman',
                    routeName: 'admin.announcements.index',
                    patterns: ['admin.announcements.*'],
                    icon: 'megaphone',
                },
                {
                    label: 'Jadwal',
                    routeName: 'admin.schedules.index',
                    patterns: ['admin.schedules.*'],
                    icon: 'calendar',
                },
                {
                    label: 'Perubahan Jadwal',
                    routeName: 'admin.schedule-exceptions.index',
                    patterns: ['admin.schedule-exceptions.*'],
                    icon: 'clock',
                },
                {
                    label: 'Mata Kuliah',
                    routeName: 'admin.courses.index',
                    patterns: ['admin.courses.*'],
                    icon: 'book',
                },
                {
                    label: 'Tugas',
                    routeName: 'admin.tasks.index',
                    patterns: ['admin.tasks.*'],
                    icon: 'clipboard',
                },
                {
                    label: 'Materi',
                    routeName: 'admin.materials.index',
                    patterns: ['admin.materials.*'],
                    icon: 'file',
                },
                {
                    label: 'Pengguna',
                    routeName: 'admin.users.index',
                    patterns: ['admin.users.*'],
                    icon: 'users',
                },
            ],
        },
        {
            title: 'Akun',
            items: [
                {
                    label: 'Profil Saya',
                    routeName: 'profile.edit',
                    patterns: ['profile.*'],
                    icon: 'settings',
                },
            ],
        },
    ];

    const bottomNav = [
        { label: 'Admin', routeName: 'admin.dashboard', patterns: ['admin.dashboard'], icon: 'dashboard' },
        {
            label: 'Pengumuman',
            routeName: 'admin.announcements.index',
            patterns: ['admin.announcements.*'],
            icon: 'megaphone',
        },
        { label: 'Tugas', routeName: 'admin.tasks.index', patterns: ['admin.tasks.*'], icon: 'clipboard' },
        { label: 'Materi', routeName: 'admin.materials.index', patterns: ['admin.materials.*'], icon: 'file' },
        { label: 'Pengguna', routeName: 'admin.users.index', patterns: ['admin.users.*'], icon: 'users' },
    ];

    return (
        <AppShell variant="admin" sections={sections} bottomNav={bottomNav}>
            {children}
        </AppShell>
    );
}
