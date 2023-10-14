<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Arr;
use App\Constants\Role;
use App\Constants\Gender;
use App\Constants\PaymentStatus;
use Route;

class PaymentUpdateRequest extends FormRequest
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
			"status" => ["required", "string", Rule::in(PaymentStatus::all())],
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
			"status.required" => "올바른 결제상태가 아닙니다.",
			"status.string" => "올바른 결제정보가 아닙니다.",
			"status.in" => "올바른 결제정보가 아닙니다.",
		];
	}
}