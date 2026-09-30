<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder; use Illuminate\Support\Facades\Hash; use App\Models\{User,WebsiteProject,Career};
class BiltraxCmsSeeder extends Seeder { public function run():void{
 User::updateOrCreate(['email'=>'admin@biltrax.com'],['name'=>'Biltrax Admin','password'=>Hash::make('ChangeMe123!')]);
 WebsiteProject::firstOrCreate(['name'=>'Grade-A Warehousing Park, Phase 3'],['sector'=>'Industrial','type'=>'Warehousing','location'=>'Bhiwandi, Maharashtra','stage'=>'Pre-Construction','updated'=>now()->toDateString(),'summary'=>'Sample CMS project. Replace or edit from CMS.']);
 Career::firstOrCreate(['title'=>'Research Analyst'],['meta'=>'Mumbai · Full-time','duties'=>'Construction research, project intelligence and data validation.','is_active'=>true]);
 } }
