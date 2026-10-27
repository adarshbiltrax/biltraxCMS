<?php

namespace App\Http\Controllers;

use App\Models\TeamsMemberModel;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


use function PHPUnit\Framework\isEmpty;

class TeamsMemberController extends Controller
{
    // create Teams Member;
    public function index(){
         return "this is teams memeber controller";
    }

    public function createTeamsMember(Request $request){
        try{
            if($request->isMethod('POST')){
                $v = $request->validate([
                    'firstname' => 'required|string|max:255',
                    'lastname'  =>'required|string|max:255',
                    'designation' => 'required|string|max:255',
                    'bio'     => 'nullable|string',
                    'qualification' => 'nullable|string',
                    'linkdin'  => 'required|string|max:255',
                     'image'   =>  'required|image|mimes:jpg,png,jpeg,webp|max:2048'
                ]);
            //    Update Image Data;
            if (!$request->hasFile('image')) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Image file is missing.'
                    ], 422);
                }
                // if ($request->hasFile('image')) {
                //     $file = $request->file('image');

                //     $path = Storage::disk('s3')->putFile(
                //         'team-members',
                //         $file
                //     );

                //     dd([
                //         'uploaded' => $path !== false,
                //         'path' => $path,
                //         'exists' => $path
                //             ? Storage::disk('s3')->exists($path)
                //             : false,
                //     ]);
                // }
                // $imagePath = $request->file('image')->store(
                //     'team-members',
                //     's3',
                //     'public'
                // );
                // $imagePath = $request->file('image')->store(
                //     'team-members',
                //     's3',
                //     'public'
                // );
                    $imagePath = $request->file('image')->store(
                        'team-members',
                        [
                            'disk' => 's3',
                            // 'visibility' => 'public',
                        ]
                    );

                    $storeImage = Storage::disk('s3')->url($imagePath);
                // $storeImage = Storage::disk('s3')->url($imagePath);
                // $storeImage = Storage::disk('s3')->url($imagePath);
            //   $imagePath = $request->file('iamge')->store('team_memeber','public');

              $data = [
                'firstname'=> $v['firstname'],
                 'lastname' => $v['lastname'],
                 'designation' => $v['designation'],
                 'bio'         => $v['bio'],
                 'qualification' => $v['qualification'],
                 'linkdin_url'  => $v['linkdin'],
                 'status'      => 1,
                  'image'      => $imagePath,
              ];

            //   Insert Data;
            $insertData = TeamsMemberModel::create($data);

            if(empty($insertData)){
               return response()->json(['status'=>'error','meessage'=>'Team memebr not created','data'=>[],422]);    
            }

             return response()->json(['status'=>'success','message'=>'Team member created successfull','data'=>$insertData,'imagePath'=>$storeImage,'code'=>201]);
    
            }else{
                return response()->json(['status'=>'error','message'=>'Method not allowed',405]);
            }
        }catch(Exception $e){
             return response()->json(['status'=>'error','message'=>'Internal server issue'.$e->getMessage(),500]);
        }
    }

    // Get All Team member;
    public function getAllTeammember(Request $request){
         try{
             if($request->isMethod('POST')){
                $allMember = TeamsMemberModel::where('status',1)->get();
                if($allMember->isEmpty()){
                     return response()->json(['status'=>'error','message'=>'No team member found','data'=>[]],404);
                }
                return response()->json(['status'=>'success','message'=>'Members retrieved successfully','data'=>$allMember],200);

             }else{
                return response()->json(['status'=>'error','message'=>'Method not allowed'],405);
             }
         }catch(Exception $e){
             return response()->json(['status'=>'error','message'=>'Internal server issue'.$e->getMessage()],500);
         }
    }

    // Get Single Data;
   
public function getSingleData(Request $request)
{
    try {
        $request->validate([
            'id' => 'required|integer'
        ]);

        $member = TeamsMemberModel::where('status', 1)
            ->find($request->id);

        if (!$member) {
            return response()->json([
                'status' => 'error',
                'message' => 'Member data not found.',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Member retrieved successfully.',
            'data' => $member
        ], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        throw $e;

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Unable to retrieve member.'
        ], 500);
    }
}

 // Get Update method;
    
public function updateTeamsMember(Request $request)
{
    try {
        $validated = $request->validate([
            'id'            => 'required|integer|exists:team_members,id',
            'firstname'     => 'required|string|max:255',
            'lastname'      => 'required|string|max:255',
            'designation'   => 'required|string|max:255',
            'bio'           => 'nullable|string',
            'qualification' => 'nullable|string',
            'linkdin'       => 'required|url|max:255',
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $member = TeamsMemberModel::where('status', 1)
            ->find($validated['id']);

        if (!$member) {
            return response()->json([
                'status' => 'error',
                'message' => 'Team member not found.'
            ], 404);
        }

        $data = [
            'firstname'     => $validated['firstname'],
            'lastname'      => $validated['lastname'],
            'designation'   => $validated['designation'],
            'bio'           => $validated['bio'] ?? null,
            'qualification' => $validated['qualification'] ?? null,
            'linkdin_url'   => $validated['linkdin'],
        ];

        // Agar new image upload hui hai tabhi purani image replace karo
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store(
                'team-members',
                 's3',
                'public'
            );

            // Purani image remove karo
            // if ($member->image &&
            //     Storage::disk('public')->exists($member->image)) {
            //     Storage::disk('public')->delete($member->image);
            // }
            if($member->image){
                 Storage::disk('s3')->delete($member->image);
            }

            $data['image'] = $imagePath;
        }

        $member->update($data);
        $member->refresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Team member updated successfully.',
            'data' => $member
        ], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        throw $e;

    } catch (\Exception $e) {
         return response()->json([
            'status' => 'error',
            'message' => 'Unable to update team member.'.$e->getMessage()
        ], 500);
    }
}

// Delete Team Memeber ;

public function DeleteTeamMember(Request $request){
     try{
        if(!$request->isMethod('Delete')){
            return response()->json(['status'=>'error','message'=>'Invalid request method'],405);
        }
        $request->validate([
            'id' => 'required|integer'
        ]);

        $member = TeamsMemberModel::where('status', 1)
            ->find($request->id);


        if (!$member) {
            return response()->json([
                'status' => 'error',
                'message' => 'Member data not found.',
                'data' => null
            ], 404);
        }
        $data = [
            'status' => 0
        ];
         $memberDelete = $member->update($data);
        // /$memberDelete = TeamsMemberModel::update($data);
        if(empty($memberDelete)){
             return response()->json(['status'=>'error','message'=>'Member not delete'],422);
        }
        return response()->json(['status'=>'success','message'=>'Member delete successfull'],201);
     }catch(Exception $e){
         return response()->json(['status'=>'error','message'=>'Internal server issue'.$e->getMessage()],500);
     }
}



}
