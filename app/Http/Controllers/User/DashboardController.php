<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Material;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $todayName = now()->translatedFormat('l');

        $announcements = Announcement::query()
            ->published()
            ->pinnedFirst()
            ->with('author:id,name')
            ->take(3)
            ->get();

        $tasks = Task::query()
            ->with('course:id,code,name')
            ->where('due_at', '>=', now())
            ->whereDoesntHave('users', function ($query) use ($user) {
                $query->where('users.id', $user->id)
                    ->whereNotNull('task_user.completed_at');
            })
            ->orderBy('due_at')
            ->take(5)
            ->get();

        $todaySchedules = Schedule::query()
            ->with([
                'course:id,code,name,lecturer',
                'todayException',
            ])
            ->where('day', $todayName)
            ->orderBy('start_time')
            ->get();

        return Inertia::render('User/Dashboard', [
            'announcements' => $announcements,
            'tasks' => $tasks,
            'todaySchedules' => $todaySchedules,
            'todayName' => $todayName,
            'stats' => [
                'members' => User::query()->active()->count(),
                'activeTasks' => Task::query()->where('due_at', '>=', now())->count(),
                'materials' => Material::query()->count(),
                'announcements' => Announcement::query()->published()->count(),
            ],
        ]);
    }
}
