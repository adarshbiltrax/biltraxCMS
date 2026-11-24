<?php

namespace App\Mail;

use App\Models\CareerApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CareerApplicationReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public CareerApplication $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'New Career Application Received');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.career-application');
    }

    public function attachments(): array
    {
        return [
            Attachment::fromStorageDisk('s3', $this->application->resume_path)
                ->as($this->application->resume_original_name)
                ->withMime($this->application->resume_mime),
        ];
    }
}