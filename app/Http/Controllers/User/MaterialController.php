<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'course_id' => ['nullable', 'integer', 'exists:courses,id'],
            'meeting_no' => ['nullable', 'integer', 'min:1', 'max:99'],
        ]);

        $materials = Material::query()
            ->with(['course:id,code,name', 'uploader:id,name'])
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('original_name', 'like', "%{$search}%");
                });
            })
            ->when($filters['course_id'] ?? null, fn ($query, $courseId) => $query->where('course_id', $courseId))
            ->when($filters['meeting_no'] ?? null, fn ($query, $meeting) => $query->where('meeting_no', $meeting))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('User/Materials/Index', [
            'materials' => $materials,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
            'filters' => [
                'q' => $filters['q'] ?? '',
                'course_id' => $filters['course_id'] ?? '',
                'meeting_no' => $filters['meeting_no'] ?? '',
            ],
        ]);
    }
}
