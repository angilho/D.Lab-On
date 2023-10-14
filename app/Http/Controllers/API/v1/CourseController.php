<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Requests\CourseStoreRequest;
use App\Http\Requests\CourseUpdateRequest;
use App\Filter\CourseSearchFilter;
use App\Filter\CourseClassFilter;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\CourseChapter;
use App\Models\ChapterResource;
use App\Models\ChapterVod;
use App\Models\ChapterQuiz;
use App\Models\QuizQuestion;
use App\Models\QuizQuestionAnswer;
use App\Models\Cart;
use App\Models\File;
use App\Models\Enrollment;
use App\Constants\Role;
use App\Constants\CourseType;
use Illuminate\Support\Str;

use Exception;

class CourseController extends Controller
{
	/**
	 * 전체 Course 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		// 사용자가 운영자인 경우에는 closed 까지 포함해서 보여준다.
		$isAdmin = false;
		$user = auth("sanctum")->user();
		if ($user && $user->role === Role::ADMIN) {
			$isAdmin = true;
		}

		return QueryBuilder::for(Course::class)
			->allowedFilters([
				AllowedFilter::exact("id"),
				AllowedFilter::exact("course_type", "type"),
				AllowedFilter::custom("course_class", new CourseClassFilter()),
				AllowedFilter::custom("search", new CourseSearchFilter()),
				AllowedFilter::exact("b2b_class"),
				AllowedFilter::exact("support_class"),
			])
			->when(!$isAdmin, function ($query) {
				return $query->where("closed", false);
			})
			->with(["sections"])
			->paginate(30);
	}

	/**
	 * 신규 Course를 추가한다.
	 *
	 * @param  App\Http\Requests\CourseStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(CourseStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			$userId = 1; // user_id=1인 admin으로 고정함
			$validated["user_id"] = $userId;

			// thumbnail 등록
			$thumbnailFile = $request->file("thumbnail");
			$filename = $thumbnailFile->store("public/files");
			$thumbnail = File::create([
				"user_id" => $userId,
				"filename" => pathinfo($filename, PATHINFO_BASENAME),
				"org_filename" => $thumbnailFile->getClientOriginalName(),
			]);
			$validated["thumbnail_id"] = $thumbnail->id;

			// 디랩온 Course를 생성한다.
			$course = Course::create($validated);

			// Course의 회차를 생성한다.
			// VOD 클래스인 경우에는 sections이 입력으로 들어오지 않고, 결재를 위해 임의의 section을 하나 생성한다.
			if (isset($validated["sections"])) {
				foreach ($validated["sections"] as $_ => $section) {
					$sectionArr = json_decode($section, true);
					$sectionArr["course_id"] = $course->id;

					CourseSection::create($sectionArr);
				}
			} else {
				CourseSection::create([
					"course_id" => $course->id,
					"target_group" => 3, // GENERAL, 사용하지 않는 값
					"target_grade" => null, // 사용하지 않는 값
					"max_student" => 99999, // 최대 학생은 최대한 많이 잡음
					"start_at" => "2000-01-01", // 사용하지 않는 값
					"end_at" => "2200-01-01", // 사용하지 않는 값
					"recruit_start_at" => "2000-01-01", // 사용하지 않는 값
					"recruit_end_at" => "2200-01-01", // 사용하지 않는 값
					"cycle_week" => null, // 사용하지 않는 값
					"start_hour" => null, // 사용하지 않는 값
					"start_minute" => null, // 사용하지 않는 값
					"end_hour" => null, // 사용하지 않는 값
					"end_minute" => null, // 사용하지 않는 값
					"duration_day" => [], // 사용하지 않는 값
					"zoom_url" => "", // 사용하지 않는 값
					"zoom_password" => null, // 사용하지 않는 값
					"zoom_id" => null, // 사용하지 않는 값
				]);
			}
		} catch (Exception $e) {
			//TODO: 혹시 과목 생성 후 에러가 발생했다면 모든 정보를 지워줘야 함.
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($course, 201);
	}

	/**
	 * ID에 매칭되는 Course를 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		return Course::with("courseDescription")->findOrFail($id);
	}

	/**
	 * Course 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\CourseUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(CourseUpdateRequest $request, $id)
	{
		$validated = $request->validated();

		$course = Course::findOrFail($id);
		try {
			// thumbnail을 교체하는 경우
			if ($request->hasFile("thumbnail")) {
				$thumbnailFile = $request->file("thumbnail");
				$filename = $thumbnailFile->store("public/files");
				$thumbnail = File::create([
					"user_id" => $course->user_id,
					"filename" => pathinfo($filename, PATHINFO_BASENAME),
					"org_filename" => $thumbnailFile->getClientOriginalName(),
				]);
				$validated["thumbnail_id"] = $thumbnail->id;
			}

			// 현재 Course가 가진 회차를 구한다.
			$curCourseSections = CourseSection::where([["course_id", $id], ["closed", false]])->get();

			// Course의 회차를 수정한다.
			// VOD 클래스인 경우에는 sections가 없으므로 수정하지 않는다.
			if (isset($validated["sections"])) {
				$sectionArrIds = [];
				foreach ($validated["sections"] as $_ => $section) {
					$sectionArr = json_decode($section, true);
					// 기존 회차 갱신
					if (isset($sectionArr["id"])) {
						array_push($sectionArrIds, $sectionArr["id"]);
						CourseSection::find($sectionArr["id"])->update($sectionArr);
					} else {
						$sectionArr["course_id"] = $course->id;
						CourseSection::create($sectionArr);
					}
				}

				// Course의 회차 중 사용하지 않는 회차는 삭제한다.
				// 1. 해당 회차에 수강 신청한 학생이 없는 경우 회차를 DB에서 삭제한다.
				// 2. 해당 회차에 수강 신청한 학생이 있는 경우 회차를 DB에서 삭제하지 않고 close 처리한다.
				foreach ($curCourseSections as $curCourseSection) {
					// 기존 Course의 Section에 있는 id가 입력으로 들어온 sectionArr에 없으면 삭제한다.
					if (!in_array($curCourseSection->id, $sectionArrIds)) {
						// 해당 courseSection이 있는 Cart를 지운다.
						Cart::where("course_section_id", $curCourseSection->id)->delete();

						// 회차를 수강 신청한 학생이 있는지 확인한다.
						if (Enrollment::where("course_section_id", $curCourseSection->id)->exists()) {
							CourseSection::find($curCourseSection->id)->update([
								"closed" => true,
							]);
						} else {
							CourseSection::find($curCourseSection->id)->delete();
						}
					}
				}
			}

			$course->fill($validated);
			if (!$course->isDirty()) {
				return response()->noContent();
			}
			$course->save();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($course, 201);
	}

	/**
	 * Course를 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		$course = Course::findOrFail($id);

		try {
			$course->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * Course를 복제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function copyCourse($id)
	{
		$course = Course::findOrFail($id);

		try {
			// VOD 과목이 아니면 무시한다.
			if ($course->type !== CourseType::VOD) {
				return response()->json(["message" => "VOD 과목이 아닙니다."], 422);
			}
			// Course 복제
			$newCourse = $course->replicate()->fill([
				"name" => $course->name . "_사본",
				"dlab_course_code" => $course->dlab_course_code . "_COPY" . Str::random(4),
			]);
			$newCourse->save();
			// CourseSection 복제
			$courseSections = CourseSection::where("course_id", $id)->get();
			$courseSections->map(function ($courseSection) use ($newCourse) {
				$newCourseSection = $courseSection->replicate()->fill([
					"course_id" => $newCourse->id,
				]);
				$newCourseSection->save();
			});
			// CourseChapter 복제
			$courseChapters = CourseChapter::where("course_id", $id)->get();
			$courseChapters->map(function ($courseChapter) use ($newCourse) {
				$newCourseChapter = $courseChapter->replicate()->fill([
					"course_id" => $newCourse->id,
				]);
				$newCourseChapter->save();

				// ChapterResource
				$chapterResources = ChapterResource::where("chapter_id", $courseChapter->id)->get();
				$chapterResources->map(function ($chapterResource) use ($newCourseChapter) {
					$newChapterResource = $chapterResource->replicate()->fill([
						"chapter_id" => $newCourseChapter->id,
					]);
					$newChapterResource->save();
				});

				// ChapterVod
				$chapterVods = ChapterVod::where("chapter_id", $courseChapter->id)->get();
				$chapterVods->map(function ($chapterVod) use ($newCourseChapter) {
					$newChapterVod = $chapterVod->replicate()->fill([
						"chapter_id" => $newCourseChapter->id,
					]);
					$newChapterVod->save();
				});

				// ChapterQuiz
				$chapterQuizzes = ChapterQuiz::where("chapter_id", $courseChapter->id)->get();
				$chapterQuizzes->map(function ($chapterQuiz) use ($newCourseChapter) {
					$newChapterQuiz = $chapterQuiz->replicate()->fill([
						"chapter_id" => $newCourseChapter->id,
					]);
					$newChapterQuiz->save();

					// QuizQuestions
					$quizQuestions = QuizQuestion::where("quiz_id", $chapterQuiz->id)->get();
					$quizQuestions->map(function ($quizQuestion) use ($newChapterQuiz) {
						$newQuizQuesion = $quizQuestion->replicate()->fill([
							"quiz_id" => $newChapterQuiz->id,
						]);
						$newQuizQuesion->save();

						// QuizQuestionAnswers
						$quizQuestionAnswers = QuizQuestionAnswer::where("question_id", $quizQuestion->id)->get();
						$quizQuestionAnswers->map(function ($quizQuestionAnswer) use ($newQuizQuesion) {
							$newQuizQuesionAnswer = $quizQuestionAnswer->replicate()->fill([
								"question_id" => $newQuizQuesion->id,
							]);
							$newQuizQuesionAnswer->save();
						});
					});
				});
			});
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($newCourse, 201);
	}
}
