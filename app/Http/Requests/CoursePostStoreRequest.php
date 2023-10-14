<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use App\Constants\CoursePostType;

class CoursePostStoreRequest extends FormRequest
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
		$all["private"] = filter_var($all["private"], FILTER_VALIDATE_BOOLEAN);
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
			"user_id" => ["required", "integer", Rule::exists("users", "id")],
			"type" => ["required", "string", Rule::in(CoursePostType::all())],
			"title" => "required|string",
			"description" => "nullable|string",
			"attachment" => "nullable",
			"private" => "required|boolean",
			"status" => "required|string",
			"order" => "nullable|integer",
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
			"user_id.required" => "사용자가 없습니다.",
			"type.required" => "글 유형이 없습니다.",
			"type.in" => "올바른 글 유형이 아닙니다.",
			"title.required" => "제목이 없습니다.",
			"title.string" => "제목이 잘못되었습니다.",
			"description.string" => "내용이 잘못되었습니다.",
			"private.required" => "비공개 정보가 없습니다.",
			"private.boolean" => "비공개 값이 잘못되었습니다.",
			"status.required" => "글 상태가 없습니다.",
			"status.string" => "글 상태가 잘못되었습니다.",
		];
	}
}