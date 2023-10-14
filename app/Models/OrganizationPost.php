<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationPost extends Model
{
	use HasFactory;

	protected $fillable = [
		"organization_id",
		"user_id",
		"title",
		"description",
		"attachment_file_id",
		"private",
		"view_count",
		"order",
	];

	protected $casts = [
		"private" => "boolean",
	];

	protected $with = ["user", "attachment"];

	public function user()
	{
		return $this->belongsTo(User::class, "user_id", "id");
	}

	public function attachment()
	{
		return $this->hasOne(File::class, "id", "attachment_file_id");
	}

	public function comments()
	{
		return $this->hasMany(OrganizationPostComment::class, "post_id", "id");
	}
}