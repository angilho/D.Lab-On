<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseChapterUpdateRequest extends FormRequest
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
			"chapters" => "required|array",
			"chapters.*.title" => "required|string",
			"chapters.*.description" => "nullable|string",
			"chapters.*.vods" => "required|array",
			"chapters.*.vods.*.title" => "required|string",
			"chapters.*.vods.*.vod_url" => "required|string",
			"chapters.*.vods.*.description" => "nullable|string",
			"chapters.*.vods.*.description_url" => "nullable|string",
			"chapters.*.resources" => "nullable|array",
			"chapters.*.need_quiz_pass" => "required",
			"chapters.*.quiz" => "required",
			"chapters.*.quiz.required_correct_count" => "required|integer",
			"chapters.*.quiz.questions" => "required|array",
			"chapters.*.quiz.questions.*.question" => "required|string",
			"chapters.*.quiz.questions.*.answers" => "required|array",
			"chapters.*.quiz.questions.*.answers.*.answer" => "required|string",
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
			"chapters.array" => "생성된 강의가 없습니다.",
			"chapters.*.title.required" => "강의의 제목이 없습니다.",
			"chapters.*.title.string" => "강의의 제목이 잘못되었습니다.",
			"chapters.*.description.string" => "강의의 안내문이 잘못되었습니다.",
			"chapters.*.vods.required" => "강의에 속한 동영상이 없습니다.",
			"chapters.*.vods.array" => "강의에 속한 동영상이 잘못되었습니다.",
			"chapters.*.vods.*.title.required" => "동영상의 제목이 없습니다.",
			"chapters.*.vods.*.title.string" => "동영상의 제목이 잘못되었습니다.",
			"chapters.*.vods.*.vod_url.required" => "강의 URL이 없습니다.",
			"chapters.*.vods.*.vod_url.string" => "강의 URL이 잘못되었습니다.",
			"chapters.*.vods.resources.array" => "강의에 속한 교안이 잘못되었습니다.",
			"chapters.*.need_quiz_pass.required" => "퀴즈 합격 시 다음 강 진행 값이 없습니다.",
			"chapters.*.quiz.required" => "퀴즈가 없습니다.",
			"chapters.*.quiz.required_correct_count.required" => "퀴즈 최소 정답수가 없습니다.",
			"chapters.*.quiz.required_correct_count.integer" => "퀴즈 최소 정답수가 잘못되었습니다.",
			"chapters.*.quiz.questions.required" => "퀴즈 문항이 없습니다.",
			"chapters.*.quiz.questions.array" => "퀴즈 문항이 잘못되었습니다.",
			"chapters.*.quiz.questions.*.question.required" => "퀴즈 질문이 없습니다.",
			"chapters.*.quiz.questions.*.question.string" => "퀴즈 질문이 잘못되었습니다.",
			"chapters.*.quiz.questions.*.answers.required" => "퀴즈 답변이 없습니다.",
			"chapters.*.quiz.questions.*.answers.array" => "퀴즈 답변이 잘못되었습니다.",
			"chapters.*.quiz.questions.*.answers.*.answer.required" => "퀴즈 답변이 없습니다.",
			"chapters.*.quiz.questions.*.answers.*.answer.string" => "퀴즈 답변이 잘못되었습니다.",
		];
	}
}