<?php

namespace App\Container\Elice;

use GuzzleHttp;
use Firebase\JWT\JWT;

class EliceAPI
{
	/**
	 * 앨리스 과목으로 SSO 연동으로 이동하기 위한 URL을 구한다.
	 */
	public function getEliceCourseSsoUrl($userLogin, $userName, $userEmail, $courseId)
	{
		$ts = intval(microtime(true) * 1000);
		$payload = (object) [
			"uid" => $userLogin,
			"fullname" => $userName,
			"email" => $userEmail ?? "",
			"ts" => $ts,
			"courseId" => $courseId,
		];

		$secret = env("ELICE_API_SECRET");
		$jwt = JWT::encode($payload, $secret);

		$client = new GuzzleHttp\Client();
		$apiUrl = env("ELICE_API_URL");

		try {
			$redirectUrl = "";
			$client->request("POST", $apiUrl, [
				"allow_redirets" => ["track_redirects" => true],
				"form_params" => ["tokenInfo" => $jwt],
				"on_stats" => function (GuzzleHttp\TransferStats $stats) use (&$redirectUrl) {
					$redirectUrl = (string) $stats->getEffectiveUri();
				},
			]);
		} catch (\Exception $e) {
			return null;
		}

		return $redirectUrl;
	}
}