<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamsMemberModel extends Model
{
    // create Teams model';
     protected $table = 'team_members';

     protected $fillable = ['firstname','lastname','designation','bio','qualification','linkdin_url','image','status'];
}
