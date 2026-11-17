<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MaterialTest extends TestCase
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

    public function test_admin_can_upload_material_file(): void
    {
        Storage::fake('local');

        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();

        $response = $this->actingAs($admin)->post(route('admin.materials.store'), [
            'course_id' => $course->id,
            'title' => 'Modul 1',
            'meeting_no' => 1,
            'file' => UploadedFile::fake()->create('modul-1.pdf', 120, 'application/pdf'),
        ]);

        $response->assertRedirect(route('admin.materials.index'));

        $material = Material::query()->firstOrFail();

        $this->assertSame('modul-1.pdf', $material->original_name);
        $this->assertSame(1, $material->meeting_no);
        Storage::disk('local')->assertExists($material->file_path);
    }

    public function test_admin_can_add_material_link_without_file(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();

        $this->actingAs($admin)
            ->post(route('admin.materials.store'), [
                'course_id' => $course->id,
                'title' => 'Referensi Laravel',
                'url' => 'https://laravel.com/docs',
            ])
            ->assertRedirect(route('admin.materials.index'));

        $this->assertDatabaseHas('materials', [
            'course_id' => $course->id,
            'title' => 'Referensi Laravel',
            'url' => 'https://laravel.com/docs',
        ]);
    }

    public function test_material_requires_file_or_link(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();

        $this->actingAs($admin)
            ->post(route('admin.materials.store'), [
                'course_id' => $course->id,
                'title' => 'Materi kosong',
            ])
            ->assertSessionHasErrors('file');

        $this->assertDatabaseCount('materials', 0);
    }

    public function test_material_file_must_be_allowed_type_and_size(): void
    {
        $admin = User::factory()->admin()->create();
        $course = $this->makeCourse();

        $this->actingAs($admin)
            ->post(route('admin.materials.store'), [
                'course_id' => $course->id,
                'title' => 'File berbahaya',
                'file' => UploadedFile::fake()->create('script.exe', 10, 'application/octet-stream'),
            ])
            ->assertSessionHasErrors('file');

        $this->actingAs($admin)
            ->post(route('admin.materials.store'), [
                'course_id' => $course->id,
                'title' => 'File terlalu besar',
                'file' => UploadedFile::fake()->create('besar.pdf', 21000, 'application/pdf'),
            ])
            ->assertSessionHasErrors('file');

        $this->assertDatabaseCount('materials', 0);
    }

    public function test_member_cannot_upload_material(): void
    {
        Storage::fake('local');

        $member = User::factory()->create();
        $course = $this->makeCourse();

        $this->actingAs($member)
            ->post(route('admin.materials.store'), [
                'course_id' => $course->id,
                'title' => 'Bukan hak saya',
                'file' => UploadedFile::fake()->create('modul.pdf', 10, 'application/pdf'),
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('materials', 0);
    }

    public function test_member_can_download_material(): void
    {
        Storage::fake('local');

        $admin = User::factory()->admin()->create();
        $member = User::factory()->create();
        $course = $this->makeCourse();

        $this->actingAs($admin)->post(route('admin.materials.store'), [
            'course_id' => $course->id,
            'title' => 'Modul 1',
            'file' => UploadedFile::fake()->create('modul-1.pdf', 120, 'application/pdf'),
        ]);

        $material = Material::query()->firstOrFail();

        $this->actingAs($member)
            ->get(route('materials.download', $material))
            ->assertOk()
            ->assertDownload('modul-1.pdf');
    }
}
