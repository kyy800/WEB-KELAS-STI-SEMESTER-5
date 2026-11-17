<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnnouncementRequest;
use App\Models\Announcement;
use App\Services\AttachmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function __construct(private readonly AttachmentService $attachments)
    {
    }

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'in:akademik,kegiatan,umum'],
        ]);

        $announcements = Announcement::query()
            ->with('author:id,name')
            ->withCount('attachments')
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('body', 'like', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->latest('published_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'category' => $filters['category'] ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Announcements/Form', [
            'announcement' => null,
        ]);
    }

    public function store(AnnouncementRequest $request): RedirectResponse
    {
        $data = $request->validated();
        unset($data['attachments'], $data['remove_attachments']);

        $data['user_id'] = $request->user()->id;
        $data['is_pinned'] = $request->boolean('is_pinned');
        $data['published_at'] = $data['published_at'] ?? now();

        $announcement = Announcement::create($data);

        if ($request->hasFile('attachments')) {
            $this->attachments->storeMany($announcement, $request->file('attachments'));
        }

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function edit(Announcement $announcement): Response
    {
        $announcement->load('attachments');

        return Inertia::render('Admin/Announcements/Form', [
            'announcement' => $announcement,
        ]);
    }

    public function update(AnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $this->authorize('update', $announcement);

        $data = $request->validated();
        unset($data['attachments'], $data['remove_attachments']);

        $data['is_pinned'] = $request->boolean('is_pinned');
        $data['published_at'] = $data['published_at'] ?? $announcement->published_at ?? now();

        $announcement->update($data);

        $removeIds = $request->input('remove_attachments', []);
        if ($removeIds !== []) {
            $announcement->attachments()
                ->whereIn('id', $removeIds)
                ->get()
                ->each(fn ($attachment) => $this->attachments->delete($attachment));
        }

        if ($request->hasFile('attachments')) {
            $this->attachments->storeMany($announcement, $request->file('attachments'));
        }

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $this->authorize('delete', $announcement);

        $this->attachments->deleteFor($announcement);
        $announcement->delete();

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Pengumuman berhasil dihapus.');
    }

    public function togglePin(Announcement $announcement): RedirectResponse
    {
        $this->authorize('update', $announcement);

        $announcement->update(['is_pinned' => ! $announcement->is_pinned]);

        return back()->with('success', $announcement->is_pinned
            ? 'Pengumuman disematkan.'
            : 'Sematkan pengumuman dilepas.');
    }
}
