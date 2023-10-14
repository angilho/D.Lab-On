<?php

namespace App\Http\Controllers\Admin;

use App\Models\Organization;
use App\Http\Controllers\Controller;

class OrganizationController extends Controller
{
	/**
	 * Show the application organizations.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application organization create.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		return view("app");
	}

	/**
	 * Show the application organization edit.
	 *
	 * @return \Illuminate\View\View
	 */
	public function edit($id)
	{
		try {
			Organization::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}