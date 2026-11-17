<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ScheduleExceptionRequest;
use App\Models\Schedule;
use App\Models\ScheduleException;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleExceptionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/ScheduleExceptions/Index', [
            'exceptions' => ScheduleException::query()
                ->with('schedule.course:id,code,name')
                ->orderByDesc('date')
                ->paginate(15),
            'schedules' => Schedule::query()
                ->with('course:id,code,name')
                ->orderBy('day')
                ->orderBy('start_time')
                ->get(),
            'types' => ScheduleException::TYPES,
        ]);
    }

    public function store(ScheduleExceptionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $schedule = Schedule::query()->findOrFail($data['schedule_id']);

        $dateName = Carbon::parse($data['date'])->locale('id')->translatedFormat('l');
        if ($dateName !== $schedule->day) {
            throw ValidationException::withMessages([
                'date' => "Tanggal yang dipilih jatuh pada hari {$dateName}, sedangkan jadwal ini hari {$schedule->day}.",
            ]);
        }

        $exists = ScheduleException::query()
            ->where('schedule_id', $schedule->id)
            ->whereDate('date', $data['date'])
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'date' => 'Perubahan/pembatalan untuk jadwal pada tanggal ini sudah ada.',
            ]);
        }

        if ($data['type'] === ScheduleException::TYPE_CANCELLED) {
            $data['new_start_time'] = null;
            $data['new_end_time'] = null;
            $data['new_room'] = null;
        }

        $hasChange = filled($data['note'] ?? null)
            || filled($data['new_start_time'] ?? null)
            || filled($data['new_end_time'] ?? null)
            || filled($data['new_room'] ?? null);

        if ($data['type'] === ScheduleException::TYPE_CHANGED && ! $hasChange) {
            throw ValidationException::withMessages([
                'note' => 'Isi catatan, jam baru, atau ruang baru untuk perubahan jadwal.',
            ]);
        }

        ScheduleException::create($data);

        return back()->with('success', 'Perubahan jadwal berhasil disimpan.');
    }

    public function destroy(ScheduleException $scheduleException): RedirectResponse
    {
        $this->authorize('delete', $scheduleException);

        $scheduleException->delete();

        return back()->with('success', 'Perubahan jadwal berhasil dihapus.');
    }
}
