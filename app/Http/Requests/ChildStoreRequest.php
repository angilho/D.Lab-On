<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChildStoreRequest extends FormRequest
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
			"user_login" => "required|string|min:3|unique:users,user_login|regex:/^[a-zA-Z0-9_@.]+$/",
			"name" => "required|string",
			"phone" => "required|string",
			"email" => "nullable|email",
			"password" => "required|string",
			"address" => "required|string",
			"address_detail" => "required|string",
			"birthday.year" => "required|numeric",
			"birthday.month" => "required|numeric",
			"birthday.day" => "required|numeric",
			"role" => "required|in:0,1,2",
			"gender" => "required|in:m,f",
			"grade" => "required|integer",
			"school" => "required|string",
			"campus" => "nullable|integer",
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
			"user_login.required" => "아이디 필요",
			"user_login.unique" => "아이디 중복",
			"user_login.min" => "아이디는 최소 3글자 이상만 허용합니다.",
			"user_login.regex" => "아이디는 영문, 숫자만 허용합니다.",
			"name.required" => "이름 필요",
			"phone.required" => "전화번호 필요",
			"phone.string" => "전화번호 형식이 이상합니다.",
			"email.email" => "올바른 이메일 형식이 아닙니다",
			"password.required" => "비밀번호 필요",
			"address.required" => "주소 필요",
			"address_detail.required" => "상세 주소 필요",
			"birthday.year.required" => "생년월일의 년도 정보가 필요합니다.",
			"birthday.year.numeric" => "생년월일의 년도 정보가 잘못되었습니다.",
			"birthday.month.required" => "생년월일의 월 정보가 필요합니다.",
			"birthday.month.numeric" => "생년월일의 월 정보가 잘못되었습니다.",
			"birthday.day.required" => "생년월일의 일 정보가 필요합니다.",
			"birthday.day.numeric" => "생년월일의 일 정보가 잘못되었습니다.",
			"role.required" => "역할 필요",
			"gender.required" => "역할 필요",
			"gender.in" => "성별값 이상",
			"grade.required" => "학년 필요",
			"school.required" => "학교 필요",
		];
	}
}
