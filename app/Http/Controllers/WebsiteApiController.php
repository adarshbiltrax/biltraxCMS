<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\WebsiteProject;
use App\Models\Career;
use App\Models\Enquiry;
use App\Models\ContactMessage;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WebsiteApiController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | PROJECTS
    |--------------------------------------------------------------------------
    */

    public function projects(): JsonResponse
    {
        $projects = WebsiteProject::query()
            ->where('status', 'published')
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(function ($project) {

                return [
                    'id' => $project->id,

                    'source_project_id' =>
                        $project->source_project_id,

                    /*
                    |--------------------------------------------------------------------------
                    | Current CMS field
                    |--------------------------------------------------------------------------
                    */

                    'project_name' =>
                        $project->project_name,

                    /*
                    |--------------------------------------------------------------------------
                    | Compatibility field for old website
                    |--------------------------------------------------------------------------
                    */

                    'name' =>
                        $project->project_name,

                    'title' =>
                        $project->project_name,


                    'sector' =>
                        $project->sector,


                    'project_type' =>
                        $project->project_type,

                    'type' =>
                        $project->project_type,


                    'project_stage' =>
                        $project->project_stage,

                    'stage' =>
                        $project->project_stage,


                    'city' =>
                        $project->city,

                    'state' =>
                        $project->state,

                    'location' =>
                        $project->location,


                    'summary' =>
                        $project->summary,


                    'status' =>
                        $project->status,


                    'is_featured' =>
                        (bool) $project->is_featured,


                    'published_at' =>
                        $project->published_at
                            ? $project->published_at->toISOString()
                            : null,


                    'updated_at' =>
                        $project->updated_at
                            ? $project->updated_at->toISOString()
                            : null,
                ];
            })
            ->values();


        return response()->json([
            'success' => true,

            'count' =>
                $projects->count(),

            'data' =>
                $projects,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | CAREERS
    |--------------------------------------------------------------------------
    */

public function careers(): JsonResponse
{
    $careers = Career::query()
        ->where('status', 'published')

        ->where(function ($query) {
            $query
                ->whereNull('closing_date')
                ->orWhereDate(
                    'closing_date',
                    '>=',
                    today()
                );
        })

        ->orderBy('sort_order')
        ->orderByDesc('published_at')
        ->orderByDesc('id')

        ->get()

        ->map(function ($career) {

            return [
                'id' => $career->id,

                /*
                |--------------------------------------------------------------------------
                | Title
                |--------------------------------------------------------------------------
                */

                'job_title' =>
                    $career->job_title,

                // Compatibility with old website
                'title' =>
                    $career->job_title,


                /*
                |--------------------------------------------------------------------------
                | Meta Information
                |--------------------------------------------------------------------------
                */

                'department' =>
                    $career->department,

                'location' =>
                    $career->location,

                'employment_type' =>
                    $career->employment_type,

                // Compatibility
                'type' =>
                    $career->employment_type,

                'experience' =>
                    $career->experience,


                /*
                |--------------------------------------------------------------------------
                | Description
                |--------------------------------------------------------------------------
                */

                'short_description' =>
                    $career->short_description,

                // Compatibility
                'summary' =>
                    $career->short_description,

                'job_description' =>
                    $career->job_description,


                /*
                |--------------------------------------------------------------------------
                | Duties & Responsibilities
                |--------------------------------------------------------------------------
                */

                'responsibilities' =>
                    $career->responsibilities,

                /*
                | IMPORTANT:
                | Your original website uses "duties".
                | Keep this alias so existing UI continues working.
                */

                'duties' =>
                    $career->responsibilities,


                /*
                |--------------------------------------------------------------------------
                | Requirements
                |--------------------------------------------------------------------------
                */

                'requirements' =>
                    $career->requirements,


                /*
                |--------------------------------------------------------------------------
                | Application
                |--------------------------------------------------------------------------
                */

                'application_email' =>
                    $career->application_email,

                'application_url' =>
                    $career->application_url,


                /*
                |--------------------------------------------------------------------------
                | Status
                |--------------------------------------------------------------------------
                */

                'status' =>
                    $career->status,

                'closing_date' =>
                    $career->closing_date
                        ? $career->closing_date->format('Y-m-d')
                        : null,

                'published_at' =>
                    $career->published_at
                        ? $career->published_at->toISOString()
                        : null,
            ];
        })

        ->values();


    return response()->json([
        'success' => true,

        'count' =>
            $careers->count(),

        'data' =>
            $careers,
    ]);
}

    /*
    |--------------------------------------------------------------------------
    | ENQUIRY
    |--------------------------------------------------------------------------
    */

    public function enquiry(
        Request $request
    ): JsonResponse {

        $data =
            $request->validate([

                'name' =>
                    'required|string|max:255',

                'company' =>
                    'nullable|string|max:255',

                'designation' =>
                    'nullable|string|max:255',

                'email' =>
                    'required|email|max:255',

                'phone' =>
                    'nullable|string|max:50',

                'enquiry_type' =>
                    'nullable|string|max:255',

                'products' =>
                    'nullable',

                'sectors' =>
                    'nullable',

                'regions' =>
                    'nullable',

                'message' =>
                    'nullable|string',
            ]);


        foreach (
            [
                'products',
                'sectors',
                'regions',
            ] as $field
        ) {

            if (
                isset($data[$field])
                &&
                is_array($data[$field])
            ) {

                $data[$field] =
                    implode(
                        ', ',
                        $data[$field]
                    );
            }
        }


        $data['status'] = 'new';


        $enquiry =
            Enquiry::create(
                $data
            );


        return response()->json(
            [
                'success' => true,

                'message' =>
                    'Enquiry submitted successfully.',

                'id' =>
                    $enquiry->id,
            ],
            201
        );
    }


    /*
    |--------------------------------------------------------------------------
    | CONTACT
    |--------------------------------------------------------------------------
    */

    public function contact(
        Request $request
    ): JsonResponse {

        $data =
            $request->validate([

                'name' =>
                    'required|string|max:255',

                'company' =>
                    'nullable|string|max:255',

                'email' =>
                    'required|email|max:255',

                'phone' =>
                    'nullable|string|max:50',

                'subject' =>
                    'nullable|string|max:255',

                'message' =>
                    'nullable|string',
            ]);


        $data['status'] = 'new';


        $contact =
            ContactMessage::create(
                $data
            );


        return response()->json(
            [
                'success' => true,

                'message' =>
                    'Message submitted successfully.',

                'id' =>
                    $contact->id,
            ],
            201
        );
    }
}