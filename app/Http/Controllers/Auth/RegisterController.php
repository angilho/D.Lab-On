<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
	/*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

	use RegistersUsers;

	/**
	 * Where to redirect users after registration.
	 *
	 * @var string
	 */
	protected $redirectTo = RouteServiceProvider::HOME;

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		$this->middleware("guest")->except([
			"showRegistrationChild",
			"showRegistrationChildConfirm",
			"showRegistrationWelcome",
		]);
	}

	/**
	 * index
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * 회원 가입 약관동의 화면
	 *
	 * @return \Illuminate\View\View
	 */
	public function showRegistrationAgreement()
	{
		return view("app");
	}

	/**
	 * 회원 가입 사용자 정보 입력 화면
	 *
	 * @return \Illuminate\View\View
	 */
	public function showRegistrationUser(Request $request)
	{
		return view("app");
	}

	/**
	 * 회원 가입 자녀 사용자 정보 입력 화면
	 *
	 * @return \Illuminate\View\View
	 */
	public function showRegistrationChildUser(Request $request)
	{
		return view("app");
	}

	/**
	 * 자녀 가입 사용자 정보 입력 화면
	 *
	 * @return \Illuminate\View\View
	 */
	public function showRegistrationChild(Request $request)
	{
		//본인 혹은 운영자만 갈 수 있어야 함
		return view("app");
	}

	/**
	 * 자녀 가입 사용자 정보 입력 화면
	 *
	 * @return \Illuminate\View\View
	 */
	public function showRegistrationChildConfirm(Request $request)
	{
		return view("app");
	}

	/**
	 * 회원 가입 완료 화면
	 *
	 * @return \Illuminate\View\View
	 */
	public function showRegistrationWelcome()
	{
		return view("app");
	}
}