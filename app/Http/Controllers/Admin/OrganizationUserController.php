<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Http\Controllers\Controller;

class OrganizationUserController extends Controller
{
	/**
	 * Show the application organization users.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application organization user show.
	 */
	public function show($id)
	{
		try {
			User::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application organization user edit.
	 *
	 * @return \Illuminate\View\View
	 */
	public function edit($id)
	{
		try {
			User::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}