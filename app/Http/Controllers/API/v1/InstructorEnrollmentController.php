<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\InstructorEnrollmentStoreRequest;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseSection;
use App\Constants\EnrollmentStatus;

class InstructorEnrollmentController extends Controller
{
	/**
	 * 강사 회원 사용자의 수강 신청을 등록한다.
	 */
	public function store(InstructorEnrollmentStoreRequest $request, $userId)
	{
		$validated = $request->validated();

		try {
			// 사용자를 찾는다.
			$user = User::where("id", $userId)->firstOrFail();

			// 과목을 찾는다.
			$course = Course::where("id", $validated["course_id"])->firstOrFail();

			// 과목에 연결된 section 정보를 찾는다.
			$courseSection = CourseSection::where([
				["course_id", $course->id],
				["id", $validated["section_id"]],
			])->firstOrFail();

			// 수강 신청 정보를 생성한다.
			$enrollment = Enrollment::updateOrCreate([
				"user_id" => $user->id,
				"course_id" => $course->id,
				"course_section_id" => $courseSection->id,
				"status" => EnrollmentStatus::COMPLETE,
			]);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($enrollment, 201);
	}

	/**
	 * 강사 회원 사용자의 Enrollment를 취소한다.
	 */
	public function destroy(Request $request, $userId, $enrollmentId)
	{
		try {
			Enrollment::where([["id", $enrollmentId], ["user_id", $userId]])->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
