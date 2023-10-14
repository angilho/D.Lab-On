<?php

namespace App\Http\Controllers\API\v1;

use DB;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Http\Requests\AttendanceSectionsDeleteRequest;
use App\Http\Requests\AttendancesStoreRequest;
use App\Models\AttendanceSection;
use App\Models\AttendanceStudent;
use App\Models\User;
use App\Models\Child;
use App\Constants\Role;
use App\Container\CoolSms\CoolSmsAPI;

class AttendanceSectionController extends Controller
{
	/**
	 * ID에 매칭되는 출결 차시 정보를 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($attendanceCourseId, $attendanceSectionId)
	{
		return AttendanceSection::with(["attendanceCourse", "attendanceStudents"])
			->where([["attendance_course_id", $attendanceCourseId], ["id", $attendanceSectionId]])
			->firstOrFail();
	}

	/**
	 * 출결 차시를 삭제한다.
	 */
	public function sectionsDelete(AttendanceSectionsDeleteRequest $request, $attendanceCourseId)
	{
		$validated = $request->validated();

		try {
			DB::beginTransaction();

			foreach ($validated["attendance_section_ids"] as $attendanceSectionId) {
				AttendanceSection::where([
					["attendance_course_id", $attendanceCourseId],
					["id", $attendanceSectionId],
				])->delete();
			}

			DB::commit();
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 출결 정보를 기록한다.
	 */
	public function storeAttendances(AttendancesStoreRequest $request, $attendanceCourseId, $attendanceSectionId)
	{
		$validated = $request->validated();

		try {
			DB::beginTransaction();

			$attendanceStudents = [];
			foreach ($validated["students"] as $student) {
				$attendanceStudent = AttendanceStudent::create([
					"user_id" => $student["user_id"],
					"attendance_course_id" => $attendanceCourseId,
					"attendance_section_id" => $attendanceSectionId,
					"attendance" => $student["attendance"],
				]);
				$attendanceStudents[] = $attendanceStudent;
			}

			$attendanceSection = AttendanceSection::where([
				["attendance_course_id", $attendanceCourseId],
				["id", $attendanceSectionId],
			])->first();
			$attendanceSection->update([
				"attendance_at" => Carbon::now(),
				"attendance_checked" => true,
			]);

			DB::commit();

			// 출결이 완료된 학생들의 부모에게 SMS 알림을 보낸다.
			// 부모가 없는 경우에는 SMS 알림을 보내지 않는다.
			foreach ($attendanceStudents as $attendanceStudent) {
				// 출석한 경우
				if ($attendanceStudent->attendance) {
					$studentUser = User::find($attendanceStudent->user_id);
					// 자녀 Role인 경우
					if ($studentUser->role === Role::CHILD) {
						$parent = Child::where("child_id", $attendanceStudent->user_id)->first();
						// 부모가 설정되어 있는 경우
						if ($parent) {
							$parentUser = User::find($parent->parent_id);
							$parentPhone = $parentUser->phone;
							$this->sendAttendanceCoolSmsMessage([$parentPhone], $studentUser->name);
						}
					}
				}
			}
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($attendanceStudents, 201);
	}

	/**
	 * 메세지를 전송한다.
	 */
	private function sendAttendanceCoolSmsMessage($messagesTo, $studentName)
	{
		// cool sms 전송을 위한 양식으로 변경한다.
		// 한번에 1000건까지 보낼 수 있다.
		$coolSmsApi = new CoolSmsAPI();
		$messagesFrom = "031-526-9313";
		$messageTitle = "[디랩온 라이브 클래스]";
		$currentTime = Carbon::now()
			->timezone("Asia/Seoul")
			->format("H:i");
		$messageDescription = "{$studentName} 학생이 {$currentTime}에 출석 하였습니다.";

		$messagesToArray = array_chunk($messagesTo, 1000);
		foreach ($messagesToArray as $messagesTo) {
			$coolSmsMessages = [];
			foreach ($messagesTo as $to) {
				$coolSmsMessages[] = [
					"from" => str_replace("-", "", $messagesFrom),
					"to" => str_replace("-", "", $to),
					"text" => $messageTitle . PHP_EOL . $messageDescription,
				];
			}
			$coolSmsApi->sendMessage($coolSmsMessages);
		}
	}
}
