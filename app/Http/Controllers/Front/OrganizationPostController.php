<?php

namespace App\Http\Controllers\Front;

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
	public function index($id)
	{
		try {
			Organization::findOrFail($id);
		} catch (\Throwable $th) {
			return abort(404);
		}

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
	 * Show the application organization post.
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
			$organizationPost = OrganizationPost::where([["organization_id", $id], ["id", $postId]])->firstOrFail();
			// 해당 게시글의 작성자가 자신인지 확인한다.
			$user = $request->user();
			if (!isset($user) || $user->id !== $organizationPost->user_id) {
				return abort(404);
			}
		} catch (\Throwable $th) {
			return abort(404);
		}

		return view("app");
	}
}