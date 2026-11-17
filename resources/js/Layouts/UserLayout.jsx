import AppShell from '@/Layouts/AppShell';
import { usePage } from '@inertiajs/react';

export default function UserLayout({ children }) {
    const user = usePage().props.auth.user;

    const mainItems = [
        { label: 'Dashboard', routeName: 'dashboard', patterns: ['dashboard'], icon: 'dashboard' },
        { label: 'Pengumuman', routeName: 'announcements.index', patterns: ['announcements.*'], icon: 'megaphone' },
        { label: 'Jadwal', routeName: 'schedules.index', patterns: ['schedules.*'], icon: 'calendar' },
        { label: 'Tugas', routeName: 'tasks.index', patterns: ['tasks.*'], icon: 'clipboard' },
        { label: 'Materi', routeName: 'materials.index', patterns: ['materials.*'], icon: 'book' },
        { label: 'Anggota', routeName: 'members.index', patterns: ['members.*'], icon: 'users' },
        { label: 'Profil', routeName: 'profile.edit', patterns: ['profile.*'], icon: 'user' },
    ];

    const sections = [
        { title: null, items: mainItems },
        ...(user.role === 'admin'
            ? [
                  {
                      title: 'Pengelolaan',
                      items: [
                          {
                              label: 'Panel Admin',
                              routeName: 'admin.dashboard',
                              patterns: ['admin.*'],
                              icon: 'shield',
                          },
                      ],
                  },
              ]
            : []),
    ];

    return (
        <AppShell
            variant="user"
            sections={sections}
            bottomNav={mainItems.filter((item) =>
                ['dashboard', 'announcements.index', 'tasks.index', 'materials.index', 'profile.edit'].includes(
                    item.routeName
                )
            )}
        >
            {children}
        </AppShell>
    );
}
