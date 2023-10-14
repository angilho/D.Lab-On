<?php

namespace App\Http\Controllers\API\v1;

use Spatie\QueryBuilder\QueryBuilder;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Http\Requests\LearningVodRequest;
use App\Http\Requests\LearningQuizSubmitRequest;
use App\Models\CourseChapter;
use App\Models\ChapterVodLearning;
use App\Models\ChapterQuizSubmission;
use App\Models\ChapterQuiz;
use App\Models\ChapterQuizLearning;
use App\Constants\LearningStatus;

class LearningController extends Controller
{
	/**
	 * 사용자의 전체 학습 기록을 가져온다.
	 */
	public function index($userId, $courseId)
	{
		// Course에 속한 모든 챕터에 포함된 동영상, 퀴즈 학습 기록을 가져온다.
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

		return response()->json($courseLearnings, 200);
	}

	/**
	 * 동영상 학습을 기록한다.
	 */
	public function completeVod(LearningVodRequest $request, $userId, $courseId, $chapterId, $vodId)
	{
		$validated = $request->validated();

		try {
			$chapterVodLearning = ChapterVodLearning::updateOrCreate(
				[
					"user_id" => $userId,
					"chapter_id" => $chapterId,
					"vod_id" => $vodId,
				],
				[
					"status" => $validated["status"],
				]
			);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($chapterVodLearning, 201);
	}

	/**
	 * 퀴즈 제출 답안을 기록하고 결과를 전달한다.
	 */
	public function submitQuiz(LearningQuizSubmitRequest $request, $userId, $courseId, $chapterId, $quizId)
	{
		$validated = $request->validated();

		try {
			// 퀴즈 정보를 정답과 해설을 포함하여 구한다.
			$quizResult = ChapterQuiz::where("id", $quizId)->first();
			$quizResult->questions->each(function ($question) {
				$question->answers->each(function ($answer) {
					$answer->makeVisible(["commentary", "correct"]);
				});
			});

			// 정답 개수를 확인한다.
			$correctAnswer = 0;
			foreach ($validated["answers"] as $_ => $answer) {
				// 제출한 답변을 DB에 기록한다.
				$questionId = $answer["question_id"];
				$answerId = $answer["answer_id"];
				ChapterQuizSubmission::updateOrCreate(
					[
						"user_id" => $userId,
						"chapter_id" => $chapterId,
						"question_id" => $questionId,
					],
					[
						"answer_id" => $answerId,
					]
				);

				// 정답 여부를 확인한다.
				$quizResult->questions->each(function ($question) use ($questionId, $answerId, &$correctAnswer) {
					if ($question["id"] == $questionId) {
						$question->answers->each(function ($answer) use ($answerId, &$correctAnswer) {
							if ($answer["id"] == $answerId && $answer["correct"]) {
								$correctAnswer++;
							}
						});
					}
				});
			}

			// 제출한 답변의 정답 여부에 따라 퀴즈 학습 정보를 기록한다.
			$totalQuestion = count($quizResult->questions);
			$status =
				$correctAnswer >= $quizResult->required_correct_count
					? LearningStatus::COMPLETE
					: LearningStatus::INCOMPLETE;
			ChapterQuizLearning::updateOrCreate(
				[
					"user_id" => $userId,
					"chapter_id" => $chapterId,
					"quiz_id" => $quizId,
				],
				[
					"total_question" => $totalQuestion,
					"correct_answer" => $correctAnswer,
					"status" => $status,
					"passed_at" => $status === LearningStatus::COMPLETE ? Carbon::now() : null,
				]
			);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($quizResult, 201);
	}

	/**
	 * 퀴즈 제출 답안을 얻는다.
	 */
	public function quizSubmissions($userId, $courseId, $chapterId, $quizId)
	{
		$quizSubmissions = ChapterQuizSubmission::where([["user_id", $userId], ["chapter_id", $chapterId]])->get();
		// 퀴즈의 정답까지 포함하여 전달한다.
		$quizSubmissions->each(function ($quizSubmission) {
			$quizSubmission->question->answers->each(function ($answer) {
				$answer->makeVisible(["commentary", "correct"]);
			});
		});
		return response()->json($quizSubmissions, 200);
	}
}