<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
	/**
	 * 비밀번호 초기화 이메일을 발송한다.
	 */
	public function forgot(Request $request)
	{
		$credentials = $request->validate(["email" => "required|email"]);
		Password::sendResetLink($credentials);
		return response()->noContent();
	}

	/**
	 * 비밀번호를 초기화 한다.
	 */
	public function reset()
	{
		$credentials = request()->validate([
			"email" => "required|email",
			"token" => "required|string",
			"password" => "required|string|confirmed",
		]);

		$resetPasswordStatus = Password::reset($credentials, function ($user, $password) {
			$user->password = Hash::make($password);
			$user->save();
		});

		if ($resetPasswordStatus == Password::INVALID_TOKEN) {
			return response()->json(["error" => "토큰 정보가 잘못되었습니다."], 400);
		}

		return response()->noContent();
	}
}