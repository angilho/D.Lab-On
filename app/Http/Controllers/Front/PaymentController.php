<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;

class PaymentController extends Controller
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

	/**
	 * Show the application.
	 *
	 * @return \Illuminate\View\View
	 */
	public function success()
	{
		return view("app");
	}
}