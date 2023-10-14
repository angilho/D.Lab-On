<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceStudent extends Model
{
	use HasFactory;

	protected $fillable = ["user_id", "attendance_course_id", "attendance_section_id", "attendance"];

	protected $casts = [
		"attendance" => "boolean",
	];

	/**
	 * 학생 정보를 구한다.
	 */
	public function student()
	{
		return $this->hasOne(User::class, "id", "user_id");
	}

	/**
	 * 출결 대상 차시 정보를 얻는다.
	 */
	public function attendanceSection()
	{
		return $this->belongsTo(AttendanceSection::class, "attendance_section_id", "id");
	}
}
