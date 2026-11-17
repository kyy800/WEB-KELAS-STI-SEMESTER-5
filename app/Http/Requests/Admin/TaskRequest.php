<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
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
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'due_at' => ['required', 'date'],
            'link' => ['nullable', 'url', 'max:2048'],
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip,rar,txt,jpg,jpeg,png', 'max:5120'],
            'remove_attachments' => ['nullable', 'array'],
            'remove_attachments.*' => ['integer', 'exists:attachments,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attachments.max' => 'Maksimal 5 lampiran per tugas.',
            'attachments.*.max' => 'Ukuran setiap lampiran maksimal 5 MB.',
        ];
    }
}
