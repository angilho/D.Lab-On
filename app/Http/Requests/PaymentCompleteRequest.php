<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Cart;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class PaymentCompleteRequest extends FormRequest
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
			"imp_uid" => "required|string",
			"merchant_uid" => "required|string",
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
			"imp_uid.required" => "결제 완료 정보가 필요합니다.",
			"imp_uid.string" => "결제 완료 정보가 이상합니다.",
			"merchant_uid.required" => "결제 완료 정보가 필요합니다.",
			"merchant_uid.string" => "결제 완료 정보가 이상합니다.",
		];
	}
}