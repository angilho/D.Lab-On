<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportClassEnrollment extends Model
{
	use HasFactory;

	protected $fillable = ["enrollment_id", "class_end_at"];

	protected $casts = [
		"class_end_at" => "datetime",
	];
}
