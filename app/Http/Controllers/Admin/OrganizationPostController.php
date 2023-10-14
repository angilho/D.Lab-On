<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationPost;
use Illuminate\Http\Request;

class OrganizationPostController extends Controller
{
	/**
	 * Show the application organization posts.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Show the application organization post create
	 *
	 * @return \Illuminate\View\View
	 */
	public function create($id)
	{
		try {
			Organization::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application organization post edit.
	 *
	 * @return \Illuminate\View\View
	 */
	public function show($id, $postId)
	{
		try {
			OrganizationPost::where([["organization_id", $id], ["id", $postId]])->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}

	/**
	 * Show the application organization post edit.
	 *
	 * @return \Illuminate\View\View
	 */
	public function edit(Request $request, $id, $postId)
	{
		try {
			OrganizationPost::where([["organization_id", $id], ["id", $postId]])->firstOrFail();
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}