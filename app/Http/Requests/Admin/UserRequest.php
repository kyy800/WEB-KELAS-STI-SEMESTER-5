<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user?->id)],
            'nim' => ['required', 'string', 'max:30', Rule::unique('users', 'nim')->ignore($user?->id)],
            'role' => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_USER])],
            'phone' => ['nullable', 'string', 'max:30'],
            'is_active' => ['boolean'],
            'password' => [$user ? 'nullable' : 'required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 8 karakter.',
        ];
    }
}
