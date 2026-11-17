<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MaterialController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\ScheduleExceptionController;
use App\Http\Controllers\Admin\TaskController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\MaterialDownloadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/pengumuman', [AnnouncementController::class, 'index'])->name('announcements.index');
        Route::get('/pengumuman/tambah', [AnnouncementController::class, 'create'])->name('announcements.create');
        Route::post('/pengumuman', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::get('/pengumuman/{announcement}/ubah', [AnnouncementController::class, 'edit'])->name('announcements.edit');
        Route::put('/pengumuman/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update');
        Route::delete('/pengumuman/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
        Route::patch('/pengumuman/{announcement}/sematkan', [AnnouncementController::class, 'togglePin'])->name('announcements.pin');

        Route::get('/mata-kuliah', [CourseController::class, 'index'])->name('courses.index');
        Route::post('/mata-kuliah', [CourseController::class, 'store'])->name('courses.store');
        Route::put('/mata-kuliah/{course}', [CourseController::class, 'update'])->name('courses.update');
        Route::delete('/mata-kuliah/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');

        Route::get('/jadwal', [ScheduleController::class, 'index'])->name('schedules.index');
        Route::get('/jadwal/tambah', [ScheduleController::class, 'create'])->name('schedules.create');
        Route::post('/jadwal', [ScheduleController::class, 'store'])->name('schedules.store');
        Route::get('/jadwal/{schedule}/ubah', [ScheduleController::class, 'edit'])->name('schedules.edit');
        Route::put('/jadwal/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');
        Route::delete('/jadwal/{schedule}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');

        Route::get('/perubahan-jadwal', [ScheduleExceptionController::class, 'index'])->name('schedule-exceptions.index');
        Route::post('/perubahan-jadwal', [ScheduleExceptionController::class, 'store'])->name('schedule-exceptions.store');
        Route::delete('/perubahan-jadwal/{scheduleException}', [ScheduleExceptionController::class, 'destroy'])->name('schedule-exceptions.destroy');

        Route::get('/tugas', [TaskController::class, 'index'])->name('tasks.index');
        Route::get('/tugas/tambah', [TaskController::class, 'create'])->name('tasks.create');
        Route::post('/tugas', [TaskController::class, 'store'])->name('tasks.store');
        Route::get('/tugas/{task}/ubah', [TaskController::class, 'edit'])->name('tasks.edit');
        Route::put('/tugas/{task}', [TaskController::class, 'update'])->name('tasks.update');
        Route::delete('/tugas/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

        Route::get('/materi', [MaterialController::class, 'index'])->name('materials.index');
        Route::get('/materi/tambah', [MaterialController::class, 'create'])->name('materials.create');
        Route::post('/materi', [MaterialController::class, 'store'])->name('materials.store');
        Route::get('/materi/{material}/ubah', [MaterialController::class, 'edit'])->name('materials.edit');
        Route::put('/materi/{material}', [MaterialController::class, 'update'])->name('materials.update');
        Route::delete('/materi/{material}', [MaterialController::class, 'destroy'])->name('materials.destroy');
        Route::get('/materi/{material}/unduh', MaterialDownloadController::class)->name('materials.download');

        Route::get('/pengguna', [UserController::class, 'index'])->name('users.index');
        Route::get('/pengguna/tambah', [UserController::class, 'create'])->name('users.create');
        Route::post('/pengguna', [UserController::class, 'store'])->name('users.store');
        Route::get('/pengguna/impor', [UserController::class, 'importForm'])->name('users.import');
        Route::post('/pengguna/impor', [UserController::class, 'import'])->name('users.import.store');
        Route::get('/pengguna/{user}/ubah', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/pengguna/{user}', [UserController::class, 'update'])->name('users.update');
    });
