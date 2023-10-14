<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class CouponController extends Controller
{
	/**
	 * Show the application coupons.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application coupons create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}
	/**
	 * Show the application coupons allocate.
	 *
	 * @return \Illuminate\View\View
	 */
	public function allocate()
	{
		return view("app");
	}
}
