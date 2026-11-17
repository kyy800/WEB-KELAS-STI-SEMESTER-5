<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Course;
use App\Models\Material;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $todayName = now()->translatedFormat('l');

        $todaySchedules = Schedule::query()
            ->with([
                'course:id,code,name,lecturer',
                'todayException',
            ])
            ->where('day', $todayName)
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'members' => User::query()->active()->count(),
                'courses' => Course::query()->count(),
                'activeTasks' => Task::query()->where('due_at', '>=', now())->count(),
                'materials' => Material::query()->count(),
                'announcements' => Announcement::query()->published()->count(),
            ],
            'latestAnnouncements' => Announcement::query()
                ->with('author:id,name')
                ->latest('published_at')
                ->take(5)
                ->get(),
            'upcomingTasks' => Task::query()
                ->with('course:id,code,name')
                ->where('due_at', '>=', now())
                ->orderBy('due_at')
                ->take(5)
                ->get(),
            'todaySchedules' => $todaySchedules,
            'todayName' => $todayName,
        ]);
    }
}
