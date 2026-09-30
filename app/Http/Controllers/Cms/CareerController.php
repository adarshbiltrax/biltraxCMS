<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Career;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

class CareerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render(
            'Cms/Careers/Index',
            [
                'careers' => Career::query()
                    ->orderBy('sort_order')
                    ->orderByDesc('id')
                    ->paginate(15),
            ]
        );
    }


    public function create(): Response
    {
        return Inertia::render(
            'Cms/Careers/Form',
            [
                'career' => null,
            ]
        );
    }


    public function store(Request $request)
    {
        $data = $this->validateCareer(
            $request
        );

        Career::create($data);

        return redirect()
            ->route('cms.careers.index')
            ->with(
                'success',
                'Career opportunity created successfully.'
            );
    }


    public function edit(
        Career $career
    ): Response {

        return Inertia::render(
            'Cms/Careers/Form',
            [
                'career' => $career,
            ]
        );
    }


    public function update(
        Request $request,
        Career $career
    ) {

        $data = $this->validateCareer(
            $request
        );

        $career->update($data);

        return redirect()
            ->route('cms.careers.index')
            ->with(
                'success',
                'Career opportunity updated successfully.'
            );
    }


    public function destroy(
        Career $career
    ) {

        $career->delete();

        return redirect()
            ->route('cms.careers.index')
            ->with(
                'success',
                'Career opportunity deleted successfully.'
            );
    }


    private function validateCareer(
        Request $request
    ): array {

        $data = $request->validate([

            'job_title' =>
                'required|string|max:255',

            'department' =>
                'nullable|string|max:255',

            'location' =>
                'nullable|string|max:255',

            'employment_type' =>
                'nullable|string|max:255',

            'experience' =>
                'nullable|string|max:255',

            'short_description' =>
                'nullable|string',

            'job_description' =>
                'nullable|string',

            'responsibilities' =>
                'nullable|string',

            'requirements' =>
                'nullable|string',

            'application_email' =>
                'nullable|email|max:255',

            'application_url' =>
                'nullable|url|max:2048',

            'status' =>
                'required|in:draft,published,closed',

            'closing_date' =>
                'nullable|date',

            'published_at' =>
                'nullable|date',

            'sort_order' =>
                'nullable|integer|min:0',
        ]);


        $data['sort_order'] =
            (int) ($data['sort_order'] ?? 0);


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