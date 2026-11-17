<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/profil')->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profil', [
                'name' => 'Nama Baru',
                'phone' => '081298765432',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profil');

        $user->refresh();

        $this->assertSame('Nama Baru', $user->name);
        $this->assertSame('081298765432', $user->phone);
        $this->assertSame($user->email, $user->refresh()->email);
        $this->assertSame($user->nim, $user->refresh()->nim);
    }

    public function test_avatar_can_be_uploaded(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2OQAAAABJRU5ErkJggg=='
        );

        $response = $this
            ->actingAs($user)
            ->patch('/profil', [
                'name' => $user->name,
                'avatar' => UploadedFile::fake()->createWithContent('avatar.png', $png),
            ]);

        $response->assertSessionHasNoErrors();

        $user->refresh();

        $this->assertNotNull($user->avatar);
        Storage::disk('public')->assertExists($user->avatar);
    }

    public function test_avatar_must_be_an_image_with_maximum_size(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profil')
            ->patch('/profil', [
                'name' => $user->name,
                'avatar' => UploadedFile::fake()->create('dokumen.pdf', 3000, 'application/pdf'),
            ]);

        $response->assertSessionHasErrors('avatar');
        $this->assertNull($user->refresh()->avatar);
    }
}
