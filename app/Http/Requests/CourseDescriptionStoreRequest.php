<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseDescriptionStoreRequest extends FormRequest
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
			"desktop_intro_image_file" => "nullable",
			"desktop_course_description" => "string|nullable",
			"desktop_course_curriculum" => "string|nullable",
			"desktop_operation" => "string|nullable",
			"desktop_refund" => "string|nullable",
			"mobile_intro_image_file" => "nullable",
			"mobile_course_description" => "string|nullable",
			"mobile_course_curriculum" => "string|nullable",
			"mobile_operation" => "string|nullable",
			"mobile_refund" => "string|nullable",
		];
	}

	/**
	 * Get the validation messages that apply to the request.
	 *
	 * @return array
	 */
	public function messages()
	{
		return [];
	}
}
