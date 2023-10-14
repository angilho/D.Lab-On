<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
	use HasFactory;

	protected $fillable = [
		"user_id",
		"name",
		"type",
		"thumbnail_id",
		"closed",
		"student_target",
		"elice_course_id",
		"enable_elice_course",
		"price",
		"discount_price",
		"discount_text",
		"duration_week",
		"duration_hour",
		"duration_minute",
		"dlab_course_code",
		"curriculum_keyword",
		"curriculum_target_keyword",
		"short_description",
		"support_class",
		"b2b_class",
	];

	protected $casts = [
		"closed" => "boolean",
		"enable_elice_course" => "boolean",
		"support_class" => "boolean",
		"b2b_class" => "boolean",
	];

	protected $with = ["thumbnail", "sections", "chapters"];

	protected $appends = ["duration_time_str"];

	public static function boot()
	{
		parent::boot();
	}

	public function thumbnail()
	{
		return $this->hasOne(File::class, "id", "thumbnail_id");
	}

	public function sections()
	{
		return $this->hasMany(CourseSection::class, "course_id", "id");
	}

	public function chapters()
	{
		return $this->hasMany(CourseChapter::class, "course_id", "id");
	}

	public function courseDescription()
	{
		return $this->hasOne(CourseDescription::class, "course_id", "id");
	}

	/**
	 * 수업 시간이 얼마나 되는지 문자열로 반환한다
	 */
	public function getDurationTimeStrAttribute()
	{
		return "{$this->duration_hour}시간 {$this->duration_minute}분";
	}
}
