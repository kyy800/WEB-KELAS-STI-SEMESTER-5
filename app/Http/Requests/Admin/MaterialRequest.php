<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MaterialRequest extends FormRequest
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
            'meeting_no' => ['nullable', 'integer', 'min:1', 'max:99'],
            'file' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip,rar,txt,jpg,jpeg,png',
                'max:20480',
            ],
            'url' => ['nullable', 'url', 'max:2048'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.max' => 'Ukuran file materi maksimal 20 MB.',
            'file.mimes' => 'Tipe file tidak diizinkan.',
        ];
    }
}
