<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Course;
use App\Models\Material;
use App\Models\Schedule;
use App\Models\ScheduleException;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@kelas-sti.test'],
            [
                'name' => 'Ade Rizki Bima Saputra',
                'nim' => '20230001',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
                'phone' => '081234567890',
                'is_active' => true,
            ]
        );

        $members = collect([
            ['name' => 'Aulia Rahma', 'nim' => '20230002', 'email' => 'aulia@kelas-sti.test', 'phone' => '081234567891'],
            ['name' => 'Bagas Pratama', 'nim' => '20230003', 'email' => 'bagas@kelas-sti.test', 'phone' => '081234567892'],
            ['name' => 'Citra Lestari', 'nim' => '20230004', 'email' => 'citra@kelas-sti.test', 'phone' => '081234567893'],
            ['name' => 'Dimas Saputra', 'nim' => '20230005', 'email' => 'dimas@kelas-sti.test', 'phone' => null],
            ['name' => 'Eka Putri', 'nim' => '20230006', 'email' => 'eka@kelas-sti.test', 'phone' => '081234567895'],
            ['name' => 'Fajar Nugroho', 'nim' => '20230007', 'email' => 'fajar@kelas-sti.test', 'phone' => null],
        ])->map(fn (array $member) => User::updateOrCreate(
            ['email' => $member['email']],
            [
                ...$member,
                'password' => Hash::make('password'),
                'role' => User::ROLE_USER,
                'is_active' => true,
            ]
        ));

        $courses = collect([
            ['code' => 'STI501', 'name' => 'Pemrograman Web Lanjut', 'lecturer' => 'Dr. Rina Kusuma, M.Kom.', 'credits' => 3],
            ['code' => 'STI502', 'name' => 'Basis Data Lanjut', 'lecturer' => 'Budi Santoso, M.T.', 'credits' => 3],
            ['code' => 'STI503', 'name' => 'Rekayasa Perangkat Lunak', 'lecturer' => 'Siti Aminah, M.Kom.', 'credits' => 3],
            ['code' => 'STI504', 'name' => 'Jaringan Komputer', 'lecturer' => 'Hendra Wijaya, M.T.', 'credits' => 2],
            ['code' => 'STI505', 'name' => 'Kecerdasan Buatan', 'lecturer' => 'Dewi Kartika, M.Kom.', 'credits' => 3],
            ['code' => 'STI506', 'name' => 'Proyek Perangkat Lunak', 'lecturer' => 'Agus Setiawan, M.Kom.', 'credits' => 2],
        ])->mapWithKeys(fn (array $course) => [
            $course['code'] => Course::updateOrCreate(['code' => $course['code']], $course),
        ]);

        $schedules = [
            ['course' => 'STI501', 'day' => 'Senin', 'start_time' => '08:00', 'end_time' => '10:30', 'room' => 'Lab Komputer 1', 'note' => null],
            ['course' => 'STI502', 'day' => 'Senin', 'start_time' => '13:00', 'end_time' => '15:30', 'room' => 'Ruang 3.2', 'note' => null],
            ['course' => 'STI503', 'day' => 'Selasa', 'start_time' => '08:00', 'end_time' => '10:30', 'room' => 'Ruang 2.1', 'note' => null],
            ['course' => 'STI504', 'day' => 'Rabu', 'start_time' => '10:00', 'end_time' => '12:30', 'room' => 'Lab Jaringan', 'note' => null],
            ['course' => 'STI505', 'day' => 'Kamis', 'start_time' => '08:00', 'end_time' => '10:30', 'room' => 'Ruang 3.4', 'note' => null],
            ['course' => 'STI506', 'day' => 'Jumat', 'start_time' => '13:00', 'end_time' => '15:00', 'room' => 'Ruang Proyek', 'note' => 'Bawa laptop.'],
        ];

        foreach ($schedules as $schedule) {
            Schedule::updateOrCreate(
                [
                    'course_id' => $courses[$schedule['course']]->id,
                    'day' => $schedule['day'],
                    'start_time' => $schedule['start_time'],
                ],
                [
                    'end_time' => $schedule['end_time'],
                    'room' => $schedule['room'],
                    'note' => $schedule['note'],
                ]
            );
        }

        $announcements = [
            [
                'title' => 'Selamat datang di Web Kelas STI Semester 5',
                'body' => 'Mulai semester ini, seluruh informasi akademik dan administrasi kelas akan dipusatkan di web ini. Silakan lengkapi profil dan cek pengumuman secara berkala.',
                'category' => 'umum',
                'is_pinned' => true,
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Persiapan UTS minggu depan',
                'body' => 'UTS dimulai Senin depan. Pastikan tidak ada tanggungan tugas dan cek jadwal ujian yang akan diumumkan melalui menu pengumuman.',
                'category' => 'akademik',
                'is_pinned' => true,
                'published_at' => now()->subDay(),
            ],
            [
                'title' => 'Kerja bakti dan foto bersama',
                'body' => 'Kegiatan kelas akan dilaksanakan Sabtu pagi di depan gedung fakultas. Diharapkan seluruh anggota hadir.',
                'category' => 'kegiatan',
                'is_pinned' => false,
                'published_at' => now()->subHours(6),
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::updateOrCreate(
                ['title' => $announcement['title']],
                [...$announcement, 'user_id' => $admin->id]
            );
        }

        $tasks = [
            ['course' => 'STI501', 'title' => 'Membuat CRUD Laravel', 'description' => 'Buat aplikasi CRUD sederhana menggunakan Laravel dan Inertia. Kumpulkan tautan repository.', 'due' => now()->addDays(2), 'link' => 'https://classroom.google.com/'],
            ['course' => 'STI502', 'title' => 'Normalisasi Database', 'description' => 'Normalisasi skema database studi kasus hingga 3NF.', 'due' => now()->addDays(4), 'link' => null],
            ['course' => 'STI503', 'title' => 'Dokumen SRS', 'description' => 'Susun Software Requirement Specification untuk proyek kelompok.', 'due' => now()->addDays(6), 'link' => null],
            ['course' => 'STI504', 'title' => 'Laporan Praktikum Subnetting', 'description' => 'Laporkan hasil praktikum subnetting beserta analisis.', 'due' => now()->addDay(), 'link' => null],
            ['course' => 'STI505', 'title' => 'Implementasi Algoritma A*', 'description' => 'Implementasikan algoritma A* untuk kasus pencarian jalur.', 'due' => now()->subDay(), 'link' => null],
            ['course' => 'STI506', 'title' => 'Proposal Proyek', 'description' => 'Kumpulkan proposal proyek perangkat lunak kelompok.', 'due' => now()->addDays(10), 'link' => null],
        ];

        foreach ($tasks as $task) {
            Task::updateOrCreate(
                [
                    'course_id' => $courses[$task['course']]->id,
                    'title' => $task['title'],
                ],
                [
                    'user_id' => $admin->id,
                    'description' => $task['description'],
                    'due_at' => $task['due'],
                    'link' => $task['link'],
                ]
            );
        }

        $completedTask = Task::query()->where('title', 'Membuat CRUD Laravel')->first();
        if ($completedTask) {
            $completedTask->users()->syncWithoutDetaching([
                $members[0]->id => ['completed_at' => now()->subDay()],
            ]);
        }

        $materials = [
            ['course' => 'STI501', 'title' => 'Modul 1 — Routing dan Controller', 'meeting_no' => 1, 'url' => 'https://laravel.com/docs/routing'],
            ['course' => 'STI501', 'title' => 'Modul 2 — Inertia dan React', 'meeting_no' => 2, 'url' => 'https://inertiajs.com/'],
            ['course' => 'STI502', 'title' => 'Slide Normalisasi Database', 'meeting_no' => 3, 'url' => 'https://drive.google.com/'],
            ['course' => 'STI503', 'title' => 'Template Dokumen SRS', 'meeting_no' => 2, 'url' => 'https://drive.google.com/'],
            ['course' => 'STI505', 'title' => 'Slide Pencarian Heuristik', 'meeting_no' => 4, 'url' => 'https://drive.google.com/'],
        ];

        foreach ($materials as $material) {
            Material::updateOrCreate(
                [
                    'course_id' => $courses[$material['course']]->id,
                    'title' => $material['title'],
                ],
                [
                    'user_id' => $admin->id,
                    'meeting_no' => $material['meeting_no'],
                    'url' => $material['url'],
                ]
            );
        }

        $mondaySchedule = Schedule::query()
            ->where('course_id', $courses['STI501']->id)
            ->where('day', 'Senin')
            ->first();

        if ($mondaySchedule) {
            $nextMonday = now()->next('Monday')->toDateString();

            ScheduleException::updateOrCreate(
                ['schedule_id' => $mondaySchedule->id, 'date' => $nextMonday],
                [
                    'type' => ScheduleException::TYPE_CHANGED,
                    'note' => 'Kelas diundur dan dipindahkan ke Lab Komputer 2.',
                    'new_start_time' => '10:00',
                    'new_end_time' => '12:30',
                    'new_room' => 'Lab Komputer 2',
                ]
            );
        }
    }
}
