<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use App\Constants\CoursePostType;

class CoursePostcommentStoreRequest extends FormRequest
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
			"user_id" => ["required", "integer", Rule::exists("users", "id")],
			"comment" => "required|string",
			"attachment" => "nullable",
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
			"comment.required" => "답변이 없습니다.",
			"comment.string" => "답변이 잘못되었습니다.",
		];
	}
}