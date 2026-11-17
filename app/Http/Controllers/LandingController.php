<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Material;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Show the public landing page for guests, or send signed-in users to their dashboard.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user !== null) {
            return redirect()->route($user->isAdmin() ? 'admin.dashboard' : 'dashboard');
        }

        return Inertia::render('Landing', [
            'stats' => [
                'members' => User::query()->active()->count(),
                'courses' => Course::query()->count(),
                'materials' => Material::query()->count(),
                'activeTasks' => Task::query()->where('due_at', '>=', now())->count(),
            ],
        ]);
    }
}
