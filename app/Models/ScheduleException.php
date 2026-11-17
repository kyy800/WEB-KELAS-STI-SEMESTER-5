<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleException extends Model
{
    use HasFactory;

    public const TYPE_CHANGED = 'perubahan';

    public const TYPE_CANCELLED = 'pembatalan';

    public const TYPES = [self::TYPE_CHANGED, self::TYPE_CANCELLED];

    protected $fillable = [
        'schedule_id',
        'date',
        'type',
        'note',
        'new_start_time',
        'new_end_time',
        'new_room',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }
}
