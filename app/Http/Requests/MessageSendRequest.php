<?php

namespace App\Http\Requests;

use App\Constants\CouponCategory;
use App\Constants\CouponType;
use Illuminate\Foundation\Http\FormRequest;

class MessageSendRequest extends FormRequest
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
			"from" => "required|string",
			"to" => "required|array",
			"title" => "required|string",
			"description" => "required|string",
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
			"from.required" => "발신자 번호가 필요합니다.",
			"to.array" => "수신자 번호가 필요합니다.",
			"title.required" => "메세지 제목이 필요합니다.",
			"description.required" => "메세지 내용이 필요합니다.",
		];
	}
}