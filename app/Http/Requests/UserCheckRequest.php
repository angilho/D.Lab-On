<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserCheckRequest extends FormRequest
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
			"email" => "required|string",
			"password" => "required|string",
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
			"email.required" => "아이디가 필요합니다.",
			"email.string" => "아이디 값이 이상합니다.",
			"password.required" => "비밀번호가 필요합니다.",
			"password.string" => "비밀번호 값이 이상합니다.",
		];
	}
}