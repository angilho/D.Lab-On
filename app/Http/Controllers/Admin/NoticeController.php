<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class NoticeController extends Controller
{
	/**
	 * Show the application notice show.
	 *
	 * @return \Illuminate\View\View
	 */
	public function show($id)
	{
		return view("app");
	}

	/**
	 * Show the application notice create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}
}