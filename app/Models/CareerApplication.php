<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CareerApplication extends Model {protected $table='career_applications'; protected $fillable=['full_name','email','mobile','current_location','area_of_interest','experience','highest_qualification','linkedin_profile','resume_path','resume_original_name','resume_mime','resume_size','interest_statement','consent','status','internal_notes','reviewed_at','reviewed_by']; protected $casts=['consent'=>'boolean'];}
