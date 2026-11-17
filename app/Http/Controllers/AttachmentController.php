<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Services\AttachmentService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttachmentController extends Controller
{
    public function __construct(private readonly AttachmentService $attachments) {}

    public function download(Attachment $attachment): StreamedResponse
    {
        $this->authorize('view', $attachment);

        return $this->attachments->download($attachment);
    }

    public function preview(Attachment $attachment): StreamedResponse
    {
        $this->authorize('view', $attachment);

        abort_unless($attachment->is_image, 404, 'Lampiran bukan gambar.');

        return $this->attachments->preview($attachment);
    }
}
