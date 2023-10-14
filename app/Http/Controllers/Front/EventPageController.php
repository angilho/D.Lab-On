<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;

class EventPageController extends Controller
{
	/**
	 * Show the event page.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}
}