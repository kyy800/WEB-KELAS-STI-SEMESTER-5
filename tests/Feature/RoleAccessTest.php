<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Course;
use App\Models\Material;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_every_admin_page(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->create();
        $course = Course::create([
            'code' => 'STI501',
            'name' => 'Pemrograman Web Lanjut',
            'lecturer' => 'Dr. Rina',
            'credits' => 3,
        ]);
        $schedule = Schedule::create([
            'course_id' => $course->id,
            'day' => 'Senin',
            'start_time' => '08:00',
            'end_time' => '10:30',
            'room' => 'Lab 1',
        ]);
        $announcement = Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Pengumuman Uji',
            'body' => 'Isi pengumuman uji.',
            'category' => 'umum',
            'is_pinned' => false,
            'published_at' => now(),
        ]);
        $task = Task::create([
            'course_id' => $course->id,
            'user_id' => $admin->id,
            'title' => 'Tugas Uji',
            'due_at' => now()->addDays(3),
        ]);
        $material = Material::create([
            'course_id' => $course->id,
            'user_id' => $admin->id,
            'title' => 'Materi Uji',
            'url' => 'https://example.com/materi',
        ]);

        $pages = [
            route('admin.dashboard'),
            route('admin.announcements.index'),
            route('admin.announcements.create'),
            route('admin.announcements.edit', $announcement),
            route('admin.courses.index'),
            route('admin.schedules.index'),
            route('admin.schedules.create'),
            route('admin.schedules.edit', $schedule),
            route('admin.schedule-exceptions.index'),
            route('admin.tasks.index'),
            route('admin.tasks.create'),
            route('admin.tasks.edit', $task),
            route('admin.materials.index'),
            route('admin.materials.create'),
            route('admin.materials.edit', $material),
            route('admin.users.index'),
            route('admin.users.create'),
            route('admin.users.edit', $member),
            route('admin.users.import'),
        ];

        foreach ($pages as $url) {
            $this->actingAs($admin)->get($url)->assertOk();
        }
    }

    public function test_member_can_access_every_user_page(): void
    {
        $member = User::factory()->create();

        $pages = [
            route('dashboard'),
            route('announcements.index'),
            route('schedules.index'),
            route('tasks.index'),
            route('materials.index'),
            route('members.index'),
            route('profile.edit'),
        ];

        foreach ($pages as $url) {
            $this->actingAs($member)->get($url)->assertOk();
        }
    }

    public function test_admin_can_also_access_user_pages(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get(route('dashboard'))->assertOk();
        $this->actingAs($admin)->get(route('announcements.index'))->assertOk();
    }

    public function test_member_is_forbidden_from_admin_area(): void
    {
        $member = User::factory()->create();

        $this->actingAs($member)->get('/admin')->assertForbidden();
        $this->actingAs($member)->get('/admin/pengumuman')->assertForbidden();
        $this->actingAs($member)->get('/admin/pengguna')->assertForbidden();
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('dashboard'))->assertRedirect('/login');
        $this->get('/admin')->assertRedirect('/login');
    }

    public function test_inactive_user_is_logged_out(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $user->update(['is_active' => false]);

        $this->get(route('dashboard'))->assertRedirect('/login');
        $this->assertGuest();
    }
}
