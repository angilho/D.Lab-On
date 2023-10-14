<?php

namespace App\Http\Controllers\API\v1;

use DB;
use App\Http\Controllers\Controller;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Requests\AttendanceCourseStoreRequest;
use App\Http\Requests\AttendancesUpdateRequest;
use App\Filter\AttendanceCourseSearchFilter;
use App\Models\AttendanceCourse;
use App\Models\AttendanceSection;
use App\Models\AttendanceStudent;
use Illuminate\Http\Request;
use App\Constants\Role;

class AttendanceCourseController extends Controller
{
	/**
	 * 전체 출결 관리 과목 목록을 표시한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request)
	{
		$user = $request->user();

		$instructorId = null;
		if ($user->role == Role::INSTRUCTOR) {
			$instructorId = $user->id;
		}

		return QueryBuilder::for(AttendanceCourse::class)
			->with(["instructor"])
			->when($instructorId, function ($q) use ($instructorId) {
				return $q->where("instructor_id", $instructorId);
			})
			->allowedFilters([AllowedFilter::custom("search", new AttendanceCourseSearchFilter())])
			->paginate(30);
	}

	/**
	 * ID에 매칭되는 출결 관리 과목을 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		return AttendanceCourse::with(["attendanceSection"])->findOrFail($id);
	}

	/**
	 * 출결 관리 과목을 추가한다.
	 *
	 * @param  App\Http\Requests\AttendanceCourseStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(AttendanceCourseStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			// 출결 관리 과목을 생성한다.
			$attendanceCourse = AttendanceCourse::create($validated);

			// 출결 대상 차시를 생성한다.
			$totalAttendanceSection = $validated["total_attendance_section"];

			for ($i = 0; $i < $totalAttendanceSection; $i++) {
				AttendanceSection::create([
					"attendance_course_id" => $attendanceCourse->id,
					"index" => $i + 1,
				]);
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($attendanceCourse, 201);
	}

	/**
	 * 출결 대상 과목의 특정 사용자의 전체 출결 기록을 얻는다.
	 */
	public function studentAttendances($attendanceCourseId, $studentId)
	{
		$studentAttendances = AttendanceStudent::where([
			["attendance_course_id", $attendanceCourseId],
			["user_id", $studentId],
		])
			->with(["attendanceSection"])
			->orderBy("attendance_section_id", "asc")
			->get();

		return response()->json($studentAttendances, 200);
	}

	/**
	 * 출결 대상 과목의 특정 사용자의 출결 기록을 업데이트 한다.
	 */
	public function updateStudentAttendances(AttendancesUpdateRequest $request, $attendanceCourseId, $studentId)
	{
		$validated = $request->validated();

		try {
			DB::beginTransaction();

			$attendanceStudents = [];
			foreach ($validated["student_attendances"] as $studentAttendance) {
				$attendanceStudent = AttendanceStudent::where([
					"user_id" => $studentId,
					"attendance_course_id" => $attendanceCourseId,
					"attendance_section_id" => $studentAttendance["attendance_section_id"],
				])->first();
				$attendanceStudent->update([
					"attendance" => $studentAttendance["attendance"],
				]);
				$attendanceStudents[] = $attendanceStudent;
			}

			DB::commit();
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($attendanceStudents, 201);
	}
}
