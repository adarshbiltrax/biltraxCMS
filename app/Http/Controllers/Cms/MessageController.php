<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function enquiries()
    {
        return Inertia::render(
            'Cms/Enquiries/Index',
            [
                'items' => Enquiry::query()
                    ->latest()
                    ->paginate(15),
            ]
        );
    }

    public function enquiryShow(
        Enquiry $enquiry
    ) {
        if ($enquiry->status === 'new') {
            $enquiry->update([
                'status' => 'reviewed',
            ]);

            $enquiry->refresh();
        }

        return Inertia::render(
            'Cms/Enquiries/Show',
            [
                'item' => $enquiry,
            ]
        );
    }

    public function enquiryUpdate(
        Request $request,
        Enquiry $enquiry
    ) {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:new,reviewed,contacted,closed',
            ],
        ]);

        $enquiry->update([
            'status' => $validated['status'],
        ]);

        return back()->with(
            'success',
            'Enquiry status updated successfully.'
        );
    }
}