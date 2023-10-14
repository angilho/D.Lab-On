<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Cart;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class PaymentStoreRequest extends FormRequest
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
			"method" => "required|string|in:card,vbank",
			"coupon_id" => "nullable|integer|exists:coupons,id",
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
			"method.required" => "결제 방법이 필요합니다.",
			"method.string" => "결제 방법의 값이 올바르지 않습니다.",
			"method.in" => "결제 방법의 값이 잘못되었습니다.",
			"coupon_id.integer" => "쿠폰 값이 잘못되었습니다.",
			"coupon_id.in" => "유효하지 않은 쿠폰입니다.",
		];
	}
}