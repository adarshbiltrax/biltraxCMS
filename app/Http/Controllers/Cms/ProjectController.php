<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\WebsiteProject;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $query = WebsiteProject::query();

        if ($request->filled('q')) {

            $search = $request->input('q');

            $query->where(function ($q) use ($search) {

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
                    'location',
                    'like',
                    "%{$search}%"
                );

            });
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


    public function create(): Response
    {
        return Inertia::render(
            'Cms/Projects/Form',
            [
                'project' => null,
            ]
        );
    }


    public function store(Request $request)
    {
        $data = $this->validateProject(
            $request
        );

        WebsiteProject::create($data);

        return redirect()
            ->route('cms.projects.index')
            ->with(
                'success',
                'Project created successfully.'
            );
    }


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


    public function update(
        Request $request,
        WebsiteProject $project
    ) {

        $data = $this->validateProject(
            $request
        );

        $project->update($data);

        return redirect()
            ->route('cms.projects.index')
            ->with(
                'success',
                'Project updated successfully.'
            );
    }


    public function destroy(
        WebsiteProject $project
    ) {

        $project->delete();

        return redirect()
            ->route('cms.projects.index')
            ->with(
                'success',
                'Project deleted successfully.'
            );
    }


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


        $data['sort_order'] =
            (int) ($data['sort_order'] ?? 0);

        $data['is_featured'] =
            $request->boolean(
                'is_featured'
            );


        /*
        |--------------------------------------------------------------------------
        | Automatically set published date
        |--------------------------------------------------------------------------
        */

        if (
            $data['status'] === 'published'
            &&
            empty($data['published_at'])
        ) {
            $data['published_at'] = now();
        }


        return $data;
    }
}