<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Hash, Storage};
use Illuminate\Validation\Rule;
use App\Models\{DemoRequest, CareerApplication, User};

class CmsController extends Controller
{
    private function model(string $type)
    {
        abort_unless(in_array($type, ['contact', 'careers'], true), 404);
        return $type === 'contact' ? DemoRequest::class : CareerApplication::class;
    }
    // public function login(Request $r)
    // {
    //     // $v = $r->validate(['email' => 'required|email', 'password' => 'required|string']);
    //     // if (!Auth::attempt($v)) {
    //     //     return response()->json(['message' => 'Invalid credentials'], 422);
    //     // }
    //     // $r->session()->regenerate();
    //     // return response()->json(['user' => Auth::user()->only('id', 'name', 'email')]);
    //     try{
    //         if($r->isMethod('POST')){
    //             // validate kiya;
    //            $valiedate =  $r->validate([
    //             'email' => 'required|string|email|exists:users,email',
    //             'password' => 'required|string',
    //            ]);
    //             // condition check karo;
    //             $user = User::where('email',$valiedate['email'])->first();
    //             // print_r("User Invalid".$user);
    //             // exit;
    //             $password = Hash::check($valiedate['password'],$user->password);

    //             if( !$user || !$password ){
    //                  return response()->json(['status'=>'error','message'=>'Invalid email or password'],401);
    //             }
    //             // Laravel main user ko login karwavaya
    //             Auth::login($user);
    //             // session id genrate kiya
    //             $r->session()->regenerate();
    //           return response()->json(['status'=>'success','message'=>'Login successfull','user' => Auth::user()->only('id', 'name', 'email')],200);
    //         }else{
    //              return response()->json(['status'=>'error','message'=>'Invalid request method'],405);
    //         }
    //     }catch(\Exception $e){
    //         return response()->json(['status'=>'error','message'=>'Internal server issue'.$e->getMessage()],500);
    //     }
    // }

public function login(Request $r)
{
    try {
        $validated = $r->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // User find karo
        $user = User::where('email', $validated['email'])->first();

        // User aur password verify karo
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Use the same session guard configured in config/auth.php.
        Auth::guard('web')->login($user);

        // Bind the authenticated user to a newly rotated session ID.
        // Laravel saves the session automatically after the response.
        $r->session()->regenerate();

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => Auth::user()->only('id', 'name', 'email')
        ], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        throw $e;
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Internal server issue'
        ], 500);
    }
}

    public function logout(Request $r)
    {
        Auth::guard('web')->logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();
        return response()->json(['message' => 'Signed out']);
    }
    public function me()
    {
        return response()->json([
            'user' => Auth::guard('web')->user()->only('id', 'name', 'email')
        ]);
    }

    public function summary()
    {
        $today = \Illuminate\Support\Carbon::today();
        $daily = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i);
            $daily[] = [
                'label' => $date->format('d M'),
                'contact' => DemoRequest::whereDate('created_at', $date->toDateString())->count(),
                'careers' => CareerApplication::whereDate('created_at', $date->toDateString())->count(),
            ];
        }
        $monthly = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = $today->copy()->startOfMonth()->subMonths($i);
            $monthly[] = [
                'label' => $date->format('M Y'),
                'contact' => DemoRequest::whereBetween('created_at', [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()])->count(),
                'careers' => CareerApplication::whereBetween('created_at', [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()])->count(),
            ];
        }
        $breakdown = [];
        foreach (['contact' => DemoRequest::class, 'careers' => CareerApplication::class] as $type => $model) {
            $breakdown[$type] = [
                'new' => $model::where('status', 'new')->count(),
                'in_progress' => $model::where('status', 'in_progress')->count(),
                'resolved' => $model::where('status', 'resolved')->count(),
            ];
        }
        return response()->json([
            'contact' => DemoRequest::count(),
            'careers' => CareerApplication::count(),
            'new_contact' => $breakdown['contact']['new'],
            'new_careers' => $breakdown['careers']['new'],
            'in_progress' => $breakdown['contact']['in_progress'] + $breakdown['careers']['in_progress'],
            'resolved' => $breakdown['contact']['resolved'] + $breakdown['careers']['resolved'],
            'trends' => ['daily' => $daily, 'monthly' => $monthly],
            'status_breakdown' => $breakdown,
        ]);
    }


    public function index(Request $r, string $type)
    {
        $m = $this->model($type);
        $v = $r->validate(['search' => 'nullable|string|max:100', 'status' => ['nullable', Rule::in(['new', 'in_progress', 'resolved'])], 'page' => 'nullable|integer|min:1']);
        $q = $m::query()->select($type === 'contact' ? ['id', 'full_name', 'work_email', 'company', 'official_mobile', 'status', 'created_at', 'updated_at'] : ['id', 'full_name', 'email', 'mobile', 'area_of_interest', 'status', 'created_at', 'updated_at']);
        if (!empty($v['status'])) $q->where('status', $v['status']);
        if (!empty($v['search'])) {
            $s = '%' . str_replace(['%', '_'], ['\%', '\_'], $v['search']) . '%';
            $fields = $type === 'contact' ? ['full_name', 'work_email', 'company', 'official_mobile'] : ['full_name', 'email', 'area_of_interest', 'mobile'];
            $q->where(function ($w) use ($fields, $s) {
                foreach ($fields as $field) {
                    $w->orWhere($field, 'like', $s);
                }
            });
        }
        return response()->json($q->latest('created_at')->paginate(15));
    }
    public function show(string $type, int $id)
    {
        return response()->json($this->model($type)::findOrFail($id));
    }
    public function update(Request $r, string $type, int $id)
    {
        $v = $r->validate(['status' => ['required', Rule::in(['new', 'in_progress', 'resolved'])], 'internal_notes' => 'nullable|string|max:20000']);
        $item = $this->model($type)::findOrFail($id);
        $item->fill($v);
        $item->reviewed_at = now();
        $item->reviewed_by = Auth::id();
        $item->save();
        return response()->json($item);
    }
    public function resume(int $id)
    {
        $item = CareerApplication::findOrFail($id);
        abort_unless(Storage::disk('s3')->exists($item->resume_path), 404);
        return response()->json(['url' => Storage::disk('s3')->temporaryUrl($item->resume_path, now()->addMinutes(5), ['ResponseContentDisposition' => 'attachment; filename="' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($item->resume_original_name)) . '"'])]);
    }
}
