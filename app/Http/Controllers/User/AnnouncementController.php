<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'in:akademik,kegiatan,umum'],
        ]);

        $announcements = Announcement::query()
            ->published()
            ->pinnedFirst()
            ->with('author:id,name')
            ->withCount('attachments')
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('body', 'like', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('User/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'category' => $filters['category'] ?? '',
            ],
        ]);
    }

    public function show(Announcement $announcement): Response
    {
        $announcement = Announcement::query()
            ->published()
            ->with(['author:id,name', 'attachments'])
            ->findOrFail($announcement->id);

        return Inertia::render('User/Announcements/Show', [
            'announcement' => $announcement,
        ]);
    }
}
