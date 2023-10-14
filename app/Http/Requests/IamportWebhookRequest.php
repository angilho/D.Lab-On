<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IamportWebhookRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		//ip대역 체크
		//https://docs.iamport.kr/tech/webhook
		//52.78.100.19 - 52.78.48.223
		$clientIp = $this->ip();

		if ($clientIp === "52.78.100.19" || $clientIp === "52.78.48.223") {
			return true;
		}

		return false;
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
			"status" => "required|string",
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
			"imp_uid.required" => "필수 정보가 누락되었습니다.",
			"imp_uid.string" => "필수 정보가 잘못되었습니다.",
			"merchant_uid.required" => "필수 정보가 누락되었습니다.",
			"merchant_uid.string" => "필수 정보가 잘못되었습니다.",
			"status.required" => "필수 정보가 누락되었습니다.",
			"status.string" => "필수 정보가 잘못되었습니다.",
		];
	}
}