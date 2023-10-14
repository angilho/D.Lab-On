<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Http\Controllers\Controller;

class InstructorController extends Controller
{
	/**
	 * Show the application instructors.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * 강사 상세 보기 페이지
	 */
	public function show($user)
	{
		try {
			$user = User::findOrFail($user);
		} catch (\Throwable $th) {
			return abort(500);
		}

		return view("app");
	}

	/**
	 * 강사 수정 버튼을 클릭했을 때 이동
	 */
	public function edit($user)
	{
		try {
			$user = User::findOrFail($user);
		} catch (\Throwable $th) {
			return abort(500);
		}

		return view("app");
	}
}
