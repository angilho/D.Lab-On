<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendancesUpdateRequest extends FormRequest
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
		if (isset($all["student_attendances"])) {
			$studentAttendances = collect($all["student_attendances"])
				->map(function ($studentAttendance) {
					$studentAttendance["attendance"] = filter_var(
						$studentAttendance["attendance"],
						FILTER_VALIDATE_BOOLEAN
					);
					return $studentAttendance;
				})
				->toArray();
			$all["student_attendances"] = $studentAttendances;
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
			"student_attendances" => "required|array",
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
			"student_attendances.required" => "출석 정보가 없습니다.",
		];
	}
}
