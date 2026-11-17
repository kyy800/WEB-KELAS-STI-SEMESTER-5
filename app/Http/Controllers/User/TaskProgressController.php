<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TaskProgressController extends Controller
{
    public function toggle(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('complete', $task);

        $user = $request->user();
        $pivot = $task->users()->whereKey($user->id)->first();

        if ($pivot && $pivot->pivot->completed_at) {
            $task->users()->detach($user->id);

            return back()->with('success', 'Tugas ditandai belum selesai.');
        }

        $task->users()->syncWithoutDetaching([
            $user->id => ['completed_at' => now()],
        ]);

        return back()->with('success', 'Tugas ditandai selesai.');
    }
}
