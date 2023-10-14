<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithProperties;

use App\Models\Course;
use App\Models\CourseChapter;
use App\Models\Enrollment;
use App\Constants\EnrollmentStatus;

class VodProgressRateExport implements FromCollection, WithHeadings, WithProperties
{
	private $vodCourseId;

	function __construct($vodCourseId)
	{
		$this->vodCourseId = $vodCourseId;
	}

	public function properties(): array
	{
		return [
			"creator" => "D.LAB ON Admin Server",
			"title" => "D.LAB On Vod Course Progress Rate",
			"description" => "D.LAB On Vod Course Progress Rate",
			"manager" => "D.LAB ON Admin",
			"company" => "D.LAB ON",
		];
	}

	public function headings(): array
	{
		// 전체 챕터와 챕터 정보를 구한다.
		// ex) 1강-동영상-(제목) / 1강-동영상-(제목) / 1강-퀴즈 / 2강-동영상-(제목) / 2강-퀴즈
		$vodCourse = Course::where("id", $this->vodCourseId)
			->with(["chapters"])
			->first();
		$vodCourseChapters = $vodCourse->chapters;

		$headings = ["아이디", "이름"];
		$vodCourseChapters->each(function ($vodCourseChapter) use (&$headings) {
			collect($vodCourseChapter->vods)->each(function ($vod) use ($vodCourseChapter, &$headings) {
				$headings[] = "{$vodCourseChapter->index}강-동영상-{$vod->title}";
			});
			$headings[] = "{$vodCourseChapter->index}강-퀴즈";
		});

		return $headings;
	}

	public function collection()
	{
		// 전체 챕터와 챕터 정보를 구한다.
		$vodCourse = Course::where("id", $this->vodCourseId)
			->with(["chapters"])
			->first();
		$vodCourseChapters = $vodCourse->chapters;

		// 수강 신청한 학생 목록을 구한다.
		$vodEnrollments = Enrollment::where([["course_id", $this->vodCourseId], ["status", EnrollmentStatus::COMPLETE]])
			->with(["user"])
			->get();

		$userVodProgressRate = $vodEnrollments->map(function ($enrollment) use ($vodCourseChapters) {
			// 진도 결과 기록
			$progressRateRow = [$enrollment->user->user_login, $enrollment->user->name];

			// 학생의 진도 기록 정보를 구한다.
			$userId = $enrollment->user->id;
			$userLearnings = CourseChapter::with([
				"vodLearnings" => function ($q) use ($userId) {
					$q->where("user_id", "=", $userId);
				},
				"quizLearnings" => function ($q) use ($userId) {
					$q->where("user_id", "=", $userId);
				},
			])
				->without(["vods", "resources", "quiz"])
				->where([["course_id", "=", $this->vodCourseId]])
				->get();

			// 전체 챕터에서 진도율 정보를 얻어내자
			$vodCourseChapters->each(function ($vodCourseChapter) use ($userLearnings, &$progressRateRow) {
				$chapterUserLearning = $userLearnings->where("id", $vodCourseChapter->id)->first();

				collect($vodCourseChapter->vods)->each(function ($vod) use ($chapterUserLearning, &$progressRateRow) {
					// VOD에 해당하는 진도기록을 구하자
					if ($chapterUserLearning->vodLearnings) {
						$vodLearning = collect($chapterUserLearning->vodLearnings)
							->where("vod_id", $vod->id)
							->first();
					} else {
						$vodLearning = null;
					}

					if ($vodLearning) {
						$progressRateRow[] = $vodLearning->status;
					} else {
						$progressRateRow[] = "-";
					}
				});

				// 퀴즈 진도율
				if ($chapterUserLearning->quizLearnings && count($chapterUserLearning->quizLearnings) != 0) {
					$progressRateRow[] = $chapterUserLearning->quizLearnings[0]->status;
				} else {
					$progressRateRow[] = "-";
				}
			});

			return $progressRateRow;
		});

		return $userVodProgressRate;
	}
}
