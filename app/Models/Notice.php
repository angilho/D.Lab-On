<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
	use HasFactory;

	protected $fillable = ["user_id", "title", "description", "view_count"];

	protected $with = ["user"];

	public function user()
	{
		return $this->belongsTo(User::class, "user_id", "id");
	}
}