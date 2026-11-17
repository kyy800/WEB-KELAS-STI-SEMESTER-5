<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ScheduleRequest;
use App\Models\Course;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $schedules = Schedule::query()
            ->with(['course:id,code,name,lecturer', 'exceptions' => fn ($query) => $query->where('date', '>=', today())->orderBy('date')])
            ->orderBy('start_time')
            ->get()
            ->groupBy('day');

        $days = collect(Schedule::DAYS)->map(fn (string $day) => [
            'name' => $day,
            'schedules' => $schedules->get($day, collect())->values(),
        ]);

        return Inertia::render('Admin/Schedules/Index', [
            'days' => $days,
            'totalSchedules' => Schedule::query()->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Schedules/Form', [
            'schedule' => null,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
            'days' => Schedule::DAYS,
        ]);
    }

    public function store(ScheduleRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $this->ensureNoConflict($data);

        Schedule::create($data);

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function edit(Schedule $schedule): Response
    {
        return Inertia::render('Admin/Schedules/Form', [
            'schedule' => $schedule,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
            'days' => Schedule::DAYS,
        ]);
    }

    public function update(ScheduleRequest $request, Schedule $schedule): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $data = $request->validated();
        $this->ensureNoConflict($data, $schedule->id);

        $schedule->update($data);

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Schedule $schedule): RedirectResponse
    {
        $this->authorize('delete', $schedule);

        $schedule->delete();

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Jadwal berhasil dihapus.');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function ensureNoConflict(array $data, ?int $ignoreId = null): void
    {
        $conflict = Schedule::query()
            ->where('day', $data['day'])
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->where('start_time', '<', $data['end_time'])
            ->where('end_time', '>', $data['start_time'])
            ->exists();

        if ($conflict) {
            throw ValidationException::withMessages([
                'start_time' => 'Jadwal bertabrakan dengan mata kuliah lain pada hari dan jam yang sama.',
            ]);
        }
    }
}
