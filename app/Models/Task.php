<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'user_id',
        'title',
        'description',
        'due_at',
        'link',
    ];

    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_user')
            ->withPivot('completed_at')
            ->withTimestamps();
    }

    public function isCompletedBy(User $user): bool
    {
        return $this->users()
            ->whereKey($user->id)
            ->whereNotNull('task_user.completed_at')
            ->exists();
    }

    public function scopeUpcoming($query)
    {
        return $query->where('due_at', '>=', now())->orderBy('due_at');
    }
}
