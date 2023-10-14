<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailCurriculumCategory;

class DetailCurriculumController extends Controller
{
	/**
	 * Show the application curriculums.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application curriculum create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}

	/**
	 * Show the application curriculum edit.
	 *
	 * @return \Illuminate\View\View
	 */
	public function edit($id)
	{
		try {
			DetailCurriculumCategory::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}
