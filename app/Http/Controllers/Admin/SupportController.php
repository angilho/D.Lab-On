<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class SupportController extends Controller
{
	/**
	 * Show the application supports.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}
}