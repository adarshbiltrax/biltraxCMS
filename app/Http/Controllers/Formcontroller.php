<?php
namespace App\Http\Controllers;

use App\Mail\DemoEnquiryReceived;
use App\Mail\CareerApplicationReceived;
use App\Models\CareerApplication;
use App\Models\DemoRequest;
use App\Models\EmailRecipientAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Formcontroller extends Controller{

 public function addDemo(Request $request){
    try {
        if (!$request->isMethod('POST')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Use Post method',
            ], 405);
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:150',
            'work_email' => 'required|email|max:150',
            'company' => 'required|string|max:150',
            'role' => 'required|string|max:100',
            'role_other' => 'nullable|required_if:role,Others|string|max:150',
            'company_website' => 'nullable|string|max:150',
            'official_mobile' => ['required', 'regex:/^\d{10,15}$/'],
            'products_sold' => 'required|string|max:150',
            'sectors_of_interest' => 'nullable|array',
            'sectors_of_interest.*' => 'string|max:100',
            'sector_other' => 'nullable|string|max:150',
            'specific_requirements' => 'required|string',
            'consent' => 'required|accepted',
        ]);

        $recipients = EmailRecipientAddress::activeEmailsForType('enquiry');
        if (empty($recipients)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Enquiry email recipients are not configured.',
            ], 503);
        }

        // save enquiry
        $enquery = DemoRequest::create($validated + [
            'consent' => filter_var($validated['consent'], FILTER_VALIDATE_BOOLEAN),
            'status' => 'new',
        ]);

        Mail::to($recipients)->send(new DemoEnquiryReceived($enquery));

        return response()->json([
            'status' => 'success',
            'message' => 'Your enquiry has been received.',
            'data' => $enquery,
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed.',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Internal server issue: ' . $e->getMessage(),
        ], 500);
    }
}
  
  // careers page
   public function CareerForm(Request $r)
    {
        $v = $r->validate([
            'full_name' => 'required|string|max:150',
            'email' => 'required|email|max:255',
            'mobile' => ['required', 'string', 'regex:/^(?:\+91)?[6-9][0-9]{9}$/'],
            'current_location' => 'required|string|max:255',
            'area_of_interest' => 'required|string|max:150',
            'experience' => 'required|string|max:100',
            'highest_qualification' => 'required|string|max:255',
            'linkedin_profile' => 'nullable|url|max:500',
            'interest_statement' => 'nullable|string|max:10000',
            'consent' => 'accepted',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ], [
            'mobile.regex' => 'Please enter a valid 10-digit Indian mobile number.',
        ]);

        // $recipientConfig = EmailRecipientAddress::activeEmailsForType('enquiry');;
        // $recipients = array_values(array_filter(
        //     array_map('trim', explode(',', $recipientConfig))
        // ));
        $recipients = EmailRecipientAddress::activeEmailsForType('career');
        if (empty($recipients)) {
            return response()->json([
                'message' => 'Career application email recipients are not configured.',
            ], 503);
        }

        $file = $r->file('resume');
        $path = $file->store('careers/' . now()->format('Y/m'), 's3');
        try {
            $application = CareerApplication::create(collect($v)->except('resume')->all() + [
                'resume_path' => $path,
                'resume_original_name' => Str::limit($file->getClientOriginalName(), 255, ''),
                'resume_mime' => $file->getMimeType(),
                'resume_size' => $file->getSize(),
                'status' => 'new',
            ]);
        } catch (\Throwable $e) {
            Storage::disk('s3')->delete($path);
            throw $e;
        }

        Mail::to($recipients)->send(new CareerApplicationReceived($application));

        return response()->json(['message' => 'Your application has been received.'], 201);
    }
}

?>