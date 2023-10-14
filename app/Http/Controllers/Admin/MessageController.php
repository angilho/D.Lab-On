<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class MessageController extends Controller
{
	/**
	 * Show the application messages.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application message show.
	 *
	 * @return \Illuminate\View\View
	 */
	public function show($id)
	{
		return view("app");
	}

	/**
	 * Show the application message create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}
}