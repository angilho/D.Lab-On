<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SmsNotificationUpdateRequest extends FormRequest
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
			"type" => "string",
			"name" => "string",
			"course_id" => "integer|exists:courses,id",
			"course_section_id" => "integer|exists:course_sections,id",
			"receiver" => "string",
			"receiver_list" => "array",
			"start_at" => "date",
			"end_at" => "date",
			"reserved_hour" => "integer",
			"reserved_minute" => "integer",
			"sms_title" => "string",
			"sms_description" => "string",
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
			"course_id.integer" => "과목 정보가 잘못되었습니다.",
			"course_id.exists" => "과목 정보가 없습니다.",
			"course_section_id.integer" => "과목 회차 정보가 잘못되었습니다.",
			"course_section_id.exists" => "과목 회차 정보가 없습니다.",
			"start_at.date" => "예약발송 시작일이 잘못되었습니다.",
			"end_at.date" => "예약발송 종료일이 잘못되었습니다.",
		];
	}
}
