<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\OpportunityEnquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OpportunityEnquiryController extends Controller
{
    public function index(
        Request $request
    ): Response {

        $query =
            OpportunityEnquiry::query()
                ->with(
                    'career:id,job_title'
                );


        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('q')) {

            $search =
                trim(
                    (string)
                    $request->q
                );


            $query->where(
                function ($q)
                use ($search) {

                    $q
                        ->where(
                            'first_name',
                            'like',
                            "%{$search}%"
                        )

                        ->orWhere(
                            'last_name',
                            'like',
                            "%{$search}%"
                        )

                        ->orWhere(
                            'email',
                            'like',
                            "%{$search}%"
                        )

                        ->orWhere(
                            'mobile_number',
                            'like',
                            "%{$search}%"
                        )

                        ->orWhere(
                            'position_applied_for',
                            'like',
                            "%{$search}%"
                        );
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        if (
            $request->filled(
                'status'
            )
        ) {

            $query->where(
                'status',
                $request->status
            );
        }


        return Inertia::render(
            'Cms/OpportunityEnquiries/Index',
            [
                'items' =>
                    $query
                        ->latest()
                        ->paginate(15)
                        ->withQueryString(),

                'filters' => [
                    'q' =>
                        $request->q,

                    'status' =>
                        $request->status,
                ],
            ]
        );
    }


    public function show(
        OpportunityEnquiry
            $opportunityEnquiry
    ): Response {

        /*
        |--------------------------------------------------------------------------
        | Automatically mark new as reviewed
        |--------------------------------------------------------------------------
        */

        if (
            $opportunityEnquiry
                ->status === 'new'
        ) {

            $opportunityEnquiry
                ->update([
                    'status' =>
                        'reviewed',
                ]);


            $opportunityEnquiry
                ->refresh();
        }


        $opportunityEnquiry
            ->load(
                'career:id,job_title'
            );


        return Inertia::render(
            'Cms/OpportunityEnquiries/Show',
            [
                'item' =>
                    $opportunityEnquiry,
            ]
        );
    }


    public function update(
        Request $request,
        OpportunityEnquiry
            $opportunityEnquiry
    ) {

        $validated =
            $request->validate([
                'status' => [
                    'required',
                    'in:new,reviewed,contacted,closed',
                ],
            ]);


        $opportunityEnquiry
            ->update([
                'status' =>
                    $validated[
                        'status'
                    ],
            ]);


        return back()->with(
            'success',
            'Opportunity enquiry status updated successfully.'
        );
    }
}