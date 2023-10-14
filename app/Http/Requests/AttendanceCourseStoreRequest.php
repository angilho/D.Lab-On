<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceCourseStoreRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			"course_id" => "required|integer|exists:courses,id",
			"section_id" => "required|integer|exists:course_sections,id",
			"instructor_id" => "required|integer|exists:users,id",
			"total_attendance_section" => "required|integer",
		];
	}

	/**
	 * Get the validation messages that apply to the request.
	 *
	 * @return array
	 */
	public function messages()
	{
		return [
			"course_id.required" => "과목 정보가 필요합니다.",
			"course_id.integer" => "과목 정보가 잘못되었습니다.",
			"course_id.exists" => "과목 정보가 없습니다.",
			"section_id.required" => "과목 회차 정보가 필요합니다.",
			"section_id.integer" => "과목 회차 정보가 잘못되었습니다.",
			"section_id.exists" => "과목 회차 정보가 없습니다.",
			"instructor_id.required" => "강사 정보가 필요합니다.",
			"instructor_id.integer" => "강사 정보가 잘못되었습니다.",
			"instructor_id.exists" => "강사 정보가 없습니다.",
			"total_attendance_section.required" => "수업횟수가 필요합니다.",
		];
	}
}
