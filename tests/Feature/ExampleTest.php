<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_the_landing_page(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Landing')
                ->has('stats')
            );
    }

    public function test_member_is_redirected_to_the_user_dashboard(): void
    {
        $member = User::factory()->create();

        $this->actingAs($member)
            ->get('/')
            ->assertRedirect(route('dashboard'));
    }

    public function test_admin_is_redirected_to_the_admin_dashboard(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get('/')
            ->assertRedirect(route('admin.dashboard'));
    }
}
