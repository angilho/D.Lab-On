<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class MenuPermissionController extends Controller
{
	/**
	 * Show the application menu permissions.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application menu permission show.
	 *
	 * @return \Illuminate\View\View
	 */
	public function show($id)
	{
		return view("app");
	}
}
