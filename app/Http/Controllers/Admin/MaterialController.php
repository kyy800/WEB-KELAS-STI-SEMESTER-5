<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MaterialRequest;
use App\Models\Course;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'course_id' => ['nullable', 'integer', 'exists:courses,id'],
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
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Materials/Index', [
            'materials' => $materials,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
            'filters' => [
                'q' => $filters['q'] ?? '',
                'course_id' => $filters['course_id'] ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Materials/Form', [
            'material' => null,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
        ]);
    }

    public function store(MaterialRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (! $request->hasFile('file') && blank($data['url'] ?? null)) {
            throw ValidationException::withMessages([
                'file' => 'Unggah file atau isi tautan materi.',
            ]);
        }

        $data['user_id'] = $request->user()->id;
        $data = $this->withFileData($request, $data);

        Material::create($data);

        return redirect()->route('admin.materials.index')
            ->with('success', 'Materi berhasil ditambahkan.');
    }

    public function edit(Material $material): Response
    {
        return Inertia::render('Admin/Materials/Form', [
            'material' => $material,
            'courses' => Course::query()->orderBy('name')->get(['id', 'code', 'name']),
        ]);
    }

    public function update(MaterialRequest $request, Material $material): RedirectResponse
    {
        $this->authorize('update', $material);

        $data = $request->validated();

        if (! $request->hasFile('file') && blank($data['url'] ?? null) && ! $material->file_path) {
            throw ValidationException::withMessages([
                'file' => 'Unggah file atau isi tautan materi.',
            ]);
        }

        if ($request->hasFile('file') && $material->file_path) {
            Storage::disk('local')->delete($material->file_path);
        }

        $data = $this->withFileData($request, $data);

        $material->update($data);

        return redirect()->route('admin.materials.index')
            ->with('success', 'Materi berhasil diperbarui.');
    }

    public function destroy(Material $material): RedirectResponse
    {
        $this->authorize('delete', $material);

        if ($material->file_path) {
            Storage::disk('local')->delete($material->file_path);
        }

        $material->delete();

        return redirect()->route('admin.materials.index')
            ->with('success', 'Materi berhasil dihapus.');
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function withFileData(MaterialRequest $request, array $data): array
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $data['file_path'] = $file->store('materials', 'local');
            $data['original_name'] = $file->getClientOriginalName();
            $data['mime_type'] = $file->getMimeType();
            $data['file_size'] = $file->getSize() ?: 0;
        }

        unset($data['file']);

        return $data;
    }
}
