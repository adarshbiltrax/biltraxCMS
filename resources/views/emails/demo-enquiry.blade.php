<x-mail::message>
# New Demo Enquiry

A new demo request has been submitted.

**Full Name:** {{ $demoRequest->full_name }}

**Work Email:** {{ $demoRequest->work_email }}

**Company:** {{ $demoRequest->company }}

**Role:** {{ $demoRequest->role }}

**Official Mobile:** {{ $demoRequest->official_mobile }}

**Company Website:** {{ $demoRequest->company_website ?? 'Not provided' }}

**Products Sold:** {{ $demoRequest->products_sold }}

**Sectors of Interest:**
{{ implode(', ', $demoRequest->sectors_of_interest ?? []) }}

**Specific Requirements:**
{{ $demoRequest->specific_requirements ?? 'Not provided' }}

Thanks,  
Biltrax Team
{{-- {{ config('app.name') }} --}}
</x-mail::message>
