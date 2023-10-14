<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class OrganizationEnrollmentController extends Controller
{
	/**
	 * Show the application organization enrollments.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application organization enrollment create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}
}