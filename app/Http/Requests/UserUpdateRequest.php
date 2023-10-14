<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Arr;
use App\Constants\Role;
use App\Constants\Gender;
use Route;

class UserUpdateRequest extends FormRequest
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
		$all["use_default_profile"] = filter_var($all["use_default_profile"], FILTER_VALIDATE_BOOLEAN);
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
			"user_login" => "required|string",
			"name" => "required|string",
			"phone" => "required|string",
			"email" => "nullable|email",
			"password" => "nullable|string",
			"birthday.year" => "required|numeric",
			"birthday.month" => "required|numeric",
			"birthday.day" => "required|numeric",
			"address" => "required|string",
			"address_detail" => "required|string",
			"role" => "required|in:0,1,2,3",
			"gender" => "nullable|in:m,f",
			"grade" => "nullable|integer",
			"school" => "nullable|string",
			"use_default_profile" => "nullable|boolean",
			"profile_image" => "nullable",
			"start_at" => "nullable|date",
			"end_at" => "nullable|date",
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
			"name.required" => "이름이 필요합니다.",
			"phone.required" => "전화번호가 필요합니다.",
			"phone.string" => "전화번호 형식이 이상합니다.",
			"email.email" => "올바른 이메일 형식이 아닙니다",
			"password.string" => "비밀번호 형식이 잘못되었습니다.",
			"birthday.year.required" => "생년월일의 년도 정보가 필요합니다.",
			"birthday.year.numeric" => "생년월일의 년도 정보가 잘못되었습니다.",
			"birthday.month.required" => "생년월일의 월 정보가 필요합니다.",
			"birthday.month.numeric" => "생년월일의 월 정보가 잘못되었습니다.",
			"birthday.day.required" => "생년월일의 일 정보가 필요합니다.",
			"birthday.day.numeric" => "생년월일의 일 정보가 잘못되었습니다.",
			"address.required" => "주소가 필요합니다.",
			"address_detail.required" => "상세 주소가 필요합니다.",
			"gender.in" => "성별이 올바르지 않습니다.",
			"grade.integer" => "학년 값이 올바르지 않습니다.",
			"school.string" => "학교 값이 올바르지 않습니다.",
		];
	}
}
