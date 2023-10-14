<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class OrganizationPostUpdateRequest extends FormRequest
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
			"title" => "required|string",
			"description" => "nullable|string",
			"attachment" => "nullable",
			"private" => "required|boolean",
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
			"title.required" => "제목이 없습니다.",
			"title.string" => "제목이 잘못되었습니다.",
			"description.string" => "내용이 잘못되었습니다.",
			"private.required" => "비공개 정보가 없습니다.",
			"private.boolean" => "비공개 값이 잘못되었습니다.",
		];
	}
}