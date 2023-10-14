<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
	use HasFactory;

	protected $fillable = ["user_id", "course_id", "course_section_id", "status"];

	/**
	 * 수강 신청한 Course 정보를 얻는다.
	 */
	public function course()
	{
		return $this->hasOne(Course::class, "id", "course_id");
	}

	/**
	 * 수강 신청한 Course Section 정보를 얻는다.
	 */
	public function CourseSection()
	{
		return $this->hasOne(CourseSection::class, "id", "course_section_id");
	}

	/**
	 * 수강 신청한 사용자 정보를 얻는다.
	 */
	public function user()
	{
		return $this->belongsTo(User::class, "user_id", "id");
	}

	/**
	 * 보충수업 부가 정보를 구한다.
	 */
	public function supportClassEnrollment()
	{
		return $this->hasOne(SupportClassEnrollment::class, "enrollment_id", "id");
	}
}
