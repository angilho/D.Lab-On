<?php

namespace App\Exports;

use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

use App\Models\AttendanceCourse;
use App\Models\AttendanceSection;
use App\Models\AttendanceStudent;
use App\Models\CourseSection;

class CourseAttendancesExport implements FromCollection, WithHeadings, WithProperties, WithColumnFormatting
{
	private $attendanceCourseId;

	function __construct($attendanceCourseId)
	{
		$this->attendanceCourseId = $attendanceCourseId;
	}

	public function properties(): array
	{
		return [
			"creator" => "D.LAB ON Admin Server",
			"title" => "D.LAB On Course Attendance List",
			"description" => "D.LAB On Course Attendance List",
			"manager" => "D.LAB ON Admin",
			"company" => "D.LAB ON",
		];
	}

	public function headings(): array
	{
		$attendanceCourse = AttendanceCourse::find($this->attendanceCourseId)
			->with(["instructor"])
			->first();
		$courseSection = CourseSection::find($attendanceCourse->section_id)->first();
		$durationDay = join(",", $courseSection->duration_day);
		$durationDay .= "요일";
		$durationTime = "{$courseSection->start_hour}:{$courseSection->start_minute} ~ {$courseSection->end_hour}:{$courseSection->end_minute}";

		$courseName = $attendanceCourse->course->name;
		$instructorName = $attendanceCourse->instructor->name;
		return [
			[$courseName],
			[$durationDay . " " . $durationTime],
			["담당강사 : " . $instructorName],
			["\n"],
			["차시", "날짜", "학생이름", "출결여부"],
		];
	}

	public function collection()
	{
		$attendances = AttendanceStudent::where("attendance_course_id", $this->attendanceCourseId)
			->with(["student", "attendanceSection"])
			->orderBy("user_id", "asc")
			->orderBy("attendance_section_id", "asc")
			->get();

		$attendanceSections = AttendanceSection::where("attendance_course_id", $this->attendanceCourseId)->get();

		$resultAttendances = [];

		$students = $attendances->unique("user_id")->toArray();
		foreach ($students as $student) {
			foreach ($attendanceSections as $attendanceSection) {
				$index = "{$attendanceSection->index}차시";
				$attendanceAt = $attendanceSection->attendance_at
					? Date::dateTimeToExcel(Carbon::parse($attendanceSection->attendance_at)->setTimezone("Asia/Seoul"))
					: "";
				$studentAttendance = $attendances
					->where("user_id", $student["user_id"])
					->where("attendance_section_id", $attendanceSection["id"])
					->first();

				$attendance = "";
				if ($studentAttendance) {
					if ($studentAttendance->attendance) {
						$attendance = "출석";
					} else {
						$attendance = "결석";
					}
				}
				$resultAttendances[] = [$index, $attendanceAt, $student["student"]["name"], $attendance];
			}
		}

		return collect($resultAttendances);
	}

	public function columnFormats(): array
	{
		return [
			// 날짜
			"B" => NumberFormat::FORMAT_DATE_YYYYMMDD,
		];
	}
}
