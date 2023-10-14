<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstructorMetadata extends Model
{
	use HasFactory;

	protected $fillable = ["user_id", "employee_number", "start_at", "end_at", "gender"];
}
