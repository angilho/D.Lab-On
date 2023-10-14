<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use App\Constants\CourseType;

class CourseUpdateRequest extends FormRequest
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

	public function validationData()
	{
		$all = parent::validationData();
		$all["closed"] = filter_var($all["closed"], FILTER_VALIDATE_BOOLEAN);
		$all["enable_elice_course"] = filter_var($all["enable_elice_course"], FILTER_VALIDATE_BOOLEAN);
		$all["support_class"] = filter_var($all["support_class"], FILTER_VALIDATE_BOOLEAN);
		$all["b2b_class"] = filter_var($all["b2b_class"], FILTER_VALIDATE_BOOLEAN);
		// discount_price가 null로 넘어오는 경우 0으로 처리
		if (!isset($all["discount_price"])) {
			$all["discount_price"] = 0;
		}

		return $all;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			"name" => "required|string",
			"type" => ["required", "string", Rule::in(CourseType::all())],
			"thumbnail" => "nullable",
			"closed" => "required|boolean",
			"student_target" => "required|string",
			"elice_course_id" => "nullable|string",
			"enable_elice_course" => "required|boolean",
			"price" => "required|integer",
			"discount_price" => "nullable|integer",
			"discount_text" => "nullable|string",
			"duration_week" => "required|integer",
			"duration_hour" => "required|integer",
			"duration_minute" => "required|integer",
			"dlab_course_code" => "required|string",
			"curriculum_keyword" => "nullable|string",
			"curriculum_target_keyword" => "nullable|string",
			"short_description" => "nullable|string",
			"sections" => "required_unless:type,vod|array",
			"support_class" => "boolean",
			"b2b_class" => "boolean",
			$this->sectionRules(),
		];
	}

	private function sectionRules()
	{
		return [
			"sections.*.target_group" => "required|integer",
			"sections.*.target_grade" => "nullable|string",
			"sections.*.max_student" => "required|integer",
			"sections.*.start_at" => "required|datetime",
			"sections.*.end_at" => "required|datetime",
			"sections.*.recruit_start_at" => "required|datetime",
			"sections.*.recruit_end_at" => "required|datetime",
			"sections.*.cycle_week" => "nullable|integer",
			"sections.*.start_hour" => "nullable|integer",
			"sections.*.start_minute" => "nullable|integer",
			"sections.*.end_hour" => "nullable|integer",
			"sections.*.end_minute" => "nullable|integer",
			"sections.*.duration_day" => "nullable|array",
			"sections.*.zoom_url" => "required|string",
			"sections.*.zoom_password" => "nullable|string",
			"sections.*.zoom_id" => "nullable|string",
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
			"name.required" => "과목명이 없습니다.",
			"name.string" => "과목명은 문자만 입력 가능합니다",
			"type.required" => "과목 유형이 없습니다.",
			"type.string" => "과목 형식이 이상합니다.",
			"type.in" => "올바른 과목 형식이 아닙니다.",
			"closed.required" => "썸네일에 수강 신청 공개 & 비공개 표시 정보가 없습니다.",
			"closed.boolean" => "썸네일에 수강 신청 공개 & 비공개 표시 값이 잘못되었습니다.",
			"student_target.required" => "대상이 없습니다.",
			"student_target.string" => "대상은 문자만 입력 가능합니다.",
			"elice_course_id.string" => "엘리스 과목 아이디가 잘못되었습니다.",
			"enable_elice_course.boolean" => "엘리스 연동 여부 값이 잘못되었습니다.",
			"price.required" => "수강료가 없습니다.",
			"price.integer" => "수강료의 값이 잘못되었습니다.",
			"discount_price.integer" => "할인 가격이 잘못되었습니다.",
			"duration_week.required" => "수업 주차가 없습니다",
			"duration_week.integer" => "수업 주차 값이 이상합니다.",
			"duration_hour.required" => "수업 진행 시간의 '시간'이 없습니다.",
			"duration_hour.integer" => "수업 진행 시간의 '시간'의 값이 이상합니다.",
			"duration_minute.required" => "수업 진행 시간의 '분'이 없습니다.",
			"duration_minute.integer" => "수업 진행 시간의 '분'의 값이 이상합니다.",
			"sections.required" => "생성된 수업이 없습니다.",
			"sections.array" => "생성된 수업이 없습니다.",
			"dlab_course_code.required" => "디랩 과목 코드가 없습니다.",
			"dlab_course_code.string" => "디랩 과목 코드의 내용이 잘못되었습니다.",
			$this->sectionMessages(),
		];
	}

	private function sectionMessages()
	{
		return [
			"sections.*.target_group.required" => "대상의 학부가 필요합니다.",
			"sections.*.target_group.integer" => "대상의 학부 값이 잘못되었습니다.",
			"sections.*.target_grade.string" => "대상의 학년 값이 잘못되었습니다.",
			"sections.*.max_student.required" => "수업 정원이 필요합니다.",
			"sections.*.max_student.integer" => "수업 정원의 값이 잘못되었습니다.",
			"sections.*.start_at.required" => "수업 시작일이 필요합니다.",
			"sections.*.start_at.datetime" => "수업 시작일의 값이 잘못되었습니다.",
			"sections.*.end_at.required" => "수업 종료일이 필요합니다.",
			"sections.*.end_at.datetime" => "수업 종료일의 값이 잘못되었습니다.",
			"sections.*.recruit_start_at.required" => "수업 모집 시작일이 필요합니다.",
			"sections.*.recruit_start_at.datetime" => "수업 모집 시작일의 값이 잘못되었습니다.",
			"sections.*.recruit_end_at.required" => "수업 모집 종료일이 필요합니다.",
			"sections.*.recruit_end_at.datetime" => "수업 모집 종료일의 값이 잘못되었습니다.",
			"sections.*.cycle_week.required" => "수업 주차가 필요합니다.",
			"sections.*.cycle_week.integer" => "수업 주차의 값이 잘못되었습니다.",
			"sections.*.start_hour.required" => "수업 시작 시간이 필요합니다.",
			"sections.*.start_hour.integer" => "수업 시작 시간 값이 잘못되었습니다.",
			"sections.*.start_minute.required" => "수업 시작 분이 필요합니다.",
			"sections.*.start_minute.integer" => "수업 시작 분이 잘못되었습니다.",
			"sections.*.end_hour.required" => "수업 종료 시간이 필요합니다.",
			"sections.*.end_hour.integer" => "수업 종료 시간 값이 잘못되었습니다.",
			"sections.*.end_minute.required" => "수업 종료 분이 필요합니다.",
			"sections.*.end_minute.integer" => "수업 종료 분이 잘못되었습니다.",
			"sections.*.duration_day.required" => "선택한 요일이 없습니다.",
			"sections.*.duration_day.array" => "선택한 요일의 정보가 잘못되었습니다.",
			"sections.*.zoom_url.required" => "ZOOM URL이 필요합니다.",
			"sections.*.zoom_url.string" => "ZOOM URL의 값이 잘못되었습니다.",
			"sections.*.zoom_password.string" => "ZOOM 비밀번호의 값이 잘못되었습니다.",
			"sections.*.zoom_id.required" => "ZOOM ID가 필요합니다.",
			"sections.*.zoom_id.string" => "ZOOM ID의 값이 잘못되었습니다.",
		];
	}
}
