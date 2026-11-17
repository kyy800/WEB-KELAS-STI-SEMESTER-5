<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy extends AdminOnlyPolicy
{
    public function complete(User $user, Task $task): bool
    {
        return true;
    }
}
