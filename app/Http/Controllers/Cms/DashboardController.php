<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;

use App\Models\WebsiteProject;
use App\Models\Career;
use App\Models\Enquiry;
use App\Models\ContactMessage;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Cms/Dashboard', [

            'publishedProjects' => WebsiteProject::where(
                'status',
                'published'
            )->count(),

            'publishedCareers' => Career::where(
                'status',
                'published'
            )->count(),

            'newContacts' => ContactMessage::where(
                'status',
                'new'
            )->count(),

            'newEnquiries' => Enquiry::where(
                'status',
                'new'
            )->count(),

            'recentContacts' => ContactMessage::query()
                ->latest()
                ->limit(8)
                ->get(),

            'recentEnquiries' => Enquiry::query()
                ->latest()
                ->limit(8)
                ->get(),
        ]);
    }
}