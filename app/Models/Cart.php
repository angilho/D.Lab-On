<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
	//TODO: 모델 Soft Delete 설정 어떻게 할건지?
	//cascade delete도 정의하자
	use HasFactory;

	protected $fillable = ["user_id", "course_id", "course_section_id"];

	/**
	 * 강좌 정보를 구한다.
	 */
	public function course()
	{
		return $this->hasOne(Course::class, "id", "course_id");
	}

	/**
	 * 강좌 정보를 구한다.
	 */
	public function course_section()
	{
		return $this->hasOne(CourseSection::class, "id", "course_section_id");
	}
}