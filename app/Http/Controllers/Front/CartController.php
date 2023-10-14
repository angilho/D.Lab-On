<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;

class CartController extends Controller
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
}