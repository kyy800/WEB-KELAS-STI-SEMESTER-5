<?php

namespace App\Http\Requests\Admin;

use App\Models\Announcement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnnouncementRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string'],
            'category' => ['required', Rule::in(Announcement::CATEGORIES)],
            'is_pinned' => ['boolean'],
            'published_at' => ['nullable', 'date'],
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
            'attachments.max' => 'Maksimal 5 lampiran per pengumuman.',
            'attachments.*.max' => 'Ukuran setiap lampiran maksimal 5 MB.',
        ];
    }
}
