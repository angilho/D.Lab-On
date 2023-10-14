<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use App\Models\Cart;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Enrollment;
use App\Constants\EnrollmentStatus;
use App\Constants\CourseType;
use Illuminate\Support\Facades\Auth;

class CartStoreRequest extends FormRequest
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
			"course_id" => "required|integer|exists:courses,id",
			"course_section_id" => "required|integer|exists:course_sections,id",
		];
	}

	public function withValidator($validator)
	{
		$validator->after(function ($validator) {
			$user_id = $this->route("user");
			$course_id = $this->request->get("course_id");
			$course_section_id = $this->request->get("course_section_id");

			$exists = Cart::where([
				"user_id" => $user_id,
				"course_id" => $course_id,
				"course_section_id" => $course_section_id,
			])->count();

			if ($exists) {
				$validator->errors()->add("exists", "장바구니에 이미 담긴 항목입니다.");
			}

			$enrollment = Enrollment::where([
				"user_id" => $user_id,
				"course_id" => $course_id,
				"course_section_id" => $course_section_id,
				"status" => EnrollmentStatus::COMPLETE,
			])->first();

			if ($enrollment) {
				// VOD 과목인 경우 1년이 지나면 다시 결제할 수 있도록 한다.
				$course = Course::where("id", $course_id)->first();
				if (isset($course) && $course->type === CourseType::VOD) {
					$endDate = Carbon::parse($enrollment->updated_at)
						->addYear(1)
						->subDays(1);
					$endDate->setHours(23);
					$endDate->setMinutes(59);
					$endDate->setSeconds(59);
					if (Carbon::now() < $endDate) {
						$validator->errors()->add("enrollment.exists", "이미 수강중인 과목입니다.");
					}
				} else {
					$validator->errors()->add("enrollment.exists", "이미 수강중인 과목입니다.");
				}
			}

			$courseSectionInfo = CourseSection::where(["id" => $course_section_id])->first();
			if ($courseSectionInfo->enrollment_count >= $courseSectionInfo->max_student) {
				$validator->errors()->add("maxCourse", "수강등록 인원이 가득 찼습니다.");
			}
		});
	}

	/**
	 * Get the validation messages that apply to the request.
	 *
	 * @return array
	 */
	public function messages()
	{
		return [
			"course_id.required" => "강의 정보가 필요합니다.",
			"course_id.integer" => "강의 정보가 잘못되었습니다.",
			"course_id.exists" => "강의 정보가 없습니다.",
			"course_section_id.required" => "강의 정보가 필요합니다.",
			"course_section_id.integer" => "강의 정보가 잘못되었습니다.",
			"course_section_id.exists" => "강의 정보가 없습니다.",
		];
	}
}
