<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseChapterStoreRequest;
use App\Http\Requests\CourseChapterUpdateRequest;
use App\Models\CourseChapter;
use App\Models\ChapterVod;
use App\Models\ChapterResource;
use App\Models\ChapterQuiz;
use App\Models\QuizQuestion;
use App\Models\QuizQuestionAnswer;
use App\Models\File;

class CourseChapterController extends Controller
{
	/**
	 * 코스에 속한 전체 챕터 목록을 구한다.
	 *
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function index($courseId)
	{
		return CourseChapter::with([])
			->where("course_id", $courseId)
			->get();
	}

	/**
	 * 코스에 속한 전체 챕터 목록을 구한다. 운영자 편집을 위한 API
	 *
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function adminIndex($courseId)
	{
		$courseChapters = CourseChapter::with([])
			->where("course_id", $courseId)
			->get();
		// 퀴즈의 정답까지 포함하여 전달한다.
		$courseChapters->each(function ($courseChapter) {
			if (isset($courseChapter->quiz) && isset($courseChapter->quiz->questions)) {
				$courseChapter->quiz->questions->each(function ($question) {
					if (isset($question->answers)) {
						$question->answers->each(function ($answer) {
							$answer->makeVisible(["commentary", "correct"]);
						});
					}
				});
			}
		});

		return response()->json($courseChapters, 200);
	}

	/**
	 * 코스에 챕터를 추가한다.
	 *
	 * @param  App\Http\Requests\CourseChapterStoreRequest  $request
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function store(CourseChapterStoreRequest $request, $courseId)
	{
		$validated = $request->validated();

		try {
			$result = [];
			$chapters = $validated["chapters"];

			// 챕터를 DB에 생성한다.
			// 전달 받은 챕터 목록에 index를 추가한다.
			foreach ($chapters as $chapterIdx => $chapter) {
				$chapterModel = CourseChapter::create([
					"course_id" => $courseId,
					"index" => $chapterIdx + 1,
					"title" => $chapter["title"],
					"description" => $chapter["description"] ?? "",
					"need_quiz_pass" => $chapter["need_quiz_pass"] === "true" || $chapter["need_quiz_pass"] == 1,
				]);

				// 동영상 목록을 DB에 생성한다.
				// 챕터에 속한 동영상 목록에 index를 추가한다.
				$vods = $chapter["vods"];
				foreach ($vods as $vodIdx => $vod) {
					ChapterVod::create([
						"chapter_id" => $chapterModel->id,
						"index" => $vodIdx + 1,
						"title" => $vod["title"],
						"vod_url" => $vod["vod_url"],
						"description" => $vod["description"] ?? "",
						"description_url" => $vod["description_url"] ?? "",
					]);
				}

				// 교안을 파일 등록한다.
				// 교안 목록을 DB에 생성한다.
				// 챕터에 속한 교안 목록에 index를 추가한다.
				$resources = isset($chapter["resources"]) ? $chapter["resources"] : [];
				foreach ($resources as $resourceIdx => $resource) {
					// 교안 파일 등록
					if (isset($resource["file"])) {
						$resourceFile = $resource["file"];
						$resourceFilename = $resourceFile->store("public/files");
						$resourceFileModel = File::create([
							"user_id" => 1,
							"filename" => pathinfo($resourceFilename, PATHINFO_BASENAME),
							"org_filename" => $resourceFile->getClientOriginalName(),
						]);
						ChapterResource::create([
							"chapter_id" => $chapterModel->id,
							"index" => $resourceIdx + 1,
							"resource_file_id" => $resourceFileModel->id,
							"resource_password" => $resource["resource_password"] ?? null,
						]);
					}
				}

				// 퀴즈를 생성한다.
				$quiz = $chapter["quiz"];
				$quizModel = ChapterQuiz::create([
					"chapter_id" => $chapterModel->id,
					"required_correct_count" => $quiz["required_correct_count"],
				]);

				// 퀴즈에 속한 문제를 생성한다.
				$quizQuestions = $quiz["questions"];
				foreach ($quizQuestions as $quizQuestionIdx => $quizQuestion) {
					// 퀴즈 문제에 속한 이미지가 있는 경우 파일로 등록한다.
					$questionImageFileModel = null;
					if (isset($quizQuestion["question_image_file"])) {
						$questionImageFile = $quizQuestion["question_image_file"];
						$questionImageFilename = $questionImageFile->store("public/files");
						$questionImageFileModel = File::create([
							"user_id" => 1,
							"filename" => pathinfo($questionImageFilename, PATHINFO_BASENAME),
							"org_filename" => $questionImageFile->getClientOriginalName(),
						]);
					}

					$quizQuestionModel = QuizQuestion::create([
						"quiz_id" => $quizModel->id,
						"index" => $quizQuestionIdx + 1,
						"question" => $quizQuestion["question"],
						"question_image_file_id" => $questionImageFileModel ? $questionImageFileModel->id : null,
					]);

					// 문제에 속한 답변을 생성한다.
					$quizQuestionAnswers = $quizQuestion["answers"];
					foreach ($quizQuestionAnswers as $quizQuestionAnswerIdx => $quizQuestionAnswer) {
						// 퀴즈 답변에 속한 이미지가 있는 경우 파일로 등록한다.
						$answerImageFileModel = null;
						if (isset($quizQuestionAnswer["answer_image_file"])) {
							$answerImageFile = $quizQuestionAnswer["answer_image_file"];
							$answerImageFilename = $answerImageFile->store("public/files");
							$answerImageFileModel = File::create([
								"user_id" => 1,
								"filename" => pathinfo($answerImageFilename, PATHINFO_BASENAME),
								"org_filename" => $answerImageFile->getClientOriginalName(),
							]);
						}

						QuizQuestionAnswer::create([
							"question_id" => $quizQuestionModel->id,
							"index" => $quizQuestionAnswerIdx + 1,
							"answer" => $quizQuestionAnswer["answer"],
							"answer_image_file_id" => $answerImageFileModel ? $answerImageFileModel->id : null,
							"commentary" => $quizQuestionAnswer["commentary"],
							"correct" =>
								$quizQuestionAnswer["correct"] === "true" || $quizQuestionAnswer["correct"] == 1,
						]);
					}
				}

				$result[] = $chapterModel;
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($result, 201);
	}

	/**
	 * ID에 매칭되는 챕터를 구한다.
	 *
	 * @param  int  $courseId
	 * @param  int  $chapterId
	 * @return \Illuminate\Http\Response
	 */
	public function show($courseId, $chapterId)
	{
		return CourseChapter::where([["course_id", $courseId], ["id", $chapterId]])->first();
	}

