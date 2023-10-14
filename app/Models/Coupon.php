<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
	use HasFactory;

	protected $fillable = ["category", "name", "type", "code", "end_at", "value", "used_at", "course_type", "deleted"];

	protected $casts = [
		"end_at" => "datetime",
		"used_at" => "datetime",
	];

	public function getRouteKeyName()
	{
		return "code";
	}
}
