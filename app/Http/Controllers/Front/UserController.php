<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;

class UserController extends Controller
{
	/**
	 * Show the application.
	 *
	 * @return \Illuminate\View\View
	 */
	public function find()
	{
		return view("app");
	}
}