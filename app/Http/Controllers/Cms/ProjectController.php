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
                'projects' => $query
                    ->orderBy('sort_order')
                    ->orderByDesc('id')
                    ->paginate(15)
                    ->withQueryString(),

                'filters' => [
                    'q' => $request->input(
                        'q',
                        ''
                    ),
                ],
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Prepare BX1 / BX2 Import
    |--------------------------------------------------------------------------
    */

    public function prepareImport(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Validate Import Data
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'source' =>
                'required|string|in:bx1,bx2',

            'source_project_id' =>
                'required|integer',

            'project_name' =>
                'required|string|max:255',

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
        ]);


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Source Project
        |--------------------------------------------------------------------------
        |
        | If this source_project_id already exists in the CMS project table,
        | return a validation error.
        |
        | Bx1Projects.jsx catches this specific error and displays it inside
        | the "Project Already Added" modal.
        |
        */

        $existingProject = WebsiteProject::where(
            'source_project_id',
            $validated['source_project_id']
        )->first();


        if ($existingProject) {

            return back()->withErrors([
                'source_project_id' =>
                    'This project has already been added to the CMS project list.',
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Normalize Source
        |--------------------------------------------------------------------------
        */

        $source = strtolower(
            trim(
                (string) $validated['source']
            )
        );


        /*
        |--------------------------------------------------------------------------
        | Prepare Project
        |--------------------------------------------------------------------------
        */

        $project = [

            /*
            |--------------------------------------------------------------------------
            | Source Identification
            |--------------------------------------------------------------------------
            */

            'project_name' =>
                $validated['project_name'],

            'source_project_id' =>
                $validated['source_project_id'],


            /*
            |--------------------------------------------------------------------------
            | Classification
            |--------------------------------------------------------------------------
            */

            'sector' =>
                $validated['sector'] ?? '',

            'project_type' =>
                $validated['project_type'] ?? '',

            'project_stage' =>
                $validated['project_stage'] ?? '',


            /*
            |--------------------------------------------------------------------------
            | Location
            |--------------------------------------------------------------------------
            */

            'city' =>
                $validated['city'] ?? '',

            'state' =>
                $validated['state'] ?? '',

            'region' =>
                $validated['region'] ?? '',

            'location' =>
                $validated['location'] ?? '',


            /*
            |--------------------------------------------------------------------------
            | CMS Fields
            |--------------------------------------------------------------------------
            */

            'summary' => '',

            'status' => 'draft',

            'published_at' => null,

            'sort_order' => 0,

            'is_featured' => false,


            /*
            |--------------------------------------------------------------------------
            | Import Source
            |--------------------------------------------------------------------------
            */

            '_source' => $source,
        ];


        /*
        |--------------------------------------------------------------------------
        | Store Import Temporarily In Session
        |--------------------------------------------------------------------------
        */

        $request->session()->put(
            'cms_project_import',
            $project
        );


        /*
        |--------------------------------------------------------------------------
        | Redirect To Clean Create URL
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route(
                'cms.projects.create'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Project
    |--------------------------------------------------------------------------
    */

    public function create(Request $request): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Get Imported Project
        |--------------------------------------------------------------------------
        */

        $project = $request
            ->session()
            ->pull(
                'cms_project_import'
            );


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

    public function store(Request $request)
    {
        $data = $this->validateProject(
            $request
        );


        /*
        |--------------------------------------------------------------------------
        | Final Duplicate Protection
        |--------------------------------------------------------------------------
        |
        | This is a second protection layer.
        |
        | Even if somebody manually submits /cms/projects, the same
        | source_project_id cannot be inserted twice through this controller.
        |
        */

        if (
            !empty($data['source_project_id'])
            &&
            WebsiteProject::where(
                'source_project_id',
                $data['source_project_id']
            )->exists()
        ) {

            return back()->withErrors([
                'source_project_id' =>
                    'This project has already been added to the CMS project list.',
            ]);
        }


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

        $data = $this->validateProject(
            $request
        );


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Source Project During Edit
        |--------------------------------------------------------------------------
        |
        | Ignore the current CMS record itself.
        |
        */

        if (
            !empty($data['source_project_id'])
            &&
            WebsiteProject::where(
                'source_project_id',
                $data['source_project_id']
            )
            ->where(
                'id',
                '!=',
                $project->id
            )
            ->exists()
        ) {

            return back()->withErrors([
                'source_project_id' =>
                    'This source project ID is already assigned to another CMS project.',
            ]);
        }


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

        $data = $request->validate([

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

        $data['sort_order'] = (int) (
            $data['sort_order'] ?? 0
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
            $data['status'] === 'published'
            &&
            empty(
                $data['published_at']
            )
        ) {

            $data['published_at'] = now();
        }


        return $data;
    }
}