<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganizationStoreRequest extends FormRequest
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
			"name" => "required|string",
			"start_at" => "required|date",
			"end_at" => "required|date",
			"path" => "required|string|unique:organizations,path",
			"memo" => "nullable|string",
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
			"name.required" => "기업명이 필요합니다.",
			"start_at.required" => "사용 시작일이 필요합니다.",
			"start_at.date" => "사용 시작일이 잘못되었습니다.",
			"end_at.required" => "사용 종료일이 필요합니다.",
			"end_at.date" => "사용 종료일이 잘못되었습니다.",
			"path.required" => "접속링크가 필요합니다.",
			"path.unique" => "중복된 접속링크가 존재합니다.",
		];
	}
}