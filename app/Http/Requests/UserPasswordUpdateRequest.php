<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use App\Rules\CurrentPasswordCheckRule;

class UserPasswordUpdateRequest extends FormRequest
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
			"password" => ["required", "string", new CurrentPasswordCheckRule()],
			"new_password" => "required|string",
			"new_password_confirm" => "required|string|same:new_password",
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
			"password.required" => "예전 암호 정보가 필요합니다.",
			"password.string" => "예전 암호 정보가 올바르지 않습니다.",
			"new_password.required" => "새로운 암호 정보가 필요합니다.",
			"new_password.string" => "새로운 암호 정보가 올바르지 않습니다.",
			"new_password_confirm.required" => "새로운 암호 확인 정보가 필요합니다.",
			"new_password_confirm.string" => "새로운 암호 확인 정보가 올바르지 않습니다.",
			"new_password_confirm.same" => "새로운 암호 확인 정보가 일치하지 않습니다.",
		];
	}
}