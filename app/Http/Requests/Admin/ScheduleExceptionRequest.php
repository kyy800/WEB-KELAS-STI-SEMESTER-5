<?php

namespace App\Http\Requests\Admin;

use App\Models\ScheduleException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ScheduleExceptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'schedule_id' => ['required', 'integer', 'exists:schedules,id'],
            'date' => ['required', 'date'],
            'type' => ['required', Rule::in(ScheduleException::TYPES)],
            'note' => ['nullable', 'string', 'max:255'],
            'new_start_time' => ['nullable', 'date_format:H:i'],
            'new_end_time' => ['nullable', 'date_format:H:i', 'after:new_start_time'],
            'new_room' => ['nullable', 'string', 'max:100'],
        ];
    }
}
