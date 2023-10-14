<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;

class CourseController extends Controller
{
	/**
	 * Show the application courses.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application courses create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}

	/**
	 * Show the application courses edit.
	 *
	 * @return \Illuminate\View\View
	 */
	public function edit($id)
	{
		try {
			Course::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}