<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CarouselStoreRequest extends FormRequest
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

	public function validationData()
	{
		$all = parent::validationData();
		$all["new_tab"] = filter_var($all["new_tab"], FILTER_VALIDATE_BOOLEAN);
		return $all;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			"desktop_image_file" => "required",
			"mobile_image_file" => "required",
			"url" => "required|string",
			"background_color" => "required|string",
			"new_tab" => "required|boolean",
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
			"desktop_image_file.required" => "데스크톱 캐러셀 이미지가 필요합니다.",
			"mobile_image_file.required" => "모바일 캐러셀 이미지가 필요합니다.",
			"url.required" => "캐러셀 링크가 필요합니다.",
			"background_color.required" => "캐러셀 배경색이 필요합니다.",
			"new_tab.required" => "캐러셀 새탭 여부가 필요합니다.",
		];
	}
}
