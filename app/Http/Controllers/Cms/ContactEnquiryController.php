<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactEnquiryController extends Controller
{
    public function index()
    {
        return Inertia::render(
            'Cms/ContactEnquiries/Index',
            [
                'items' => ContactMessage::query()
                    ->latest()
                    ->paginate(15),
            ]
        );
    }

    public function show(ContactMessage $contact)
    {
        if ($contact->status === 'new') {
            $contact->update([
                'status' => 'read',
            ]);

            $contact->refresh();
        }

        return Inertia::render(
            'Cms/ContactEnquiries/Show',
            [
                'item' => $contact,
            ]
        );
    }

    public function update(
        Request $request,
        ContactMessage $contact
    ) {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:new,read,contacted,closed',
            ],
        ]);

        $contact->update([
            'status' => $validated['status'],
        ]);

        return back()->with(
            'success',
            'Contact enquiry status updated successfully.'
        );
    }
}