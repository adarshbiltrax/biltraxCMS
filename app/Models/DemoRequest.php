<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class DemoRequest extends Model {protected $table='demo_requests'; protected $fillable=['full_name','work_email','company','role','role_other','company_website','official_mobile','products_sold','sectors_of_interest','sector_other','specific_requirements','consent','status','internal_notes','reviewed_at','reviewed_by']; protected $casts=['sectors_of_interest'=>'array','consent'=>'boolean'];


}
