<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceSection extends Model
{
	use HasFactory;

	protected $fillable = ["attendance_course_id", "index", "attendance_at", "attendance_checked"];

	protected $casts = [
		"attendance_at" => "datetime",
		"attendance_checked" => "boolean",
	];

	/**
	 * 출결 대상 과목 정보를 얻는다.
	 */
	public function attendanceCourse()
	{
		return $this->belongsTo(AttendanceCourse::class, "attendance_course_id", "id");
	}

	/**
	 * 출결 학생 정보를 얻는다.
	 */
	public function attendanceStudents()
	{
		return $this->hasMany(AttendanceStudent::class, "attendance_section_id", "id");
	}
}
