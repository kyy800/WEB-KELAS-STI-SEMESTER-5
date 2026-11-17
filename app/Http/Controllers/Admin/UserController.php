<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportUsersRequest;
use App\Http\Requests\Admin\UserRequest;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', 'in:admin,user'],
            'status' => ['nullable', 'in:aktif,nonaktif'],
        ]);

        $users = User::query()
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('nim', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, fn ($query, $role) => $query->where('role', $role))
            ->when(($filters['status'] ?? null) === 'aktif', fn ($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'nonaktif', fn ($query) => $query->where('is_active', false))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'role' => $filters['role'] ?? '',
                'status' => $filters['status'] ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => null,
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');

        User::create($data);

        return redirect()->route('admin.users.index')
            ->with('success', 'Akun pengguna berhasil dibuat.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => $user,
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');

        $this->ensureLastAdminRemains($user, $data);

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')
            ->with('success', 'Akun pengguna berhasil diperbarui.');
    }

    public function importForm(): Response
    {
        return Inertia::render('Admin/Users/Import');
    }

    public function import(ImportUsersRequest $request): RedirectResponse
    {
        $file = $request->file('file');
        $path = $file->getRealPath();
        $content = (string) file_get_contents($path);

        $firstLine = strtok($content, "\r\n") ?: '';
        $delimiter = substr_count($firstLine, ';') > substr_count($firstLine, ',') ? ';' : ',';

        $handle = fopen($path, 'r');
        if ($handle === false) {
            throw ValidationException::withMessages(['file' => 'File CSV tidak dapat dibaca.']);
        }

        $header = fgetcsv($handle, 0, $delimiter);
        if ($header === false) {
            fclose($handle);

            throw ValidationException::withMessages(['file' => 'File CSV kosong.']);
        }

        $header = array_map(
            fn ($column) => strtolower(trim(preg_replace('/^\xEF\xBB\xBF/', '', (string) $column))),
            $header
        );

        $missing = array_diff(['name', 'email', 'nim'], $header);
        if ($missing !== []) {
            fclose($handle);

            throw ValidationException::withMessages([
                'file' => 'Kolom wajib tidak ditemukan: '.implode(', ', $missing).'.',
            ]);
        }

        $created = 0;
        $skipped = 0;
        $errors = [];
        $line = 1;

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $line++;

            if ($line > 500) {
                $errors[] = 'Impor dihentikan: maksimal 500 baris per file.';
                break;
            }

            if ($row === [null] || count(array_filter($row, fn ($value) => trim((string) $value) !== '')) === 0) {
                continue;
            }

            $row = array_pad($row, count($header), null);
            $record = array_combine($header, array_slice($row, 0, count($header)));

            $payload = [
                'name' => trim((string) ($record['name'] ?? '')),
                'email' => strtolower(trim((string) ($record['email'] ?? ''))),
                'nim' => trim((string) ($record['nim'] ?? '')),
                'phone' => trim((string) ($record['phone'] ?? '')) ?: null,
            ];

            $validator = Validator::make($payload, [
                'name' => ['required', 'string', 'max:100'],
                'email' => ['required', 'email', 'max:150', 'unique:users,email'],
                'nim' => ['required', 'string', 'max:30', 'unique:users,nim'],
                'phone' => ['nullable', 'string', 'max:30'],
            ]);

            if ($validator->fails()) {
                $skipped++;
                if (count($errors) < 50) {
                    $errors[] = "Baris {$line}: ".implode(' ', $validator->errors()->all());
                }

                continue;
            }

            try {
                User::create([
                    ...$payload,
                    'password' => $request->input('default_password'),
                    'role' => $request->input('role'),
                    'is_active' => true,
                ]);
                $created++;
            } catch (QueryException) {
                $skipped++;
                if (count($errors) < 50) {
                    $errors[] = "Baris {$line}: email atau NIM sudah terdaftar.";
                }
            }
        }

        fclose($handle);

        return redirect()->route('admin.users.index')
            ->with('success', "Impor selesai: {$created} akun dibuat, {$skipped} baris dilewati.")
            ->with('import_result', [
                'created' => $created,
                'skipped' => $skipped,
                'errors' => $errors,
            ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function ensureLastAdminRemains(User $user, array $data): void
    {
        $isActiveAdmin = $user->isAdmin() && $user->is_active;
        $willRemainActiveAdmin = $data['role'] === User::ROLE_ADMIN && $data['is_active'];

        if (! $isActiveAdmin || $willRemainActiveAdmin) {
            return;
        }

        $activeAdmins = User::query()->active()->where('role', User::ROLE_ADMIN)->count();

        if ($activeAdmins <= 1) {
            throw ValidationException::withMessages([
                'role' => 'Admin terakhir tidak dapat diturunkan menjadi user atau dinonaktifkan.',
            ]);
        }
    }
}
