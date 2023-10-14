<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SmsNotificationStoreRequest extends FormRequest
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
			"type" => "required|string",
			"name" => "required|string",
			"course_id" => "required|integer|exists:courses,id",
			"section_id" => "required|integer|exists:course_sections,id",
			"receiver" => "required|string",
			"receiver_list" => "array",
			"start_at" => "required|date",
			"end_at" => "required|date",
			"reserved_hour" => "required|integer",
			"reserved_minute" => "required|integer",
			"sms_title" => "required|string",
			"sms_description" => "required|string",
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
			"type.required" => "노티 유형이 필요합니다.",
			"name.required" => "노티 제목이 필요합니다.",
			"course_id.required" => "과목 정보가 필요합니다.",
			"course_id.integer" => "과목 정보가 잘못되었습니다.",
			"course_id.exists" => "과목 정보가 없습니다.",
			"section_id.required" => "과목 회차 정보가 필요합니다.",
			"section_id.integer" => "과목 회차 정보가 잘못되었습니다.",
			"section_id.exists" => "과목 회차 정보가 없습니다.",
			"receiver.required" => "수신자 정보가 없습니다.",
			"start_at.required" => "예약발송 시작일이 필요합니다.",
			"start_at.date" => "예약발송 시작일이 잘못되었습니다.",
			"end_at.required" => "예약발송 종료일이 필요합니다.",
			"end_at.date" => "예약발송 종료일이 잘못되었습니다.",
			"reserved_hour.required" => "예약발송 시작 시간이 필요합니다.",
			"reserved_minute.required" => "예약발송 시작 분이 필요합니다.",
			"sms_title.required" => "발송 문구 제목이 필요합니다.",
			"sms_description.required" => "발송 문구 내용이 필요합니다.",
		];
	}
}
