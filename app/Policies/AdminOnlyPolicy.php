<?php

namespace App\Policies;

use App\Models\User;

abstract class AdminOnlyPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, mixed $model): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, mixed $model): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, mixed $model): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, mixed $model): bool
    {
        return false;
    }

    public function forceDelete(User $user, mixed $model): bool
    {
        return false;
    }
}
