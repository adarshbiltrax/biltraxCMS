<?php



namespace App\Http\Controllers\Cms;



use App\Http\Controllers\Controller;

use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Http;

use Illuminate\Support\Facades\Log;

use Inertia\Inertia;

use Inertia\Response;

use RuntimeException;



class Bx1ProjectController extends Controller

{

    /*

    |--------------------------------------------------------------------------

    | BX1 Project Browser

    |--------------------------------------------------------------------------

    */



    public function index(): Response

    {

        return Inertia::render('Cms/Projects/Bx1Projects');

    }





    /*

    |--------------------------------------------------------------------------

    | Search BX1 Projects

    |--------------------------------------------------------------------------

    */



    public function search(Request $request): JsonResponse

    {

        /*

        |--------------------------------------------------------------------------

        | Page

        |--------------------------------------------------------------------------

        */



        $page = max(

            1,

            (int) $request->input('page', 1)

        );





        /*

        |--------------------------------------------------------------------------

        | 50 Projects Per Request

        |--------------------------------------------------------------------------

        */



        $perPage = 50;





        /*

        |--------------------------------------------------------------------------

        | Selected Source

        |--------------------------------------------------------------------------

        |

        | Supported:

        |

        | bx1

        | bx2

        |

        | Default = bx1

        |

        */



        $source = strtolower(

            trim(

                (string) $request->input(

                    'source',

                    'bx1'

                )

            )

        );



        if (!in_array($source, ['bx1', 'bx2'], true)) {

            $source = 'bx1';

        }





        /*

        |--------------------------------------------------------------------------

        | Search Text

        |--------------------------------------------------------------------------

        */



        $search = trim(

            (string) $request->input(

                'q',

                ''

            )

        );





        /*

        |--------------------------------------------------------------------------

        | Updated Days Filter

        |--------------------------------------------------------------------------

        |

        | Allowed:

        |

        | 7

        | 15

        | 30

        | 45

        | 60

        | 90

        | 120

        |

        | Default = 120

        |

        */



        $allowedDays = $source === 'bx2'
            ? [7, 15, 30]
            : [7, 15, 30, 45, 60, 90, 120];



        $defaultDays = $source === 'bx2'
            ? 30
            : 120;



        $days = (int) $request->input(

            'days',

            $defaultDays

        );



        if (!in_array($days, $allowedDays, true)) {

            $days = $defaultDays;

        }





        /*

        |--------------------------------------------------------------------------

        | Project Updated Date Range

        |--------------------------------------------------------------------------

        |

        | API format:

        |

        | DD-MM-YYYY

        |

        */



        $endDate = now()->format('d-m-Y');



        $startDate = now()

            ->subDays($days)

            ->format('d-m-Y');





        /*

        |--------------------------------------------------------------------------

        | API Payload

        |--------------------------------------------------------------------------

        */



        $payload = [

            'project_updated_date_range' => [

                [

                    'start_date' => $startDate,

                    'end_date' => $endDate,

                ],

            ],

        ];





        /*

        |--------------------------------------------------------------------------

        | Optional API Search

        |--------------------------------------------------------------------------

        |

        | Only added when BX_API_SEARCH_KEY is configured.

        |

        | We do not invent an API parameter name.

        |

        */



        $searchKey = trim(

            (string) config(

                'services.biltrax.search_key',

                ''

            )

        );



        if (

            $search !== ''

            &&

            $searchKey !== ''

        ) {

            $payload[$searchKey] = $search;

        }





        /*

        |--------------------------------------------------------------------------

        | Add Per Page If API Supports It

        |--------------------------------------------------------------------------

        */



        $payload['per_page'] = $perPage;





        try {



            /*

            |--------------------------------------------------------------------------

            | BX1

            |--------------------------------------------------------------------------

            */



            if ($source === 'bx1') {



                $accessToken =

                    $this->getBx1AccessToken();



                $searchUrl =

                    (string) config(

                        'services.bx1.search_url'

                    );



                if ($searchUrl === '') {

                    throw new RuntimeException(

                        'BX1 search URL is not configured.'

                    );

                }





                /*

                |--------------------------------------------------------------------------

                | BX1 Project Search

                |--------------------------------------------------------------------------

                */



                $response = Http::withToken(

                    $accessToken

                )

                    ->acceptJson()

                    ->asJson()

                    ->timeout(60)

                    ->post(

                        $searchUrl . '?page=' . $page,

                        $payload

                    );

            }





            /*

            |--------------------------------------------------------------------------

            | BX2

            |--------------------------------------------------------------------------

            */



            else {



                $accessToken =

                    $this->getBx2AccessToken();



                $searchUrl =

                    (string) config(

                        'services.bx2.search_url'

                    );



                if ($searchUrl === '') {

                    throw new RuntimeException(

                        'BX2 search URL is not configured.'

                    );

                }





                /*

                |--------------------------------------------------------------------------

                | BX2 Project Search

                |--------------------------------------------------------------------------

                */



                $response = Http::withToken(

                    $accessToken

                )

                    ->acceptJson()

                    ->asJson()

                    ->timeout(60)

                    ->post(

                        $searchUrl . '?page=' . $page,

                        $payload

                    );

            }





            /*

            |--------------------------------------------------------------------------

            | API Authentication Error

            |--------------------------------------------------------------------------

            */



            if (

                $response->status() === 401

                ||

                $response->status() === 403

            ) {



                Log::error(

                    strtoupper($source) .

                    ' project API authentication failed.',

                    [

                        'status' =>

                            $response->status(),



                        'response' =>

                            $response->body(),

                    ]

                );





                return response()->json([

                    'success' => false,



                    'message' =>

                        strtoupper($source) .

                        ' project API authentication failed.',



                    'api_status' =>

                        $response->status(),



                    'api_response' =>

                        $response->json()

                        ?: $response->body(),



                ], $response->status());

            }





            /*

            |--------------------------------------------------------------------------

            | Other API Error

            |--------------------------------------------------------------------------

            */



            if ($response->failed()) {



                Log::error(

                    strtoupper($source) .

                    ' project API failed.',

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

                        strtoupper($source) .

                        ' project API returned an error.',



                    'api_status' =>

                        $response->status(),



                    'api_response' =>

                        $response->json()

                        ?: $response->body(),



                ], $response->status());

            }





            /*

            |--------------------------------------------------------------------------

            | API Response

            |--------------------------------------------------------------------------

            */



            $result = $response->json();





            /*

            |--------------------------------------------------------------------------

            | Projects

            |--------------------------------------------------------------------------

            */



            $projects =

                $result['data']

                ?? $result['projects']

                ?? [];





            /*

            |--------------------------------------------------------------------------

            | Optional Local Search

            |--------------------------------------------------------------------------

            |

            | If the public API does not provide a documented text-search

            | parameter, search the projects returned on the current page.

            |

            */



            if (

                $search !== ''

                &&

                $searchKey === ''

            ) {



                $needle =

                    mb_strtolower($search);





                $projects = collect($projects)

                    ->filter(

                        function ($project) use ($needle) {



                            $name =

                                mb_strtolower(

                                    (string) (

                                        $project['name']

                                        ?? $project['project_name']

                                        ?? ''

                                    )

                                );



                            $city =

                                mb_strtolower(

                                    (string) (

                                        $project['city']

                                        ?? ''

                                    )

                                );



                            $state =

                                mb_strtolower(

                                    (string) (

                                        $project['state']

                                        ?? ''

                                    )

                                );



                            $region =

                                mb_strtolower(

                                    (string) (

                                        $project['region']

                                        ?? ''

                                    )

                                );



                            return

                                str_contains(

                                    $name,

                                    $needle

                                )

                                ||

                                str_contains(

                                    $city,

                                    $needle

                                )

                                ||

                                str_contains(

                                    $state,

                                    $needle

                                )

                                ||

                                str_contains(

                                    $region,

                                    $needle

                                );

                        }

                    )

                    ->values()

                    ->all();

            }





            /*

            |--------------------------------------------------------------------------

            | Pagination Metadata

            |--------------------------------------------------------------------------

            */



            $meta =

                $result['meta']

                ?? [

                    'current_page' => $page,

                    'last_page' => 1,

                    'per_page' => $perPage,

                    'total' => count($projects),

                ];





            /*

            |--------------------------------------------------------------------------

            | Return to React

            |--------------------------------------------------------------------------

            */



            return response()->json([

                'success' => true,



                'source' =>

                    $source,



                'days' =>

                    $days,



                'date_range' => [

                    'start_date' =>

                        $startDate,



                    'end_date' =>

                        $endDate,

                ],



                'data' =>

                    $projects,



                'links' =>

                    $result['links']

                    ?? [],



                'meta' =>

                    $meta,

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

                strtoupper($source) .

                ' API connection failed.',

                [

                    'message' =>

                        $e->getMessage(),

                ]

            );





            return response()->json([

                'success' => false,



                'message' =>

                    'CMS could not connect to the ' .

                    strtoupper($source) .

                    ' server.',



                'error' =>

                    app()->environment('local')

                        ? $e->getMessage()

                        : null,



            ], 503);



        } catch (RuntimeException $e) {



            /*

            |--------------------------------------------------------------------------

            | Configuration / Authentication Error

            |--------------------------------------------------------------------------

            */



            Log::error(

                strtoupper($source) .

                ' API runtime error.',

                [

                    'message' =>

                        $e->getMessage(),

                ]

            );





            return response()->json([

                'success' => false,



                'message' =>

                    $e->getMessage(),



                'error' =>

                    app()->environment('local')

                        ? $e->getMessage()

                        : null,



            ], 500);



        } catch (\Throwable $e) {



            /*

            |--------------------------------------------------------------------------

            | Unexpected Error

            |--------------------------------------------------------------------------

            */



            Log::error(

                strtoupper($source) .

                ' API exception.',

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

                    'Unexpected error while retrieving ' .

                    strtoupper($source) .

                    ' projects.',



                'error' =>

                    app()->environment('local')

                        ? $e->getMessage()

                        : null,



            ], 500);

        }

    }





    /*

    |--------------------------------------------------------------------------

    | Get BX1 Access Token

    |--------------------------------------------------------------------------

    |

    | Postman working request:

    |

    | GET:

    | https\://api.biltrax.com/v1/get-auth-token

    |

    | Query Params:

    |

    | client_id

    | client_secret

    | username

    | password

    |

    | Response:

    |

    | access_token

    |

    */



    private function getBx1AccessToken(): string

    {

        $authUrl =

            (string) config(

                'services.bx1.auth_url'

            );



        $clientId =

            (string) config(

                'services.bx1.client_id'

            );



        $clientSecret =

            (string) config(

                'services.bx1.client_secret'

            );



        $username =

            (string) config(

                'services.bx1.username'

            );



        $password =

            (string) config(

                'services.bx1.password'

            );





        /*

        |--------------------------------------------------------------------------

        | Validate Configuration

        |--------------------------------------------------------------------------

        */



        if (

            $authUrl === ''

            ||

            $clientId === ''

            ||

            $clientSecret === ''

            ||

            $username === ''

            ||

            $password === ''

        ) {



            throw new RuntimeException(

                'BX1 authentication configuration is incomplete.'

            );

        }





        /*

        |--------------------------------------------------------------------------

        | BX1 Authentication

        |--------------------------------------------------------------------------

        |

        | IMPORTANT:

        |

        | Credentials are QUERY PARAMETERS.

        |

        | They are NOT:

        |

        | JSON body

        | form body

        | Authorization header

        |

        */



        $response = Http::acceptJson()

            ->timeout(30)

            ->get(

                $authUrl,

                [

                    'client_id' =>

                        $clientId,



                    'client_secret' =>

                        $clientSecret,



                    'username' =>

                        $username,



                    'password' =>

                        $password,

                ]

            );





        /*

        |--------------------------------------------------------------------------

        | Authentication Failed

        |--------------------------------------------------------------------------

        */



        if ($response->failed()) {



            throw new RuntimeException(

                'BX1 authentication failed. HTTP ' .

                $response->status() .

                ': ' .

                $response->body()

            );

        }





        /*

        |--------------------------------------------------------------------------

        | Get access_token

        |--------------------------------------------------------------------------

        */



        $accessToken =

            $response->json(

                'access_token'

            );





        if (!$accessToken) {



            throw new RuntimeException(

                'BX1 authentication succeeded but access_token was not returned.'

            );

        }





        return (string) $accessToken;

    }





    /*

    |--------------------------------------------------------------------------

    | Get BX2 Access Token

    |--------------------------------------------------------------------------

    |

    | BX2:

    |

    | GET:

    | https\://bx2api.biltrax.com/v1/get-user-auth-token

    |

    | Query Params:

    |

    | client_id

    | client_secret

    | username

    | password

    |

    */



    private function getBx2AccessToken(): string

    {

        $authUrl =

            (string) config(

                'services.bx2.auth_url'

            );



        $clientId =

            (string) config(

                'services.bx2.client_id'

            );



        $clientSecret =

            (string) config(

                'services.bx2.client_secret'

            );



        $username =

            (string) config(

                'services.bx2.username'

            );



        $password =

            (string) config(

                'services.bx2.password'

            );





        /*

        |--------------------------------------------------------------------------

        | Validate Configuration

        |--------------------------------------------------------------------------

        */



        if (

            $authUrl === ''

            ||

            $clientId === ''

            ||

            $clientSecret === ''

            ||

            $username === ''

            ||

            $password === ''

        ) {



            throw new RuntimeException(

                'BX2 authentication configuration is incomplete.'

            );

        }





        /*

        |--------------------------------------------------------------------------

        | BX2 Authentication

        |--------------------------------------------------------------------------

        */



        $response = Http::acceptJson()

            ->timeout(30)

            ->get(

                $authUrl,

                [

                    'client_id' =>

                        $clientId,



                    'client_secret' =>

                        $clientSecret,



                    'username' =>

                        $username,



                    'password' =>

                        $password,

                ]

            );





        /*

        |--------------------------------------------------------------------------

        | Authentication Failed

        |--------------------------------------------------------------------------

        */



        if ($response->failed()) {



            throw new RuntimeException(

                'BX2 authentication failed. HTTP ' .

                $response->status() .

                ': ' .

                $response->body()

            );

        }





        /*

        |--------------------------------------------------------------------------

        | Get access_token

        |--------------------------------------------------------------------------

        */



        $accessToken =

            $response->json(

                'access_token'

            );





        if (!$accessToken) {



            throw new RuntimeException(

                'BX2 authentication succeeded but access_token was not returned.'

            );

        }





        return (string) $accessToken;

    }

}