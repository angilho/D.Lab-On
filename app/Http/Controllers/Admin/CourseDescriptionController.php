<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;

class CourseDescriptionController extends Controller
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
}
