<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class SmsNotificationController extends Controller
{
	/**
	 * Show the application sms notifications.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application sms notification show.
	 *
	 * @return \Illuminate\View\View
	 */
	public function edit($id)
	{
		return view("app");
	}

	/**
	 * Show the application sms notification create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}
}
