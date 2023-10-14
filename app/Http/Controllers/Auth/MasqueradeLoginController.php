<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Child;

class MasqueradeLoginController extends Controller
{
	/**
	 * 자녀 ID로 가장 로그인을 한다.
	 */
	public function login(Request $request)
	{
		$childId = $request->input("child_id");

		// 현재 로그인 사용자의 자녀가 맞는지 확인한다.
		$user = auth()->user();
		if (!$user) {
			abort(422);
		}
		if (
			!Child::where([
				"parent_id" => $user->id,
				"child_id" => $childId,
			])->exists()
		) {
			abort(404);
		}

		// 현재 사용자를 로그아웃 한다.
		$user->tokens()->delete();
		Auth::guard("web")->logout();
		$request->session()->invalidate();
		$request->session()->regenerateToken();

		// 자녀로 로그인 한다.
		Auth::login(User::where("id", $childId)->first());
		// API Token을 발행한다.
		$childUser = auth()->user();
		$token = $childUser->createToken("API Token", [])->plainTextToken;

		return response()->json(
			[
				"api_token" => $token,
			],
			200
		);
	}
}