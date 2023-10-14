<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Filter\OrganizationEnrollmentSearchFilter;
use App\Http\Requests\OrganizationEnrollmentImportRequest;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseSection;
use App\Constants\CourseType;
use App\Constants\EnrollmentStatus;

class OrganizationEnrollmentController extends Controller
{
	/**
	 * B2B 전체 사용자의 Enrollment 정보를 구한다.
	 */
	public function index()
	{
		return QueryBuilder::for(Enrollment::class)
			->with(["course", "user", "user.organization"])
			->whereHas("user", function ($q) {
				return $q->whereNotNull("users.organization_id");
			})
			->allowedFilters([AllowedFilter::custom("search", new OrganizationEnrollmentSearchFilter())])
			->paginate(30);
	}

	/**
	 * B2B 사용자의 Enrollment를 취소한다.
	 */
	public function destroy(Request $request)
	{
		$enrollmentIds = $request->input("enrollment_ids");

		try {
			Enrollment::whereIn("id", $enrollmentIds)->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 사용자의 수강 신청을 일괄 등록한다.
	 */
	public function import(OrganizationEnrollmentImportRequest $request)
	{
		$validated = $request->validated();

		try {
			$createdEnrollments = [];
			$failedUserLogin = [];
			foreach ($validated["enrollments"] as $importEnrollment) {
				$userLogin = $importEnrollment["user_login"];
				$courseCode = $importEnrollment["course_code"];
				$sectionId = $importEnrollment["section_id"];

				// 값이 모두 있는지 확인
				if (!$userLogin || !$courseCode || !$sectionId) {
					$failedUserLogin[] = $userLogin;
					continue;
				}

				// 사용자를 찾는다.
				$user = User::where("user_login", $userLogin)->first();
				if (!$user) {
					$failedUserLogin[] = $userLogin;
					continue;
				}

				// 과목을 찾는다.
				// b2b_class column이 true가 아니면 받지 않는다.
				$course = Course::where("dlab_course_code", $courseCode)->first();
				if (!$course || $course->b2b_class != true) {
					$failedUserLogin[] = $userLogin;
					continue;
				}

				// VOD 클래스에서 모든 타입의 클래스로 범위가 늘어남에 따라 프론트에서 받은 section_id로 section 정보를 찾는다.
				$courseSection = CourseSection::where([["id", $sectionId], ["course_id", $course->id]])->first();
				if (!$courseSection) {
					$failedUserLogin[] = $userLogin;
					continue;
				}

				// 수강 신청 정보를 생성한다.
				$enrollment = Enrollment::updateOrCreate([
					"user_id" => $user->id,
					"course_id" => $course->id,
					"course_section_id" => $courseSection->id,
					"status" => EnrollmentStatus::COMPLETE,
				]);

				$createdEnrollments[] = $enrollment;
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		if (count($failedUserLogin) !== 0) {
			return response()->json(["failed_enrollments" => $failedUserLogin], 206);
		}

		return response()->json($createdEnrollments, 201);
	}
}
