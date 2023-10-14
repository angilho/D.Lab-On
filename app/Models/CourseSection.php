<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CourseSection extends Model
{
	use HasFactory;

	protected $fillable = [
		"course_id",
		"target_group",
		"target_grade",
		"max_student",
		"start_at",
		"end_at",
		"recruit_start_at",
		"recruit_end_at",
		"cycle_week",
		"start_hour",
		"start_minute",
		"end_hour",
		"end_minute",
		"duration_day",
		"zoom_url",
		"zoom_password",
		"zoom_id",
		"closed",
	];

	protected $casts = [
		"start_at" => "datetime",
		"end_at" => "datetime",
		"recruit_start_at" => "datetime",
		"recruit_end_at" => "datetime",
		"duration_day" => "array",
		"closed" => "boolean",
	];

	protected $appends = [
		"duration_day_str",
		"duration_time_str",
		"duration_start_time_str",
		"duration_period_str",
		"duration_period_wo_year_str",
		"enrollment_count",
	];

	public function getEnrollmentCountAttribute()
	{
		return Enrollment::where("course_section_id", $this->id)->count();
	}

	/**
	 * 요일을 , 붙여서 프론트에 보여주기 쉬운 형태로 반환한다.
	 */
	public function getDurationDayStrAttribute()
	{
		$result = join(",", $this->duration_day);
		return $result .= "요일";
	}

	/**
	 * 수업 시작~종료 시간을 AM, PM 형태로 보여준다 (시작시간 ~ 종료시간)
	 */
	public function getDurationTimeStrAttribute()
	{
		$startAt = Carbon::now();
		$startAt->hour = $this->start_hour;
		$startAt->minute = $this->start_minute;

		$endAt = Carbon::now();
		$endAt->hour = $this->end_hour;
		$endAt->minute = $this->end_minute;

		return "{$startAt->format("g:i A")} ~ {$endAt->format("g:i A")}";
	}

	/**
	 * 수업 시작 시간을 AM, PM 형태로 보여준다 (시작시간)
	 */
	public function getDurationStartTimeStrAttribute()
	{
		$startAt = Carbon::now();
		$startAt->hour = $this->start_hour;
		$startAt->minute = $this->start_minute;

		return "{$startAt->format("g:i A")}";
	}

	/**
	 * 수업 시작~종료일을 표시한다.
	 */
	public function getDurationPeriodStrAttribute()
	{
		$startAt = Carbon::parse($this->start_at);
		$endAt = Carbon::parse($this->end_at);
		return "{$startAt->format("Y.m.d")} ~ {$endAt->format("Y.m.d")}";
	}

	/**
	 * 수업 시작~종료일을 연도를 제외하고 표시한다.
	 */
	public function getDurationPeriodWoYearStrAttribute()
	{
		$startAt = Carbon::parse($this->start_at);
		$endAt = Carbon::parse($this->end_at);
		return "{$startAt->format("m.d")} ~ {$endAt->format("m.d")}";
	}
}
