<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'Anggota Baru',
            'nim' => '20239901',
            'email' => 'anggota.baru@kelas-sti.test',
            'role' => 'user',
            'phone' => '081200000001',
            'is_active' => true,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('admin.users.index'));

        $user = User::query()->where('nim', '20239901')->firstOrFail();

        $this->assertSame('Anggota Baru', $user->name);
        $this->assertSame(User::ROLE_USER, $user->role);
        $this->assertTrue($user->is_active);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    public function test_member_cannot_manage_users(): void
    {
        $member = User::factory()->create();

        $this->actingAs($member)
            ->post(route('admin.users.store'), [
                'name' => 'Penyusup',
                'nim' => '20239902',
                'email' => 'penyusup@kelas-sti.test',
                'role' => 'admin',
                'is_active' => true,
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('users', ['nim' => '20239902']);
    }

    public function test_last_active_admin_cannot_be_demoted(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->from(route('admin.users.edit', $admin))
            ->put(route('admin.users.update', $admin), [
                'name' => $admin->name,
                'nim' => $admin->nim,
                'email' => $admin->email,
                'role' => 'user',
                'phone' => $admin->phone,
                'is_active' => true,
            ])
            ->assertSessionHasErrors('role');

        $this->assertSame(User::ROLE_ADMIN, $admin->refresh()->role);
    }

    public function test_last_active_admin_cannot_be_deactivated(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->from(route('admin.users.edit', $admin))
            ->put(route('admin.users.update', $admin), [
                'name' => $admin->name,
                'nim' => $admin->nim,
                'email' => $admin->email,
                'role' => 'admin',
                'phone' => $admin->phone,
                'is_active' => false,
            ])
            ->assertSessionHasErrors('role');

        $this->assertTrue($admin->refresh()->is_active);
    }

    public function test_admin_can_import_users_from_csv(): void
    {
        $admin = User::factory()->admin()->create();

        $csv = "name,email,nim,phone\n"
            ."Dewi Lestari,dewi@kelas-sti.test,20239901,081200000001\n"
            ."Rizky Pratama,rizky@kelas-sti.test,20239902,\n";

        $response = $this->actingAs($admin)->post(route('admin.users.import.store'), [
            'file' => UploadedFile::fake()->createWithContent('anggota.csv', $csv),
            'default_password' => 'password123',
            'role' => 'user',
        ]);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('import_result', function (array $result) {
            return $result['created'] === 2 && $result['skipped'] === 0;
        });

        $this->assertDatabaseHas('users', [
            'email' => 'dewi@kelas-sti.test',
            'nim' => '20239901',
            'role' => 'user',
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'rizky@kelas-sti.test',
            'nim' => '20239902',
        ]);

        $this->assertTrue(
            Hash::check('password123', User::query()->where('nim', '20239901')->first()->password)
        );
    }

    public function test_import_skips_duplicate_rows(): void
    {
        $admin = User::factory()->admin()->create();

        $csv = "name,email,nim,phone\n"
            ."Duplikat,{$admin->email},20239909,\n"
            ."Anggota Baru,anggota.baru@kelas-sti.test,20239910,\n";

        $response = $this->actingAs($admin)->post(route('admin.users.import.store'), [
            'file' => UploadedFile::fake()->createWithContent('anggota.csv', $csv),
            'default_password' => 'password123',
            'role' => 'user',
        ]);

        $response->assertSessionHas('import_result', function (array $result) {
            return $result['created'] === 1 && $result['skipped'] === 1;
        });

        $this->assertDatabaseMissing('users', ['nim' => '20239909']);
        $this->assertDatabaseHas('users', ['nim' => '20239910']);
    }
}
