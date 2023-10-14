<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;

class AttendanceController extends Controller
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
	public function create()
	{
		return view("app");
	}
	public function section()
	{
		return view("app");
	}
	public function student()
	{
		return view("app");
	}
}
