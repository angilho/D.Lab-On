<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Filter\SupportCourseEnrollmentSearchFilter;
use App\Http\Requests\SupportClassEnrollmentImportRequest;
use App\Http\Requests\SupportClassEnrollmentExtendRequest;
use App\Models\Enrollment;
use App\Models\SupportClassEnrollment;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\SupportClassHistory;
use App\Constants\CourseType;
use App\Constants\EnrollmentStatus;
use App\Constants\SupportClassHistoryAction;

class SupportClassEnrollmentController extends Controller
{
	/**
	 * 전체 사용자의 보충수업 Enrollment 정보를 구한다.
	 */
	public function index(Request $request)
	{
		$campus = $request->input("campus");

		return QueryBuilder::for(Enrollment::class)
			->with(["course", "user", "supportClassEnrollment"])
			->whereHas("course", function ($q) {
				return $q->where([["courses.type", CourseType::VOD], ["courses.support_class", true]]);
			})
			->whereHas("user", function ($q) use ($campus) {
				if (!isset($campus) || $campus == -1) {
					return $q;
				}
				return $q->where("users.campus", $campus);
			})
			->allowedFilters([AllowedFilter::custom("search", new SupportCourseEnrollmentSearchFilter())])
			->paginate(30);
	}

	/**
	 * 사용자의 보충수업 Enrollment를 취소한다.
	 */
	public function destroy(Request $request)
	{
		$enrollmentIds = $request->input("enrollment_ids");

		try {
			$workUser = $request->user();
			$enrollments = Enrollment::whereIn("id", $enrollmentIds);

			// 수강 신청 History를 생성한다.
			$enrollments->each(function ($enrollment) use ($workUser) {
				SupportClassHistory::create([
					"work_user_id" => $workUser->id,
					"target_user_id" => $enrollment->user_id,
					"target_course_id" => $enrollment->course_id,
					"target_section_id" => $enrollment->course_section_id,
					"action" => SupportClassHistoryAction::CANCEL,
				]);
			});

			$enrollments->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 사용자의 보충수업 수강 신청을 일괄 등록한다.
	 */
	public function import(SupportClassEnrollmentImportRequest $request)
	{
		$validated = $request->validated();

		try {
			$workUser = $request->user();
			$createdEnrollments = [];
			$failedUserLogin = [];
			foreach ($validated["enrollments"] as $importEnrollment) {
				$userLogin = $importEnrollment["user_login"];
				$courseCode = $importEnrollment["course_code"];

				// 값이 모두 있는지 확인
				if (!$userLogin || !$courseCode) {
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
				// 과목이 VOD가 아니고, 보충수업이 아니면 수강신청을 받지 않는다.
				$course = Course::where([["dlab_course_code", $courseCode], ["support_class", true]])->first();
				if (!$course || $course->type != CourseType::VOD) {
					$failedUserLogin[] = $userLogin;
					continue;
				}

				// 과목에 연결된 section 정보를 찾는다.
				// VOD 클래스이기 때문에 section 정보는 하나만 존재한다.
				$courseSection = CourseSection::where("course_id", $course->id)->first();
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

				// 보충수업 수강 신청 관련 정보를 생성한다.
				$classEndAt = Carbon::now()
					->setTimezone("Asia/Seoul")
					->addDay(9)
					->setHours(23)
					->setMinutes(59)
					->setSeconds(59)
					->setTimezone("UTC");
				SupportClassEnrollment::create([
					"enrollment_id" => $enrollment->id,
					"class_end_at" => $classEndAt,
				]);

				// 수강 신청 History를 생성한다.
				SupportClassHistory::create([
					"work_user_id" => $workUser->id,
					"target_user_id" => $user->id,
					"target_course_id" => $course->id,
					"target_section_id" => $courseSection->id,
					"action" => SupportClassHistoryAction::REGISTER,
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

	/**
	 * 사용자의 보충수업 만료일을 변경한다.
	 */
	public function extend(SupportClassEnrollmentExtendRequest $request)
	{
		$validated = $request->validated();

		try {
			$updatedSupportClassEnrollments = [];
			foreach ($validated["enrollment_ids"] as $extendEnrollmentId) {
				// 보충수업 수강 신청 관련 정보를 생성한다.
				$classEndAt = Carbon::now()
					->setTimezone("Asia/Seoul")
					->addDay(9)
					->setHours(23)
					->setMinutes(59)
					->setSeconds(59)
					->setTimezone("UTC");

				// 보충수업 수강신청 정보를 갱신한다.
				$supportClassEnrollment = SupportClassEnrollment::updateOrCreate(
					[
						"enrollment_id" => $extendEnrollmentId,
					],
					[
						"class_end_at" => $classEndAt,
					]
				);

				$updatedSupportClassEnrollments[] = $supportClassEnrollment;
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($updatedSupportClassEnrollments, 200);
	}
}
