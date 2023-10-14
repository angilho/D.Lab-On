<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;

class MainController extends Controller
{
	/**
	 * Show the application main.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application about.
	 *
	 * @return \Illuminate\View\View
	 */
	public function about()
	{
		return view("app");
	}
}