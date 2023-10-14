<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CurriculumCategoryReorderRequest extends FormRequest
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
			"curriculum_categories" => "array",
			"curriculum_categories.*.id" => "required|integer",
			"curriculum_categories.*.order" => "required|integer",
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
			"curriculum_categories.*.id" => "커리큘럼 카테고리 아이디가 필요합니다.",
			"curriculum_categories.*.order" => "커리큘럼 카테고리 순서가 필요합니다.",
		];
	}
}
