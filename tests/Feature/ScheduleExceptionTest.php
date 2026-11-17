<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Schedule;
use App\Models\ScheduleException;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScheduleExceptionTest extends TestCase
{
    use RefreshDatabase;

    private Schedule $schedule;

    protected function setUp(): void
    {
        parent::setUp();

        $course = Course::create([
            'code' => 'STI501',
            'name' => 'Pemrograman Web Lanjut',
            'lecturer' => 'Dr. Rina',
            'credits' => 3,
        ]);

        $this->schedule = Schedule::create([
            'course_id' => $course->id,
            'day' => 'Senin',
            'start_time' => '08:00',
            'end_time' => '10:30',
            'room' => 'Lab 1',
        ]);
    }

    public function test_admin_can_record_schedule_cancellation(): void
    {
        $admin = User::factory()->admin()->create();
        $date = Carbon::now()->next('Monday');

        $response = $this->actingAs($admin)
            ->from(route('admin.schedule-exceptions.index'))
            ->post(route('admin.schedule-exceptions.store'), [
                'schedule_id' => $this->schedule->id,
                'date' => $date->toDateString(),
                'type' => 'pembatalan',
                'note' => 'Dosen berhalangan hadir.',
            ]);

        $response->assertRedirect(route('admin.schedule-exceptions.index'));

        $exception = ScheduleException::query()->firstOrFail();

        $this->assertSame($this->schedule->id, $exception->schedule_id);
        $this->assertSame($date->toDateString(), $exception->date->toDateString());
        $this->assertSame('pembatalan', $exception->type);
        $this->assertNull($exception->new_start_time);
        $this->assertNull($exception->new_room);
    }

    public function test_date_must_fall_on_schedule_day(): void
    {
        $admin = User::factory()->admin()->create();
        $tuesday = Carbon::now()->next('Tuesday');

        $this->actingAs($admin)
            ->from(route('admin.schedule-exceptions.index'))
            ->post(route('admin.schedule-exceptions.store'), [
                'schedule_id' => $this->schedule->id,
                'date' => $tuesday->toDateString(),
                'type' => 'pembatalan',
                'note' => 'Salah hari.',
            ])
            ->assertSessionHasErrors('date');

        $this->assertDatabaseCount('schedule_exceptions', 0);
    }

    public function test_change_requires_new_detail_or_note(): void
    {
        $admin = User::factory()->admin()->create();
        $date = Carbon::now()->next('Monday');

        $this->actingAs($admin)
            ->from(route('admin.schedule-exceptions.index'))
            ->post(route('admin.schedule-exceptions.store'), [
                'schedule_id' => $this->schedule->id,
                'date' => $date->toDateString(),
                'type' => 'perubahan',
            ])
            ->assertSessionHasErrors('note');

        $this->assertDatabaseCount('schedule_exceptions', 0);
    }

    public function test_duplicate_exception_on_same_date_is_rejected(): void
    {
        $admin = User::factory()->admin()->create();
        $date = Carbon::now()->next('Monday');

        ScheduleException::create([
            'schedule_id' => $this->schedule->id,
            'date' => $date->toDateString(),
            'type' => 'perubahan',
            'note' => 'Diundur.',
            'new_start_time' => '10:00',
            'new_end_time' => '12:30',
        ]);

        $this->actingAs($admin)
            ->from(route('admin.schedule-exceptions.index'))
            ->post(route('admin.schedule-exceptions.store'), [
                'schedule_id' => $this->schedule->id,
                'date' => $date->toDateString(),
                'type' => 'pembatalan',
            ])
            ->assertSessionHasErrors('date');

        $this->assertDatabaseCount('schedule_exceptions', 1);
    }

    public function test_member_cannot_record_schedule_exception(): void
    {
        $member = User::factory()->create();
        $date = Carbon::now()->next('Monday');

        $this->actingAs($member)
            ->post(route('admin.schedule-exceptions.store'), [
                'schedule_id' => $this->schedule->id,
                'date' => $date->toDateString(),
                'type' => 'pembatalan',
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('schedule_exceptions', 0);
    }
}
