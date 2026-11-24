<x-mail::message>
# New Career Application

A new career application has been submitted.

**Full Name:** {{ $application->full_name }}

**Email:** {{ $application->email }}

**Mobile:** {{ $application->mobile }}

**Current Location:** {{ $application->current_location }}

**Area of Interest:** {{ $application->area_of_interest }}

**Experience:** {{ $application->experience }}

**Highest Qualification:** {{ $application->highest_qualification }}

**LinkedIn Profile:** {{ $application->linkedin_profile ?? 'Not provided' }}

**Interest Statement:** {{ $application->interest_statement ?? 'Not provided' }}

The applicant's resume is attached to this email.

Thanks,  
Biltrax Team
</x-mail::message>