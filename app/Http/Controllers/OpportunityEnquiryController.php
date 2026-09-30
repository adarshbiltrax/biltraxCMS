<?php

namespace App\Http\Controllers;

use App\Models\Career;
use App\Models\OpportunityEnquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OpportunityEnquiryController extends Controller
{
    public function store(
        Request $request
    ): JsonResponse {

        $validated =
            $request->validate([

                'career_id' => [
                    'nullable',
                    'integer',
                    'exists:careers,id',
                ],

                'position_applied_for' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'first_name' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'last_name' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'email' => [
                    'required',
                    'email',
                    'max:255',
                ],

                'mobile_number' => [
                    'required',
                    'string',
                    'max:30',
                ],

                'cv_link' => [
                    'required',
                    'url',
                    'max:2048',
                ],

                'qualification' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'experience_years' => [
                    'required',
                    'numeric',
                    'min:0',
                    'max:60',
                ],

                'message' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'location_confirmed' => [
                    'accepted',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Get position automatically from career
        |--------------------------------------------------------------------------
        */

        if (
            !empty(
                $validated['career_id']
            )
        ) {

            $career =
                Career::find(
                    $validated[
                        'career_id'
                    ]
                );


            if (
                $career &&
                empty(
                    $validated[
                        'position_applied_for'
                    ]
                )
            ) {

                $validated[
                    'position_applied_for'
                ] =
                    $career->job_title;
            }
        }


        $validated[
            'location_confirmed'
        ] = true;


        $validated['status'] =
            'new';


        $item =
            OpportunityEnquiry::create(
                $validated
            );


        return response()->json([
            'success' => true,

            'message' =>
                'Your application has been submitted successfully.',

            'data' => [
                'id' => $item->id,
            ],
        ], 201);
    }
}