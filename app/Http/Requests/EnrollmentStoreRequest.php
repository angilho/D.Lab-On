<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Constants\EnrollmentTarget;
use App\Models\Enrollment;
use App\Models\Course;

class EnrollmentStoreRequest extends FormRequest
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
			"child_id" => ["required", "string", Rule::exists("children", "id")],
			"course_id" => ["required", "integer", Rule::exists("courses", "id")],
		];
	}

	public function withValidator($validator)
	{
		$validator->after(function ($validator) {
			$child_id = $this->get("child_id");
			$course_id = $this->get("course_id");

			$exists = Enrollment::where(["child_id" => $child_id, "course_id" => $course_id])->count();
			if ($exists) {
				$validator->errors()->add("exists", "수강등록 내역이 존재합니다.");
			}

			$courseInfo = Course::where(["id" => $course_id])->first();
			if ($courseInfo->enrollment_count >= $courseInfo->max_student) {
				$validator->errors()->add("maxCourse", "수강등록 인원이 가득 찼습니다.");
			}
		});
	}

	/**
	 * Get the validation messages that apply to the request.
	 *
	 * @return array
	 */
	public function messages()
	{
		return [
			"child_id.required" => "신청 대상 자녀 필요",
			"child_id.exists" => "신청 대상 자녀가 없습니다.",
			"course_id.required" => "신청 대상 과목/트랙 필요",
			"course_id.exists" => "신청 대상 과목/트랙이 없습니다.",
		];
	}
}