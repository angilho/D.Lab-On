<?php

namespace App\Http\Controllers\Auth;

use App\Constants\Role;
use App\Constants\TokenAbility;
use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
	/*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

	use AuthenticatesUsers;

	/**
	 * Where to redirect users after login.
	 *
	 * @var string
	 */
	protected $redirectTo = RouteServiceProvider::HOME;

	/**
	 * 로그인 기준 데이터 컬럼을 정한다.
	 */
	public function username()
	{
		return "user_login";
	}

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		$this->middleware("guest")->except("logout");
	}

	/**
	 * Validate the user login request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return void
	 *
	 * @throws \Illuminate\Validation\ValidationException
	 */
	protected function validateLogin(Request $request)
	{
		$request->validate([
			$this->username() => "required|string",
			"password" => "required|string",
		]);

		$organizationPath = $request->input("path");
		$userLogin = $request->input("user_login");

		if ($organizationPath) {
			// 기업 로그인으로 들어온 경우 해당 회원이 해당 기업에 존재해야 함
			$user = User::where("user_login", $userLogin)->first();
			$organization = Organization::where("path", $organizationPath)->first();
			if ($user && $organization && $user->organization_id !== $organization->id) {
				throw ValidationException::withMessages([
					$this->username() => [trans("auth.failed")],
				]);
			}
		} else {
			// 일반 로그인으로 들어온 경우 organization_id가 있는 사용자는 로그인을 할 수 없다.
			$user = User::where("user_login", $userLogin)->first();
			if ($user && $user->organization_id !== null) {
				throw ValidationException::withMessages([
					$this->username() => ["기업 로그인 페이지를 이용해주세요"],
				]);
			}
		}
	}

	/**
	 * The user has been authenticated.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  mixed  $user
	 * @return mixed
	 */
	protected function authenticated(Request $request, $user)
	{
		// API Token을 발행한다.
		// 운영자인 경우 Ability에 "admin"을 추가한다.
		$user = auth()->user();
		$tokenAbility = [];
		if ($user->role === Role::ADMIN) {
			$tokenAbility = [TokenAbility::ADMIN, TokenAbility::INSTRUCTOR];
		} elseif ($user->role === Role::INSTRUCTOR) {
			$tokenAbility = [TokenAbility::INSTRUCTOR];
		}
		$token = $user->createToken("API Token", $tokenAbility)->plainTextToken;

		return response()->json(
			[
				"api_token" => $token,
			],
			200
		);
	}

	/**
	 * Log the user out of the application.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
	 */
	public function logout(Request $request)
	{
		// API Token을 제거한다.
		try {
			$user = auth()->user();
			$organizationPath = "";
			if ($user) {
				$user->tokens()->delete();
				if ($user->organization) {
					$organizationPath = $user->organization->path;
				}
			}

			$this->guard()->logout();

			$request->session()->invalidate();

			$request->session()->regenerateToken();
		} catch (\Exception $e) {
			// 로그아웃은 실패하더라도 아무일도 하지 않는다.
		}

		if ($response = $this->loggedOut($request)) {
			return $response;
		}

		return $request->wantsJson() ? new JsonResponse([], 204) : redirect("/{$organizationPath}");
	}

	/**
	 * 기업 로그인 페이지
	 */
	public function organizationLogin($organizationPath)
	{
		// path에 등록된 기업이 있는지 확인한다.
		$organization = Organization::where("path", $organizationPath)->first();
		if (!$organization) {
			abort(404);
		}

		// 기업의 사용기간이 맞는지 확인한다.
		$now = date("Y-m-d");
		if (!($organization->start_at->format("Y-m-d") <= $now && $organization->end_at->format("Y-m-d") >= $now)) {
			abort(403);
		}

		return view("auth.login");
	}
}
