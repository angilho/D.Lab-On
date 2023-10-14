<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FaqUpdateRequest extends FormRequest
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
			"faq_category_id" => "required|integer",
			"name" => "required|string",
			"description" => "required|string",
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
			"faq_category_id.required" => "FAQ 카테고리가 필요합니다.",
			"name.required" => "FAQ 제목이 필요합니다.",
			"description.required" => "FAQ 내용이 필요합니다.",
		];
	}
}