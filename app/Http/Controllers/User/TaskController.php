<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:aktif,selesai,lewat'],
            'course_id' => ['nullable', 'integer', 'exists:courses,id'],
        ]);

        $query = Task::query()
            ->with('course:id,code,name')
            ->withCount('attachments')
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($filters['course_id'] ?? null, fn ($query, $courseId) => $query->where('course_id', $courseId));

        match ($filters['status'] ?? null) {
            'selesai' => $query->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id)->whereNotNull('task_user.completed_at');
            }),
            'lewat' => $query->where('due_at', '<', now())->whereDoesntHave('users', function ($query) use ($user) {
                $query->where('users.id', $user->id)->whereNotNull('task_user.completed_at');
            }),
            'aktif' => $query->where('due_at', '>=', now())->whereDoesntHave('users', function ($query) use ($user) {
                $query->where('users.id', $user->id)->whereNotNull('task_user.completed_at');
            }),
            default => null,
        };

        $tasks = $query->orderBy('due_at')->paginate(10)->withQueryString();

        $completedIds = DB::table('task_user')
            ->where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->whereIn('task_id', $tasks->pluck('id'))
            ->pluck('task_id')
            ->all();

        $tasks->through(function (Task $task) use ($completedIds) {
            $task->setAttribute('is_completed', in_array($task->id, $completedIds, true));

            return $task;
        });

        return Inertia::render('User/Tasks/Index', [
            'tasks' => $tasks,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
            'filters' => [
                'q' => $filters['q'] ?? '',
                'status' => $filters['status'] ?? '',
                'course_id' => $filters['course_id'] ?? '',
            ],
        ]);
    }

    public function show(Request $request, Task $task): Response
    {
        $task->load(['course:id,code,name,lecturer', 'attachments']);
        $task->setAttribute('is_completed', $task->isCompletedBy($request->user()));

        return Inertia::render('User/Tasks/Show', [
            'task' => $task,
        ]);
    }
}
