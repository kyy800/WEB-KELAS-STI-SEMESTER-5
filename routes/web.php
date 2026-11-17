<?php

use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MaterialDownloadController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\AnnouncementController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\MaterialController;
use App\Http\Controllers\User\MemberController;
use App\Http\Controllers\User\ScheduleController;
use App\Http\Controllers\User\TaskController;
use App\Http\Controllers\User\TaskProgressController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landing');

Route::middleware(['auth', 'active'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/pengumuman', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/pengumuman/{announcement}', [AnnouncementController::class, 'show'])->name('announcements.show');

    Route::get('/jadwal', [ScheduleController::class, 'index'])->name('schedules.index');

    Route::get('/tugas', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('/tugas/{task}', [TaskController::class, 'show'])->name('tasks.show');
    Route::post('/tugas/{task}/selesai', [TaskProgressController::class, 'toggle'])->name('tasks.toggle');

    Route::get('/materi', [MaterialController::class, 'index'])->name('materials.index');
    Route::get('/materi/{material}/unduh', MaterialDownloadController::class)->name('materials.download');

    Route::get('/anggota', [MemberController::class, 'index'])->name('members.index');

    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profil/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    Route::get('/lampiran/{attachment}/unduh', [AttachmentController::class, 'download'])->name('attachments.download');
    Route::get('/lampiran/{attachment}/lihat', [AttachmentController::class, 'preview'])->name('attachments.preview');
});

require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
