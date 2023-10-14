<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CoursePost;

class VodCoursePostController extends Controller
{
	/**
	 * Show the application course posts.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application course post edit.
	 *
	 * @return \Illuminate\View\View
	 */
	public function show($postId)
	{
		try {
			CoursePost::where("id", $postId)->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}
