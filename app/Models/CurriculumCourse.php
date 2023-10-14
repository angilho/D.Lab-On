<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurriculumCourse extends Model
{
	use HasFactory;

	protected $fillable = ["curriculum_category_id", "course_id", "order"];

	protected $with = ["course"];

	public function course()
	{
		return $this->hasOne(Course::class, "id", "course_id");
	}
}