	/**
	 * 전체 챕터 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\CourseChapterUpdateRequest  $request
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function update(CourseChapterUpdateRequest $request, $courseId)
	{
		$validated = $request->validated();

		try {
			$result = [];

			// 업데이트 요청 챕터 목록
			$chapters = $validated["chapters"];

			// 현재 Course가 가진 전체 챕터를 구한다.
			$curCourseChapters = CourseChapter::where("course_id", $courseId)->get();
			$curChapterIds = [];

			foreach ($chapters as $chapterIdx => $chapter) {
				if (isset($chapter["id"])) {
					// 기존 챕터를 DB에서 업데이트 한다.
					$curChapterIds[] = $chapter["id"];
					$chapterModel = CourseChapter::find($chapter["id"]);
					$chapterModel->update([
						"index" => $chapterIdx + 1,
						"title" => $chapter["title"],
						"description" => $chapter["description"] ?? "",
						"need_quiz_pass" => $chapter["need_quiz_pass"] === "true" || $chapter["need_quiz_pass"] == 1,
					]);
				} else {
					// 신규 챕터는 DB에 추가한다.
					$chapterModel = CourseChapter::create([
						"course_id" => $courseId,
						"index" => $chapterIdx + 1,
						"title" => $chapter["title"],
						"description" => $chapter["description"] ?? "",
						"need_quiz_pass" => $chapter["need_quiz_pass"] === "true" || $chapter["need_quiz_pass"] == 1,
					]);
				}

				// 업데이트 요청 동영상 목록
				$vods = $chapter["vods"];

				// 현재 Course가 가진 전체 동영상을 구한다.
				$curChapterVods = ChapterVod::where("chapter_id", $chapterModel->id)->get();
				$curChapterVodIds = [];

				foreach ($vods as $vodIdx => $vod) {
					if (isset($vod["id"])) {
						// 기존 동영상을 DB에서 업데이트 한다.
						$curChapterVodIds[] = $vod["id"];
						ChapterVod::find($vod["id"])->update([
							"index" => $vodIdx + 1,
							"title" => $vod["title"],
							"vod_url" => $vod["vod_url"],
							"description" => $vod["description"] ?? "",
							"description_url" => $vod["description_url"] ?? "",
						]);
					} else {
						// 신규 동영상은 DB에 추가한다.
						ChapterVod::create([
							"chapter_id" => $chapterModel->id,
							"index" => $vodIdx + 1,
							"title" => $vod["title"],
							"vod_url" => $vod["vod_url"],
							"description" => $vod["description"] ?? "",
							"description_url" => $vod["description_url"] ?? "",
						]);
					}
				}

				// 챕터의 동영상 중 사용하지 않는 동영상은 삭제한다.
				foreach ($curChapterVods as $curChapterVod) {
					// 기존 Chapter의 동영상에 있는 id가 입력으로 들어온 curChapterVodIds에 없으면 삭제한다.
					if (!in_array($curChapterVod->id, $curChapterVodIds)) {
						ChapterVod::find($curChapterVod->id)->delete();
					}
				}

				// 업데이트 요청 교안 목록
				$resources = isset($chapter["resources"]) ? $chapter["resources"] : [];

				// 현재 Course가 가진 전체 교안을 구한다.
				$curChapterResources = ChapterResource::where("chapter_id", $chapterModel->id)->get();
				$curChapterResourceIds = [];

				foreach ($resources as $resourceIdx => $resource) {
					if (isset($resource["id"])) {
						// 기존 교안을 DB에서 업데이트 한다.
						$curChapterResourceIds[] = $resource["id"];
						ChapterResource::find($resource["id"])->update([
							"index" => $resourceIdx + 1,
							"resource_password" => $resource["resource_password"] ?? null,
						]);
					} else {
						// 신규 교안은 파일 등록 후 DB에 추가한다.
						if (isset($resource["file"])) {
							$resourceFile = $resource["file"];
							$resourceFilename = $resourceFile->store("public/files");
							$resourceFileModel = File::create([
								"user_id" => 1,
								"filename" => pathinfo($resourceFilename, PATHINFO_BASENAME),
								"org_filename" => $resourceFile->getClientOriginalName(),
							]);
							ChapterResource::create([
								"chapter_id" => $chapterModel->id,
								"index" => $resourceIdx + 1,
								"resource_file_id" => $resourceFileModel->id,
								"resource_password" => $resource["resource_password"] ?? null,
							]);
						}
					}
				}

				// 챕터의 교안 중 사용하지 않는 교안은 삭제한다.
				foreach ($curChapterResources as $curChapterResource) {
					// 기존 Chapter의 교안에 있는 id가 입력으로 들어온 curChapterResourceIds에 없으면 삭제한다.
					if (!in_array($curChapterResource->id, $curChapterResourceIds)) {
						ChapterResource::find($curChapterResource->id)->delete();
					}
				}

				$quiz = $chapter["quiz"];
				$quizModel = ChapterQuiz::where("chapter_id", $chapterModel->id)->first();
				if (isset($quizModel)) {
					// 기존 퀴즈를 DB에서 업데이트 한다.
					$quizModel->update([
						"required_correct_count" => $quiz["required_correct_count"],
					]);
				} else {
					// 신규 퀴즈는 DB에 추가한다.
					$quizModel = ChapterQuiz::create([
						"chapter_id" => $chapterModel->id,
						"required_correct_count" => $quiz["required_correct_count"],
					]);
				}

				// 업데이트 요청 질문 목록
				$quizQuestions = $quiz["questions"];

				// 현재 퀴즈가 가진 전체 질문을 구한다.
				$curQuizQuestions = QuizQuestion::where("quiz_id", $quizModel->id)->get();
				$curQuizQuestionIds = [];

				foreach ($quizQuestions as $quizQuestionIdx => $quizQuestion) {
					// 퀴즈 문제에 속한 이미지가 있는 경우 파일로 등록한다.
					$questionImageFileModel = null;
					if (isset($quizQuestion["question_image_file"])) {
						$questionImageFile = $quizQuestion["question_image_file"];
						$questionImageFilename = $questionImageFile->store("public/files");
						$questionImageFileModel = File::create([
							"user_id" => 1,
							"filename" => pathinfo($questionImageFilename, PATHINFO_BASENAME),
							"org_filename" => $questionImageFile->getClientOriginalName(),
						]);
					}

					if (isset($quizQuestion["id"])) {
						// 기존 질문을 DB에서 업데이트 한다.
						$curQuizQuestionIds[] = $quizQuestion["id"];
						$quizQuestionModel = QuizQuestion::find($quizQuestion["id"]);
						$quizQuestionModel->update([
							"index" => $quizQuestionIdx + 1,
							"question" => $quizQuestion["question"],
							"question_image_file_id" => $questionImageFileModel
								? $questionImageFileModel->id
								: $quizQuestionModel->question_image_file_id,
						]);
					} else {
						// 신규 질문은 DB에 추가한다.
						$quizQuestionModel = QuizQuestion::create([
							"quiz_id" => $quizModel->id,
							"index" => $quizQuestionIdx + 1,
							"question" => $quizQuestion["question"],
							"question_image_file_id" => $questionImageFileModel ? $questionImageFileModel->id : null,
						]);
					}

					// 업데이트 요청 답변 목록
					$quizQuestionAnswers = $quizQuestion["answers"];

					// 현재 질문이 가진 전체 답변을 구한다.
					$curQuizQuestionAnswers = QuizQuestionAnswer::where("question_id", $quizQuestionModel->id)->get();
					$curQuizQuestionAnswerIds = [];

					foreach ($quizQuestionAnswers as $quizQuestionAnswerIdx => $quizQuestionAnswer) {
						// 퀴즈 답변에 속한 이미지가 있는 경우 파일로 등록한다.
						$answerImageFileModel = null;
						if (isset($quizQuestionAnswer["answer_image_file"])) {
							$answerImageFile = $quizQuestionAnswer["answer_image_file"];
							$answerImageFilename = $answerImageFile->store("public/files");
							$answerImageFileModel = File::create([
								"user_id" => 1,
								"filename" => pathinfo($answerImageFilename, PATHINFO_BASENAME),
								"org_filename" => $answerImageFile->getClientOriginalName(),
							]);
						}

						if (isset($quizQuestionAnswer["id"])) {
							// 기존 답변을 DB에서 업데이트 한다.
							$curQuizQuestionAnswerIds[] = $quizQuestionAnswer["id"];
							$quizQuestionAnswerModel = QuizQuestionAnswer::find($quizQuestionAnswer["id"]);
							$quizQuestionAnswerModel->update([
								"index" => $quizQuestionAnswerIdx + 1,
								"answer" => $quizQuestionAnswer["answer"],
								"answer_image_file_id" => $answerImageFileModel
									? $answerImageFileModel->id
									: $quizQuestionAnswerModel->answer_image_file_id,
								"commentary" => isset($quizQuestionAnswer["commentary"])
									? $quizQuestionAnswer["commentary"]
									: "",
								"correct" =>
									$quizQuestionAnswer["correct"] === "true" || $quizQuestionAnswer["correct"] == 1,
							]);
						} else {
							// 신규 답변은 DB에 추가한다.
							QuizQuestionAnswer::create([
								"question_id" => $quizQuestionModel->id,
								"index" => $quizQuestionAnswerIdx + 1,
								"answer" => $quizQuestionAnswer["answer"],
								"answer_image_file_id" => $answerImageFileModel ? $answerImageFileModel->id : null,
								"commentary" => isset($quizQuestionAnswer["commentary"])
									? $quizQuestionAnswer["commentary"]
									: "",
								"correct" =>
									$quizQuestionAnswer["correct"] === "true" || $quizQuestionAnswer["correct"] == 1,
							]);
						}
					}

					// 질문의 답변 중 사용하지 않는 답변은 삭제한다.
					foreach ($curQuizQuestionAnswers as $curQuizQuestionAnswer) {
						// 기존 질문의 답변에 있는 id가 입력으로 들어온 curQuizQuestionAnswerIds에 없으면 삭제한다.
						if (!in_array($curQuizQuestionAnswer->id, $curQuizQuestionAnswerIds)) {
							QuizQuestionAnswer::find($curQuizQuestionAnswer->id)->delete();
						}
					}
				}

				// 퀴즈의 질문 중 사용하지 않는 질문은 삭제한다.
				foreach ($curQuizQuestions as $curQuizQuestion) {
					// 기존 퀴즈의 질문에 있는 id가 입력으로 들어온 curQuizQuestionIds에 없으면 삭제한다.
					if (!in_array($curQuizQuestion->id, $curQuizQuestionIds)) {
						QuizQuestion::find($curQuizQuestion->id)->delete();
					}
				}

				$result[] = $chapterModel;
			}

			// Course의 챕터 중 사용하지 않는 챕터는 삭제한다.
			foreach ($curCourseChapters as $curCourseChapter) {
				// 기존 Course의 Chapter에 있는 id가 입력으로 들어온 curChapterIds에 없으면 삭제한다.
				if (!in_array($curCourseChapter->id, $curChapterIds)) {
					CourseChapter::find($curCourseChapter->id)->delete();
				}
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($result, 201);
	}
}
