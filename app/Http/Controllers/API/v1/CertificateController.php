<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use App\Constants\EnrollmentStatus;
use App\Constants\CourseType;
use App\Constants\LearningStatus;
use App\Models\Enrollment;
use App\Models\CourseChapter;

class CertificateController extends Controller
{
	/**
	 * 전체 VOD 수료 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request, $id)
	{
		// VOD 과목을 수강하고 있는 정보만 구한다.
		$enrollments = QueryBuilder::for(Enrollment::class)
			->with(["course", "courseSection", "user"])
			->where([["user_id", "=", $id]])
			->where("status", EnrollmentStatus::COMPLETE)
			->whereHas("course", function ($q) {
				return $q->where([["courses.type", CourseType::VOD], ["support_class", false]]);
			})
			->get();

		// 해당 수업을 완료했는지 판단해서 전달한다.
		$certificateEnrollments = $enrollments->map(function ($enrollment) use ($id) {
			$enrollment->certificated = $this->isCertificatedCourse($id, $enrollment->course->id);
			return $enrollment;
		});

		return response()->json($certificateEnrollments, 201);
	}

	/**
	 * 과목이 수강 완료 되었는지 확인한다.
	 */
	private function isCertificatedCourse($userId, $courseId)
	{
		$courseLearnings = QueryBuilder::for(CourseChapter::class)
			->with([
				"vodLearnings" => function ($q) use ($userId) {
					$q->where("user_id", "=", $userId);
				},
				"quizLearnings" => function ($q) use ($userId) {
					$q->where("user_id", "=", $userId);
				},
			])
			->without(["vods", "resources", "quiz"])
			->where([["course_id", "=", $courseId]])
			->get();

		// 모든 챕터에 있는 동영상을 완료했는지 확인한다.
		$certificated = true;
		$courseLearnings->each(function ($courseChapter) use (&$certificated) {
			// 동영상 완료 여부 확인
			$chapterVodCount = $courseChapter->vods->count();
			$completedVodLearningCount = $courseChapter->vodLearnings
				->filter(function ($vodLearning) {
					return $vodLearning->status === LearningStatus::COMPLETE;
				})
				->count();

			if ($chapterVodCount > $completedVodLearningCount) {
				$certificated = false;
			}

			// 모든 퀴즈를 80% 통과했는지 확인한다.
			if ($courseChapter->quizLearnings->count() !== 0) {
				$quizLearning = $courseChapter->quizLearnings[0];
				if ($quizLearning->correct_answer / $quizLearning->total_question < 0.8) {
					$certificated = false;
				}
			}
		});

		return $certificated;
	}
}
