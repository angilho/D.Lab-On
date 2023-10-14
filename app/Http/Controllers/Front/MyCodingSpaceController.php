<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class MyCodingSpaceController extends Controller
{
	/**
	 * Show the My CodingSpace.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		// 로그인 되어 있지 않으면 login 페이지로 redirect 하자
		if (!Auth::check()) {
			return redirect("/login");
		}

		return view("app");
	}
}