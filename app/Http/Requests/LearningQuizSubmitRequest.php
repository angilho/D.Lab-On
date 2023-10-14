<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LearningQuizSubmitRequest extends FormRequest
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
			"answers" => "required|array",
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
			"answers.required" => "퀴즈 답변이 필요합니다.",
		];
	}
}