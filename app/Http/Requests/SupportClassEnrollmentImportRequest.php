<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupportClassEnrollmentImportRequest extends FormRequest
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
			"enrollments" => "required|array",
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
			"enrollments.required" => "수강 신청 정보가 없습니다.",
		];
	}
}
