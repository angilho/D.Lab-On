<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Constants\EnrollmentTarget;

class EnrollmentUpdateRequest extends FormRequest
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