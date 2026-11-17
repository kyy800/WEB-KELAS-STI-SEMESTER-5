<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\ScheduleException;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        $todayName = now()->translatedFormat('l');

        $schedules = Schedule::query()
            ->with('course:id,code,name,lecturer')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day');

        $days = collect(Schedule::DAYS)->map(fn (string $day) => [
            'name' => $day,
            'schedules' => $schedules->get($day, collect())->values(),
        ]);

        $todaySchedules = Schedule::query()
            ->with([
                'course:id,code,name,lecturer',
                'todayException',
            ])
            ->where('day', $todayName)
            ->orderBy('start_time')
            ->get();

        $upcomingExceptions = ScheduleException::query()
            ->with('schedule.course:id,code,name')
            ->where('date', '>=', today())
            ->orderBy('date')
            ->orderBy('new_start_time')
            ->take(10)
            ->get();

        return Inertia::render('User/Schedules/Index', [
            'days' => $days,
            'todaySchedules' => $todaySchedules,
            'upcomingExceptions' => $upcomingExceptions,
            'todayName' => $todayName,
        ]);
    }
}
