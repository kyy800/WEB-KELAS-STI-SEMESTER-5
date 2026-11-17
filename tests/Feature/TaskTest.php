<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(): Course
    {
        return Course::create([
            'code' => 'STI501',
            'name' => 'Pemrograman Web Lanjut',
            'lecturer' => 'Dr. Rina',
            'credits' => 3,
        ]);
    }

    public function test_admin_can_create_task(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();

        $response = $this->actingAs($admin)->post(route('admin.tasks.store'), [
            'course_id' => $course->id,
            'title' => 'Membuat CRUD Laravel',
            'description' => 'Kumpulkan tautan repository.',
            'due_at' => now()->addDays(3)->toDateTimeString(),
            'link' => 'https://classroom.google.com/',
        ]);

        $response->assertRedirect(route('admin.tasks.index'));
        $this->assertDatabaseHas('tasks', [
            'user_id' => $admin->id,
            'course_id' => $course->id,
            'title' => 'Membuat CRUD Laravel',
        ]);
    }

    public function test_member_cannot_create_task(): void
    {
        $member = User::factory()->create();
        $course = $this->makeCourse();

        $this->actingAs($member)
            ->post(route('admin.tasks.store'), [
                'course_id' => $course->id,
                'title' => 'Tugas tidak sah',
                'due_at' => now()->addDay()->toDateTimeString(),
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_member_can_toggle_their_own_completion(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->create();
        $course = $this->makeCourse();
        $task = Task::create([
            'course_id' => $course->id,
            'user_id' => $admin->id,
            'title' => 'Membuat CRUD Laravel',
            'due_at' => now()->addDays(2),
        ]);

        $this->actingAs($member)
            ->from(route('tasks.index'))
            ->post(route('tasks.toggle', $task))
            ->assertRedirect(route('tasks.index'));

        $pivot = $task->users()->whereKey($member->id)->first();
        $this->assertNotNull($pivot);
        $this->assertNotNull($pivot->pivot->completed_at);

        $this->actingAs($member)
            ->from(route('tasks.index'))
            ->post(route('tasks.toggle', $task))
            ->assertRedirect(route('tasks.index'));

        $this->assertDatabaseMissing('task_user', [
            'task_id' => $task->id,
            'user_id' => $member->id,
        ]);
    }

    public function test_completion_is_personal_to_each_member(): void
    {
        $admin = User::factory()->admin()->create();
        $memberA = User::factory()->create();
        $memberB = User::factory()->create();
        $course = $this->makeCourse();
        $task = Task::create([
            'course_id' => $course->id,
            'user_id' => $admin->id,
            'title' => 'Tugas kelompok',
            'due_at' => now()->addDays(2),
        ]);

        $this->actingAs($memberA)->post(route('tasks.toggle', $task));

        $this->assertTrue($task->isCompletedBy($memberA->refresh()));
        $this->assertFalse($task->isCompletedBy($memberB->refresh()));
    }

    public function test_member_can_view_task_detail(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->create();
        $course = $this->makeCourse();
        $task = Task::create([
            'course_id' => $course->id,
            'user_id' => $admin->id,
            'title' => 'Membuat CRUD Laravel',
            'description' => 'Detail tugas.',
            'due_at' => now()->addDays(2),
        ]);

        $this->actingAs($member)
            ->get(route('tasks.show', $task))
            ->assertOk();
    }
}
