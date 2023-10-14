<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\CourseChapter;
use App\Models\ChapterVod;
use App\Models\ChapterQuiz;
use App\Models\Course;

class CourseChapterController extends Controller
{
	/**
	 * Show the application courses chapter.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index($id)
	{
		try {
			CourseChapter::where("course_id", $id)->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application chapter.
	 *
	 * @return \Illuminate\View\View
	 */
	public function show($courseId, $chapterId)
	{
		try {
			CourseChapter::where([["course_id", $courseId], ["id", $chapterId]])->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application chapter vod.
	 *
	 * @return \Illuminate\View\View
	 */
	public function vod($courseId, $chapterId, $vodId)
	{
		try {
			CourseChapter::where([["course_id", $courseId], ["id", $chapterId]])->firstOrFail();
			ChapterVod::where([["chapter_id", $chapterId], ["id", $vodId]])->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application chapter quiz.
	 *
	 * @return \Illuminate\View\View
	 */
	public function quiz($courseId, $chapterId)
	{
		try {
			CourseChapter::where([["course_id", $courseId], ["id", $chapterId]])->firstOrFail();
			ChapterQuiz::where([["chapter_id", $chapterId]])->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application chapter resource.
	 *
	 * @return \Illuminate\View\View
	 */
	public function resources($courseId, $chapterId)
	{
		try {
			CourseChapter::where([["course_id", $courseId], ["id", $chapterId]])->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application course quiz statistics.
	 *
	 * @return \Illuminate\View\View
	 */
	public function quizStatistics($courseId)
	{
		try {
			Course::findOrFail($courseId);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}