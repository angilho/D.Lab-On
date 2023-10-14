<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class SupportClassEnrollmentController extends Controller
{
	/**
	 * Show the application support class enrollments.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application support class enrollment create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}
}
