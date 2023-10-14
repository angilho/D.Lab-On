<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseDescription extends Model
{
	use HasFactory;

	protected $fillable = [
		"course_id",
		"desktop_intro_image_id",
		"desktop_course_description",
		"desktop_course_curriculum",
		"desktop_operation",
		"desktop_refund",
		"mobile_intro_image_id",
		"mobile_course_description",
		"mobile_course_curriculum",
		"mobile_operation",
		"mobile_refund",
	];

	protected $with = ["desktopIntroImage", "mobileIntroImage"];

	public function desktopIntroImage()
	{
		return $this->hasOne(File::class, "id", "desktop_intro_image_id");
	}

	public function mobileIntroImage()
	{
		return $this->hasOne(File::class, "id", "mobile_intro_image_id");
	}
}
