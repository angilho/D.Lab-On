<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;

class FaqController extends Controller
{
	/**
	 * Show the application.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}
}