<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use App\Http\Requests\EnrollmentStoreRequest;
use App\Http\Requests\EnrollmentUpdateRequest;
use App\Models\Child;
use App\Models\Enrollment;
use App\Models\Course;
use App\Constants\EnrollmentStatus;

use Exception;

class EnrollmentController extends Controller
{
	/**
	 * 전체 수강 신청 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request, $id)
	{
		$isSupportClass = $request->input("support_class") || false;

		$enrollments = QueryBuilder::for(Enrollment::class)
			->allowedFilters(["status"])
			->with(["course", "courseSection", "user", "supportClassEnrollment"])
			->where([["user_id", "=", $id]])
			->whereHas("course", function ($q) use ($isSupportClass) {
				$q->where("courses.support_class", $isSupportClass);
			})
			->get();

		$status = $request->input("filter.status");
		$childrenEnrollments = QueryBuilder::for(Child::class)
			->with([
				"enrollment" => function ($q) use ($status) {
					$q->where("status", "=", $status);
				},
				"enrollment.course",
				"enrollment.courseSection",
				"enrollment.supportClassEnrollment",
			])
			->where([["parent_id", "=", $id]])
			->get();

		$childrenEnrollments = $childrenEnrollments->map(function ($child) use ($isSupportClass) {
			if (isset($child->enrollment)) {
				$filteredEnrollment = $child->enrollment
					->filter(function ($childEnrollment) use ($isSupportClass) {
						return $childEnrollment->course->support_class == $isSupportClass;
					})
					->values();

				unset($child->enrollment);
				$child->enrollment = $filteredEnrollment;
			}

			return $child;
		});

		return response()->json(["enrollments" => $enrollments, "children_enrollments" => $childrenEnrollments], 201);
	}

	/**
	 * 신규 수강 신청 정보를 추가한다.
	 *
	 * @param  App\Http\Requests\EnrollmentStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(EnrollmentStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			$enrollment = Enrollment::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($enrollment, 201);
	}

	/**
	 * ID에 매칭되는 수강 신청 정보를 구한다.
	 *
	 * @param  int  	$id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id, $enrollmentId)
	{
		return Enrollment::with(["course", "courseSection"])
			->where("id", $enrollmentId)
			->findOrFail($id);
	}

	/**
	 * 수강 신청 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\EnrollmentUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(EnrollmentUpdateRequest $request, $id)
	{
		$validated = $request->validated();

		$enrollment = Enrollment::findOrFail($id);
		try {
			$enrollment->fill($validated);
			if (!$enrollment->isDirty()) {
				return response()->noContent();
			}
			$enrollment->save();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($enrollment, 201);
	}

	/**
	 * 수강 신청 정보를 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		$enrollment = Enrollment::findOrFail($id);
		try {
			$enrollment->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 전체 사용자의 Enrollment 정보를 구한다.
	 */
	public function getUserEnrollments()
	{
		return QueryBuilder::for(Enrollment::class)
			->allowedFilters(["user.name", "course_section_id"])
			->with(["course", "courseSection", "user.userMetadata"])
			->paginate(30);
	}

	/**
	 * 전체 과목의 Enrollment 정보를 구한다.
	 * - 현재 수강 신청한 Enrollment 수
	 * - 전체 수강 신청한 Enrollment 수
	 */
	public function getCoursesEnrollments()
	{
		$now = date("Y-m-d");
		$courses = Course::with("sections")->get();
		foreach ($courses as $course) {
			$totalEnrollmentCount = 0;
			$currentEnrollmentCount = 0;
			foreach ($course->sections as $section) {
				$totalEnrollmentCount += $section->enrollment_count;
				if ($section->start_at->format("Y-m-d") <= $now && $section->end_at->format("Y-m-d") >= $now) {
					$currentEnrollmentCount += $section->enrollment_count;
				}
			}
			$course->enrollment_count = $totalEnrollmentCount;
			$course->current_enrollment_count = $currentEnrollmentCount;
		}

		return $courses;
	}

	/**
	 * 특정 과목의 Enrollment 정보를 구한다.
	 */
	public function getCourseEnrollments($courseId)
	{
		$now = date("Y-m-d");
		$enrollments = QueryBuilder::for(Enrollment::class)
			->with(["course", "courseSection", "user"])
			->where([["course_id", "=", $courseId]])
			->whereHas("courseSection", function ($q) use ($now) {
				return $q->where("course_sections.start_at", "<=", $now)->where("course_sections.end_at", ">=", $now);
			})
			->paginate(10);

		return response()->json($enrollments, 200);
	}

	/**
	 * 특정 과목의 특정 차시의 Enrollment 정보를 구한다.
	 */
	public function getCourseSectionEnrollments($courseId, $sectionId)
	{
		$enrollments = Enrollment::with(["user"])
			->where([
				["course_id", "=", $courseId],
				["course_section_id", "=", $sectionId],
				["status", "=", EnrollmentStatus::COMPLETE],
			])
			->get();

		return response()->json($enrollments, 200);
	}
}
