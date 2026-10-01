<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class Bx1ProjectController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | BX1 Project Browser
    |--------------------------------------------------------------------------
    */

    public function index(): Response
    {
        return Inertia::render(
            'Cms/Projects/Bx1Projects'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Search BX1 Projects
    |--------------------------------------------------------------------------
    */

    public function search(Request $request): JsonResponse
    {
        $page = max(
            1,
            (int) $request->input('page', 1)
        );

        /*
        |--------------------------------------------------------------------------
        | Maximum 50 projects per request
        |--------------------------------------------------------------------------
        */

        $perPage = 50;


        /*
        |--------------------------------------------------------------------------
        | Search Query
        |--------------------------------------------------------------------------
        */

        $search = trim(
            (string) $request->input('q', '')
        );


        /*
        |--------------------------------------------------------------------------
        | BX1 Filters
        |--------------------------------------------------------------------------
        */

        $filters = [];

        if ($search !== '') {

            $filters[] = [
                'table_name' => 'projects',

                'column_name' => 'projects.name',

                'column_type' => 'column',

                'operator' => 'contains',

                'value' => $search,
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | BX1 Request Payload
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | minimal = false
        |
        | This makes BX1 return the complete ProjectTestResource data:
        |
        | status
        | state name
        | region
        | sector name
        | building_use
        | categories
        | project images
        | project companies
        | construction information
        | etc.
        |
        |--------------------------------------------------------------------------
        */

        $payload = [
            'page' => $page,

            'minimal' => false,

            'per_page' => $perPage,

            'conjunction' => 'AND',

            'filters' => $filters,

            'location_type' => 'projects',

            'sort_by_column' => [
                'column' => 'updated_at',
                'order' => 'desc',
                'sortBy' => 'updatedAt',
            ],
        ];


        /*
        |--------------------------------------------------------------------------
        | BX1 Configuration
        |--------------------------------------------------------------------------
        */

        $baseUrl = rtrim(
            (string) config(
                'services.bx1.url'
            ),
            '/'
        );

        $token = (string) config(
            'services.bx1.token'
        );


        if (
            $baseUrl === ''
            ||
            $token === ''
        ) {

            return response()->json([
                'success' => false,

                'message' =>
                    'BX1 API configuration is missing.',
            ], 500);
        }


        try {

            /*
            |--------------------------------------------------------------------------
            | Send Request to BX1
            |--------------------------------------------------------------------------
            */

            $response = Http::withToken($token)
                ->acceptJson()
                ->asJson()
                ->timeout(60)
                ->post(
                    $baseUrl . '/project/search',
                    $payload
                );


            /*
            |--------------------------------------------------------------------------
            | Authentication Error
            |--------------------------------------------------------------------------
            */

            if ($response->status() === 401) {

                Log::error(
                    'BX1 API authentication failed.',
                    [
                        'response' =>
                            $response->body(),
                    ]
                );


                return response()->json([
                    'success' => false,

                    'message' =>
                        'BX1 authentication failed. Check BX1_API_TOKEN.',
                ], 401);
            }


            /*
            |--------------------------------------------------------------------------
            | BX1 API Error
            |--------------------------------------------------------------------------
            */

            if ($response->failed()) {

                Log::error(
                    'BX1 project API failed.',
                    [
                        'status' =>
                            $response->status(),

                        'response' =>
                            $response->body(),

                        'payload' =>
                            $payload,
                    ]
                );


                return response()->json([
                    'success' => false,

                    'message' =>
                        'BX1 API returned an error.',

                    'bx1_status' =>
                        $response->status(),

                    'bx1_response' =>
                        $response->json()
                        ?: $response->body(),

                ], $response->status());
            }


            /*
            |--------------------------------------------------------------------------
            | BX1 Response
            |--------------------------------------------------------------------------
            */

            $result = $response->json();


            return response()->json([
                'success' => true,

                'data' =>
                    $result['data'] ?? [],

                'links' =>
                    $result['links'] ?? [],

                'meta' =>
                    $result['meta'] ?? [
                        'current_page' => $page,
                        'last_page' => 1,
                        'per_page' => $perPage,
                        'total' => 0,
                    ],
            ]);

        } catch (
            \Illuminate\Http\Client\ConnectionException $e
        ) {

            /*
            |--------------------------------------------------------------------------
            | Connection Error
            |--------------------------------------------------------------------------
            */

            Log::error(
                'BX1 connection failed.',
                [
                    'message' =>
                        $e->getMessage(),
                ]
            );


            return response()->json([
                'success' => false,

                'message' =>
                    'CMS could not connect to the BX1 server.',

                'error' =>
                    app()->environment('local')
                        ? $e->getMessage()
                        : null,

            ], 503);

        } catch (\Throwable $e) {

            /*
            |--------------------------------------------------------------------------
            | Unexpected Error
            |--------------------------------------------------------------------------
            */

            Log::error(
                'BX1 project API exception.',
                [
                    'message' =>
                        $e->getMessage(),

                    'file' =>
                        $e->getFile(),

                    'line' =>
                        $e->getLine(),
                ]
            );


            return response()->json([
                'success' => false,

                'message' =>
                    'Unexpected error while retrieving BX1 projects.',

                'error' =>
                    app()->environment('local')
                        ? $e->getMessage()
                        : null,

            ], 500);
        }
    }
}