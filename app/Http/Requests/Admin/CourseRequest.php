<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseRequest extends FormRequest
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
        $course = $this->route('course');

        return [
            'code' => ['required', 'string', 'max:20', Rule::unique('courses', 'code')->ignore($course?->id)],
            'name' => ['required', 'string', 'max:150'],
            'lecturer' => ['nullable', 'string', 'max:150'],
            'credits' => ['required', 'integer', 'min:1', 'max:6'],
        ];
    }
}
