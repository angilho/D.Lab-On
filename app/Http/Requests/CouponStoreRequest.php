<?php

namespace App\Http\Requests;

use App\Constants\CouponCategory;
use App\Constants\CouponType;
use Illuminate\Foundation\Http\FormRequest;

class CouponStoreRequest extends FormRequest
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
			"category" => "required|in:" . implode(",", CouponCategory::all()),
			"type" => "required|in:" . implode(",", CouponType::all()),
			"name" => "required|string",
			"code" => "nullable|string|unique:coupons,code",
			"value" => "required|numeric",
			"count" => "nullable|numeric",
			"end_at" => "nullable|date",
			"course_type" => "required|string",
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
			"category.required" => "쿠폰 유형이 필요합니다.",
			"type.required" => "쿠폰 종류가 필요합니다.",
			"name.required" => "쿠폰 제목이 필요합니다.",
			"code.unique" => "쿠폰 코드가 중복입니다.",
			"value.numeric" => "할인 금액이 잘못되었습니다.",
			"count.numeric" => "발급매수가 잘못되었습니다.",
			"end_at.date" => "쿠폰 유효기간이 잘못되었습니다.",
			"course_type.required" => "쿠폰사용 강좌 타입이 필요합니다.",
		];
	}
}