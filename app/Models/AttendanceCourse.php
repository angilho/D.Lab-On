<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceCourse extends Model
{
	use HasFactory;

	protected $fillable = ["course_id", "section_id", "instructor_id"];

	protected $with = ["course"];

	/**
	 * 강좌 정보를 구한다.
	 */
	public function course()
	{
		return $this->hasOne(Course::class, "id", "course_id");
	}

	/**
	 * 강사 정보를 구한다.
	 */
	public function instructor()
	{
		return $this->hasOne(User::class, "id", "instructor_id");
	}

	/**
	 * 출결 대상 주차를 구한다.
	 */
	public function attendanceSection()
	{
		return $this->hasMany(AttendanceSection::class, "attendance_course_id", "id");
	}
}
