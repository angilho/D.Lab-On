<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class FaqController extends Controller
{
	/**
	 * Show the application faq show.
	 *
	 * @return \Illuminate\View\View
	 */
	public function show($id)
	{
		return view("app");
	}

	/**
	 * Show the application faq create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}
}