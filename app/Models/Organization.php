<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
	use HasFactory;

	protected $fillable = ["name", "start_at", "end_at", "path", "memo"];

	protected $casts = [
		"start_at" => "datetime",
		"end_at" => "datetime",
	];
}