<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserFindIdByPhoneRequest extends FormRequest
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
		//TODO(Advanced): 무분별한 호출을 막기 위해 전화번호 인증이나 이메일 인증을 사용한 경우 db에 로그를 남긴 뒤, 로그값과 비교해 시도를 했을 경우에만 호출하는 로직을 만들면 좋겠다.
		return [
			"name" => "required|string|exists:users,name",
			"phone" => "nullable|string|exists:users,phone",
			"email" => "nullable|string|exists:users,email",
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
			"name.required" => "사용자 이름이 필요합니다.",
			"name.string" => "사용자 이름이 올바르지 않습니다.",
			"name.exists" => "사용자가 존재하지 않습니다.",
			"phone.string" => "전화번호가 올바르지 않습니다.",
			"phone.exists" => "사용자가 존재하지 않습니다.",
			"email.string" => "이메일이 올바르지 않습니다.",
			"email.exists" => "사용자가 존재하지 않습니다.",
		];
	}
}