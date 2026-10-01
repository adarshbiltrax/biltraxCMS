<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\WebsiteProject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Project Listing
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): Response
    {
        $query = WebsiteProject::query();


        /*
        |--------------------------------------------------------------------------
        | CMS Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('q')) {

            $search = trim(
                (string) $request->input('q')
            );


            $query->where(
                function ($q) use ($search) {

                    $q->where(
                        'project_name',
                        'like',
                        "%{$search}%"
                    )

                    ->orWhere(
                        'sector',
                        'like',
                        "%{$search}%"
                    )

                    ->orWhere(
                        'project_type',
                        'like',
                        "%{$search}%"
                    )

                    ->orWhere(
                        'project_stage',
                        'like',
                        "%{$search}%"
                    )

                    ->orWhere(
                        'city',
                        'like',
                        "%{$search}%"
                    )

                    ->orWhere(
                        'state',
                        'like',
                        "%{$search}%"
                    )

                    ->orWhere(
                        'region',
                        'like',
                        "%{$search}%"
                    )

                    ->orWhere(
                        'location',
                        'like',
                        "%{$search}%"
                    );
                }
            );
        }


        return Inertia::render(
            'Cms/Projects/Index',
            [
                'projects' =>
                    $query
                        ->orderBy('sort_order')
                        ->orderByDesc('id')
                        ->paginate(15)
                        ->withQueryString(),

                'filters' => [
                    'q' =>
                        $request->input(
                            'q',
                            ''
                        ),
                ],
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Project
    |--------------------------------------------------------------------------
    */

    public function create(
        Request $request
    ): Response {

        $project = null;


        /*
        |--------------------------------------------------------------------------
        | BX1 Import
        |--------------------------------------------------------------------------
        */

        if (
            $request->input('source')
            ===
            'bx1'
        ) {

            $project = [

                /*
                |--------------------------------------------------------------------------
                | BX1 Identification
                |--------------------------------------------------------------------------
                */

                'project_name' =>
                    $request->input(
                        'project_name',
                        ''
                    ),

                'source_project_id' =>
                    $request->input(
                        'source_project_id',
                        ''
                    ),


                /*
                |--------------------------------------------------------------------------
                | BX1 Classification
                |--------------------------------------------------------------------------
                */

                'sector' =>
                    $request->input(
                        'sector',
                        ''
                    ),

                'project_type' =>
                    $request->input(
                        'project_type',
                        ''
                    ),


                /*
                |--------------------------------------------------------------------------
                | BX1 status → CMS project_stage
                |--------------------------------------------------------------------------
                */

                'project_stage' =>
                    $request->input(
                        'project_stage',
                        ''
                    ),


                /*
                |--------------------------------------------------------------------------
                | BX1 Location
                |--------------------------------------------------------------------------
                */

                'city' =>
                    $request->input(
                        'city',
                        ''
                    ),

                'state' =>
                    $request->input(
                        'state',
                        ''
                    ),

                'region' =>
                    $request->input(
                        'region',
                        ''
                    ),

                'location' =>
                    $request->input(
                        'location',
                        ''
                    ),


                /*
                |--------------------------------------------------------------------------
                | CMS-specific Fields
                |--------------------------------------------------------------------------
                */

                'summary' => '',

                /*
                | CMS publishing status.
                |
                | BX1 status does NOT go here.
                | BX1 status is project_stage.
                */

                'status' => 'draft',

                'published_at' => null,

                'sort_order' => 0,

                'is_featured' => false,


                /*
                |--------------------------------------------------------------------------
                | BX1 Import Flag
                |--------------------------------------------------------------------------
                */

                '_source' => 'bx1',
            ];
        }


        return Inertia::render(
            'Cms/Projects/Form',
            [
                'project' => $project,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ) {

        $data =
            $this->validateProject(
                $request
            );


        WebsiteProject::create(
            $data
        );


        return redirect()
            ->route(
                'cms.projects.index'
            )
            ->with(
                'success',
                'Project created successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    public function edit(
        WebsiteProject $project
    ): Response {

        return Inertia::render(
            'Cms/Projects/Form',
            [
                'project' => $project,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        WebsiteProject $project
    ) {

        $data =
            $this->validateProject(
                $request
            );


        $project->update(
            $data
        );


        return redirect()
            ->route(
                'cms.projects.index'
            )
            ->with(
                'success',
                'Project updated successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function destroy(
        WebsiteProject $project
    ) {

        $project->delete();


        return redirect()
            ->route(
                'cms.projects.index'
            )
            ->with(
                'success',
                'Project deleted successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    private function validateProject(
        Request $request
    ): array {

        $data =
            $request->validate([

                'project_name' =>
                    'required|string|max:255',

                'source_project_id' =>
                    'nullable|integer',

                'sector' =>
                    'nullable|string|max:255',

                'project_type' =>
                    'nullable|string|max:255',

                'project_stage' =>
                    'nullable|string|max:255',

                'city' =>
                    'nullable|string|max:255',

                'state' =>
                    'nullable|string|max:255',

                'region' =>
                    'nullable|string|max:255',

                'location' =>
                    'nullable|string|max:255',

                'summary' =>
                    'nullable|string',

                /*
                |--------------------------------------------------------------------------
                | CMS Publication Status
                |--------------------------------------------------------------------------
                */

                'status' =>
                    'required|in:draft,published',

                'published_at' =>
                    'nullable|date',

                'sort_order' =>
                    'nullable|integer|min:0',

                'is_featured' =>
                    'nullable|boolean',
            ]);


        /*
        |--------------------------------------------------------------------------
        | Normalize Values
        |--------------------------------------------------------------------------
        */

        $data['sort_order'] =
            (int) (
                $data['sort_order']
                ?? 0
            );


        $data['is_featured'] =
            $request->boolean(
                'is_featured'
            );


        /*
        |--------------------------------------------------------------------------
        | Automatically Set Published Date
        |--------------------------------------------------------------------------
        */

        if (
            $data['status']
                ===
                'published'
            &&
            empty(
                $data['published_at']
            )
        ) {

            $data['published_at'] =
                now();
        }


        return $data;
    }
}