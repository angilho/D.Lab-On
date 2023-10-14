<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Enrollment;
use App\Models\Course;
use App\Constants\EnrollmentStatus;
use App\Constants\CourseType;

class CheckEnrollment
{
	public function handle(Request $request, Closure $next, ...$abilities)
	{
		// 로그인 했는지 확인한다.
		$user = $request->user();
		if (!isset($user)) {
			return redirect("/login");
		}

		$courseId = $request->route("id");

		// 운영자는 항상 확인이 가능하다.
		$isAdmin = isset($user["role"]) && $user["role"] === 0;
		if ($isAdmin) {
			return $next($request);
		}

		// 사용자가 해당 과목에 수강 신청을 했는지 확인한다.
		$enrollment = Enrollment::where([
			"user_id" => $user->id,
			"course_id" => $courseId,
			"status" => EnrollmentStatus::COMPLETE,
		])->first();
		if (!isset($enrollment)) {
			abort(403, "Access denied");
		}

		// VOD 클래스인 경우에는 1년까지만 접근이 가능하다.
		$course = Course::where("id", $courseId)->first();
		if (isset($course) && $course->type === CourseType::VOD) {
			$endDate = Carbon::parse($enrollment->updated_at)->addYear(1);
			$endDate->setHours(23);
			$endDate->setMinutes(59);
			$endDate->setSeconds(59);

			if (Carbon::now() > $endDate) {
				abort(403, "Course Expired");
			}
		}

		return $next($request);
	}
}
