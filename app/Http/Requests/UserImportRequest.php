<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserImportRequest extends FormRequest
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
			"email" => "required|email|unique:users,email",
			"role" => "required|in:0,1",
			"phone" => "required|numeric",
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
			"email.required" => "이메일 필요",
			"email.unique" => "이메일 중복",
			"email.email" => "올바른 이메일 형식이 아닙니다",
			"role.required" => "역할 필요",
			"phone.required" => "전화번호 필요",
			"phone.numeric" => "전화번호는 숫자만",
		];
	}
}