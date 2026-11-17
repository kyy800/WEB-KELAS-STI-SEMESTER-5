<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseRequest;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $courses = Course::query()
            ->withCount(['schedules', 'tasks', 'materials'])
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('lecturer', 'like', "%{$search}%");
                });
            })
            ->orderBy('code')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'filters' => ['q' => $filters['q'] ?? ''],
        ]);
    }

    public function store(CourseRequest $request): RedirectResponse
    {
        Course::create($request->validated());

        return back()->with('success', 'Mata kuliah berhasil ditambahkan.');
    }

    public function update(CourseRequest $request, Course $course): RedirectResponse
    {
        $this->authorize('update', $course);

        $course->update($request->validated());

        return back()->with('success', 'Mata kuliah berhasil diperbarui.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $this->authorize('delete', $course);

        $course->loadCount(['schedules', 'tasks', 'materials']);

        if ($course->schedules_count + $course->tasks_count + $course->materials_count > 0) {
            return back()->with(
                'error',
                'Mata kuliah tidak dapat dihapus karena masih memiliki jadwal, tugas, atau materi.'
            );
        }

        $course->delete();

        return back()->with('success', 'Mata kuliah berhasil dihapus.');
    }
}
