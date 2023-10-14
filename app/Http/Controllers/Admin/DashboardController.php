<?php

namespace App\Http\Controllers\Admin;
use App\Models\Enrollment;
use App\Models\Course;
use App\Models\User;
use App\Constants\Role;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
	/**
	 * Show the application dashboard.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}
}