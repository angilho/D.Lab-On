<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CarouselReorderRequest extends FormRequest
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
			"carousels" => "array",
			"carousels.*.id" => "required|integer",
			"carousels.*.order" => "required|integer",
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
			"carousels.*.id" => "캐러셀 아이디가 필요합니다.",
			"carousels.*.order" => "캐러셀 순서가 필요합니다.",
		];
	}
}
