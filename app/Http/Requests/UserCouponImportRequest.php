<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserCouponImportRequest extends FormRequest
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
			"coupons" => "required|array",
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
			"coupons.required" => "쿠폰 정보가 없습니다.",
		];
	}
}
