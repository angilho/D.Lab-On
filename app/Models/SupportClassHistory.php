<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportClassHistory extends Model
{
	use HasFactory;

	protected $fillable = ["work_user_id", "target_user_id", "target_course_id", "target_section_id", "action"];

	public function workUser()
	{
		return $this->belongsTo(User::class, "work_user_id", "id");
	}

	public function targetUser()
	{
		return $this->belongsTo(User::class, "target_user_id", "id");
	}

	public function targetCourse()
	{
		return $this->belongsTo(Course::class, "target_course_id", "id");
	}
}
