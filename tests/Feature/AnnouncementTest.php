<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Attachment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AnnouncementTest extends TestCase
{
    use RefreshDatabase;

    private function makeAnnouncement(User $author, array $overrides = []): Announcement
    {
        return Announcement::create([
            'user_id' => $author->id,
            'title' => 'Persiapan UTS',
            'body' => 'UTS dilaksanakan minggu depan.',
            'category' => 'akademik',
            'is_pinned' => false,
            'published_at' => now()->subHour(),
            ...$overrides,
        ]);
    }

    public function test_admin_can_create_announcement(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post(route('admin.announcements.store'), [
            'title' => 'Jadwal UTS',
            'body' => 'UTS dimulai Senin pekan depan.',
            'category' => 'akademik',
            'is_pinned' => true,
            'published_at' => now()->toDateTimeString(),
        ]);

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertDatabaseHas('announcements', [
            'user_id' => $admin->id,
            'title' => 'Jadwal UTS',
            'category' => 'akademik',
            'is_pinned' => true,
        ]);
    }

    public function test_announcement_requires_valid_data(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.announcements.store'), [
                'title' => '',
                'body' => '',
                'category' => 'tidak-ada',
            ])
            ->assertSessionHasErrors(['title', 'body', 'category']);
    }

    public function test_member_cannot_create_announcement(): void
    {
        $member = User::factory()->create();

        $this->actingAs($member)
            ->post(route('admin.announcements.store'), [
                'title' => 'Bukan hak saya',
                'body' => 'Tidak boleh.',
                'category' => 'umum',
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('announcements', 0);
    }

    public function test_admin_can_update_and_delete_announcement(): void
    {
        $admin = User::factory()->admin()->create();
        $announcement = $this->makeAnnouncement($admin);

        $this->actingAs($admin)
            ->put(route('admin.announcements.update', $announcement), [
                'title' => 'Persiapan UTS (Revisi)',
                'body' => 'Informasi terbaru.',
                'category' => 'kegiatan',
                'is_pinned' => true,
                'published_at' => now()->toDateTimeString(),
            ])
            ->assertRedirect(route('admin.announcements.index'));

        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'title' => 'Persiapan UTS (Revisi)',
            'category' => 'kegiatan',
            'is_pinned' => true,
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.announcements.destroy', $announcement))
            ->assertRedirect(route('admin.announcements.index'));

        $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
    }

    public function test_admin_can_toggle_pin(): void
    {
        $admin = User::factory()->admin()->create();
        $announcement = $this->makeAnnouncement($admin);

        $this->actingAs($admin)
            ->patch(route('admin.announcements.pin', $announcement))
            ->assertRedirect();

        $this->assertTrue($announcement->refresh()->is_pinned);
    }

    public function test_member_can_view_published_announcement(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->create();
        $announcement = $this->makeAnnouncement($admin);

        $this->actingAs($member)
            ->get(route('announcements.show', $announcement))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('User/Announcements/Show')
                ->where('announcement.title', $announcement->title));
    }

    public function test_member_can_view_and_download_image_attachment(): void
    {
        Storage::fake('local');

        $admin = User::factory()->admin()->create();
        $member = User::factory()->create();

        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        );

        $this->actingAs($admin)
            ->post(route('admin.announcements.store'), [
                'title' => 'Foto kegiatan kelas',
                'body' => 'Dokumentasi kegiatan terbaru.',
                'category' => 'kegiatan',
                'attachments' => [UploadedFile::fake()->createWithContent('foto-kegiatan.png', $png)],
            ])
            ->assertRedirect(route('admin.announcements.index'));

        $attachment = Attachment::query()->firstOrFail();

        Storage::disk('local')->assertExists($attachment->path);

        $this->assertTrue($attachment->is_image);

        $this->actingAs($member)
            ->get(route('announcements.show', $attachment->attachable_id))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('User/Announcements/Show')
                ->where('announcement.attachments.0.id', $attachment->id)
                ->where('announcement.attachments.0.is_image', true)
                ->has('announcement.attachments.0.size_label'));

        $preview = $this->actingAs($member)
            ->get(route('attachments.preview', $attachment))
            ->assertOk()
            ->assertHeader('content-type', 'image/png')
            ->assertHeader('x-content-type-options', 'nosniff');

        $this->assertStringContainsString(
            'inline',
            (string) $preview->headers->get('content-disposition')
        );

        $download = $this->actingAs($member)
            ->get(route('attachments.download', $attachment))
            ->assertOk();

        $this->assertStringContainsString(
            'attachment',
            (string) $download->headers->get('content-disposition')
        );
    }

    public function test_non_image_attachment_cannot_be_previewed(): void
    {
        Storage::fake('local');

        $admin = User::factory()->admin()->create();
        $member = User::factory()->create();
        $announcement = $this->makeAnnouncement($admin);

        Storage::disk('local')->put('attachments/catatan.txt', 'Catatan kelas.');

        $attachment = $announcement->attachments()->create([
            'path' => 'attachments/catatan.txt',
            'name' => 'catatan.txt',
            'size' => 14,
            'mime_type' => 'text/plain',
        ]);

        $this->assertFalse($attachment->is_image);

        $this->actingAs($member)
            ->get(route('attachments.preview', $attachment))
            ->assertNotFound();
    }

    public function test_member_cannot_view_unpublished_announcement(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->create();
        $announcement = $this->makeAnnouncement($admin, ['published_at' => null]);

        $this->actingAs($member)
            ->get(route('announcements.show', $announcement))
            ->assertNotFound();
    }
}
