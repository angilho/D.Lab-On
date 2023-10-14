<?php

namespace App\Http\Controllers\API\v1;

use App\Container\Elice\EliceAPI;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class EliceCourseController extends Controller
{
	/**
	 * 앨리스 과목으로 이동하기 위한 SSO URL을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function getSsoUrl($eliceId)
	{
		$user = Auth::User();
		$eliceApi = app(EliceAPI::class);
		$ssoUrl = $eliceApi->getEliceCourseSsoUrl("dlabon_" . $user->user_login, $user->name, $user->email, $eliceId);
		if (!$ssoUrl) {
			return response()->json(["message" => "failed to get sso url"], 500);
		}

		return $ssoUrl;
	}
}