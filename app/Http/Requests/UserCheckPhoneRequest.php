<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserCheckPhoneRequest extends FormRequest
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
			"phone" => "required|string|unique:users,phone",
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
			"phone.required" => "전화번호가 필요합니다.",
			"phone.string" => "전화번호 값이 올바르지 않습니다.",
			"phone.unique" => "이미 사용중인 전화번호 입니다.",
		];
	}
}