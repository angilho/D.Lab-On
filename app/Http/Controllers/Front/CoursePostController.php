<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CoursePost;
use Illuminate\Http\Request;

class CoursePostController extends Controller
{
	/**
	 * Show the application course posts.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index($id)
	{
		try {
			Course::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application courses post create
	 *
	 * @return \Illuminate\View\View
	 */
	public function create($id)
	{
		try {
			Course::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application course post.
	 *
	 * @return \Illuminate\View\View
	 */
	public function show($id, $postId)
	{
		try {
			CoursePost::where([["course_id", $id], ["id", $postId]])->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application course post edit.
	 *
	 * @return \Illuminate\View\View
	 */
	public function edit(Request $request, $id, $postId)
	{
		try {
			$coursePost = CoursePost::where([["course_id", $id], ["id", $postId]])->firstOrFail();
			// 해당 게시글의 작성자가 자신인지 확인한다.
			$user = $request->user();
			if (!isset($user) || $user->id !== $coursePost->user_id) {
				return abort(404);
			}
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}