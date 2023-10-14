<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class CarouselController extends Controller
{
	/**
	 * Show the application carousels.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}
}
