<?php
namespace App\Mail;
use App\Models\DemoRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DemoEnquiryReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public DemoRequest $demoRequest
    ) {}

    public function envelope(): \Illuminate\Mail\Mailables\Envelope
    {
        return new \Illuminate\Mail\Mailables\Envelope(
            subject: 'New Enquiry Received'
        );
    }

    public function content(): \Illuminate\Mail\Mailables\Content
    {
        return new \Illuminate\Mail\Mailables\Content(
            markdown: 'emails.demo-enquiry'
        );
    }
}
