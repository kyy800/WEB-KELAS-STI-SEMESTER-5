<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TaskRequest;
use App\Models\Course;
use App\Models\Task;
use App\Services\AttachmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function __construct(private readonly AttachmentService $attachments)
    {
    }

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'course_id' => ['nullable', 'integer', 'exists:courses,id'],
            'status' => ['nullable', 'in:aktif,lewat'],
        ]);

        $tasks = Task::query()
            ->with('course:id,code,name')
            ->withCount('attachments')
            ->withCount(['users as completed_count' => fn ($query) => $query->whereNotNull('task_user.completed_at')])
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($filters['course_id'] ?? null, fn ($query, $courseId) => $query->where('course_id', $courseId))
            ->when(($filters['status'] ?? null) === 'aktif', fn ($query) => $query->where('due_at', '>=', now()))
            ->when(($filters['status'] ?? null) === 'lewat', fn ($query) => $query->where('due_at', '<', now()))
            ->orderByDesc('due_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
            'filters' => [
                'q' => $filters['q'] ?? '',
                'course_id' => $filters['course_id'] ?? '',
                'status' => $filters['status'] ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tasks/Form', [
            'task' => null,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
        ]);
    }

    public function store(TaskRequest $request): RedirectResponse
    {
        $data = $request->validated();
        unset($data['attachments'], $data['remove_attachments']);
        $data['user_id'] = $request->user()->id;

        $task = Task::create($data);

        if ($request->hasFile('attachments')) {
            $this->attachments->storeMany($task, $request->file('attachments'));
        }

        return redirect()->route('admin.tasks.index')
            ->with('success', 'Tugas berhasil dibuat.');
    }

    public function edit(Task $task): Response
    {
        $task->load('attachments');

        return Inertia::render('Admin/Tasks/Form', [
            'task' => $task,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
        ]);
    }

    public function update(TaskRequest $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $data = $request->validated();
        unset($data['attachments'], $data['remove_attachments']);

        $task->update($data);

        $removeIds = $request->input('remove_attachments', []);
        if ($removeIds !== []) {
            $task->attachments()
                ->whereIn('id', $removeIds)
                ->get()
                ->each(fn ($attachment) => $this->attachments->delete($attachment));
        }

        if ($request->hasFile('attachments')) {
            $this->attachments->storeMany($task, $request->file('attachments'));
        }

        return redirect()->route('admin.tasks.index')
            ->with('success', 'Tugas berhasil diperbarui.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $this->attachments->deleteFor($task);
        $task->delete();

        return redirect()->route('admin.tasks.index')
            ->with('success', 'Tugas berhasil dihapus.');
    }
}
