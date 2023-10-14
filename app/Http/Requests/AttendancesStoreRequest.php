<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendancesStoreRequest extends FormRequest
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
		if (isset($all["students"])) {
			$students = collect($all["students"])
				->map(function ($student) {
					$student["attendance"] = filter_var($student["attendance"], FILTER_VALIDATE_BOOLEAN);
					return $student;
				})
				->toArray();
			$all["students"] = $students;
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
			"students" => "required|array",
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
			"students.required" => "출석 정보가 없습니다.",
		];
	}
}
