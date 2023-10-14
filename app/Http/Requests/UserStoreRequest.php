<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
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
			"email" => "required|email",
			"password" => "required|string",
			"birthday.year" => "required|numeric",
			"birthday.month" => "required|numeric",
			"birthday.day" => "required|numeric",
			"address" => "required|string",
			"address_detail" => "required|string",
			"inflow_path" => "nullable|string",
			"role" => "required|in:0,1,2,3",
			"agreements.dlab_on" => "required|in:true",
			"agreements.privacy" => "required|in:true",
			"agreements.promotion" => "nullable|in:true,false",
			"gender" => "nullable|in:m,f",
			"grade" => "nullable|integer",
			"school" => "nullable|string",
			"start_at" => "nullable|date",
			"end_at" => "nullable|date",
			"campus" => "required|integer",
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
			"user_login.required" => "아이디가 필요합니다.",
			"user_login.unique" => "아이디가 중복입니다.",
			"user_login.min" => "아이디는 최소 3글자 이상만 허용합니다.",
			"user_login.regex" => "아이디는 영문, 숫자만 허용합니다.",
			"name.required" => "이름이 필요합니다.",
			"phone.required" => "전화번호가 필요합니다.",
			"phone.string" => "전화번호 값이 이상합니다.",
			"email.required" => "이메일이 필요합니다.",
			"email.email" => "올바른 이메일 형식이 아닙니다",
			"password.required" => "비밀번호가 필요합니다.",
			"birthday.year.required" => "생년월일의 년도 정보가 필요합니다.",
			"birthday.year.numeric" => "생년월일의 년도 정보가 잘못되었습니다.",
			"birthday.month.required" => "생년월일의 월 정보가 필요합니다.",
			"birthday.month.numeric" => "생년월일의 월 정보가 잘못되었습니다.",
			"birthday.day.required" => "생년월일의 일 정보가 필요합니다.",
			"birthday.day.numeric" => "생년월일의 일 정보가 잘못되었습니다.",
			"address.required" => "주소가 필요합니다.",
			"address_detail.required" => "상세 주소가 필요합니다.",
			"role.required" => "역할이 필요합니다.",
			"inflow_path.string" => "유입 경로 값이 이상합니다.",
			"agreements.dlab_on.required" => "디랩 약관에 동의해야 합니다.",
			"agreements.dlab_on.in" => "디랩 약관에 동의해야 합니다.",
			"agreements.privacy.required" => "개인정보 수집 약관에 동의해야 합니다.",
			"agreements.privacy.in" => "개인정보 수집 약관에 동의해야 합니다.",
			"agreements.promotion.in" => "프로모션 수신 약관에 동의해야 합니다.",
			"gender.in" => "성별이 올바르지 않습니다.",
			"grade.integer" => "학년 값이 올바르지 않습니다.",
			"school.string" => "학교 값이 올바르지 않습니다.",
			"campus.required" => "디랩코딩학원 캠퍼스 정보가 필요합니다.",
		];
	}
}
