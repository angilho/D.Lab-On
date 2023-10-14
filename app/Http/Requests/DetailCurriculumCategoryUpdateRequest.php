<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DetailCurriculumCategoryUpdateRequest extends FormRequest
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
			"title" => "string",
			"description" => "string",
			"tag" => "string",
			"curriculum_courses" => "array",
			"curriculum_courses.*.id" => "required|integer",
			"curriculum_courses.*.order" => "required|integer",
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
			"curriculum_courses.*.id.required" => "커리큘럼 과목 ID가 필요합니다.",
			"curriculum_courses.*.order.required" => "커리큘럼 과목 순서가 필요합니다.",
		];
	}
}
