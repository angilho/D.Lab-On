<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoursePostComment extends Model
{
	use HasFactory;

	protected $fillable = ["course_id", "post_id", "user_id", "comment", "attachment_file_id"];

	protected $with = ["attachment"];

	public function attachment()
	{
		return $this->hasOne(File::class, "id", "attachment_file_id");
	}
}