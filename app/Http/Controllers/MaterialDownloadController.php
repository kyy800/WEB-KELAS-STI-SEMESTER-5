<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MaterialDownloadController extends Controller
{
    public function __invoke(Material $material): StreamedResponse
    {
        $this->authorize('view', $material);

        abort_unless(
            $material->file_path && Storage::disk('local')->exists($material->file_path),
            404,
            'File materi tidak ditemukan.'
        );

        return Storage::disk('local')->download(
            $material->file_path,
            $material->original_name ?: basename($material->file_path)
        );
    }
}
