<?php

namespace App\Services;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttachmentService
{
    /**
     * @param  array<int, UploadedFile>  $files
     */
    public function storeMany(Model $model, array $files): void
    {
        foreach ($files as $file) {
            $path = $file->store('attachments', 'local');

            $model->attachments()->create([
                'path' => $path,
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize() ?: 0,
                'mime_type' => $file->getMimeType(),
            ]);
        }
    }

    public function delete(Attachment $attachment): void
    {
        Storage::disk('local')->delete($attachment->path);
        $attachment->delete();
    }

    public function deleteFor(Model $model): void
    {
        $model->attachments()->get()->each(fn (Attachment $attachment) => $this->delete($attachment));
    }

    public function download(Attachment $attachment): StreamedResponse
    {
        abort_unless(Storage::disk('local')->exists($attachment->path), 404, 'File tidak ditemukan.');

        return Storage::disk('local')->download($attachment->path, $attachment->name);
    }

    public function preview(Attachment $attachment): StreamedResponse
    {
        abort_unless(Storage::disk('local')->exists($attachment->path), 404, 'File tidak ditemukan.');

        return Storage::disk('local')->response(
            $attachment->path,
            $attachment->name,
            [
                'Content-Type' => $attachment->mime_type ?: 'application/octet-stream',
                'X-Content-Type-Options' => 'nosniff',
            ],
        );
    }
}
