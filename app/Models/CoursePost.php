<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoursePost extends Model
{
	use HasFactory;

	protected $fillable = [
		"course_id",
		"user_id",
		"type",
		"title",
		"description",
		"attachment_file_id",
		"private",
		"status",
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
		return $this->hasMany(CoursePostComment::class, "post_id", "id");
	}

	public function course()
	{
		return $this->belongsTo(Course::class, "course_id", "id");
	}
}
