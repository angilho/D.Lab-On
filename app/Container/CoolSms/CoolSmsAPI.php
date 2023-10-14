<?php

namespace App\Container\CoolSms;

use GuzzleHttp;

class CoolSmsAPI
{
	private $SEND_MESSAGE_API_URL = "https://api.coolsms.co.kr/messages/v4/send-many";
	private $client = null;

	public function __construct()
	{
		$this->client = new GuzzleHttp\Client();
	}

	public function sendMessage($messages)
	{
		try {
			$response = $this->client->request("POST", $this->SEND_MESSAGE_API_URL, [
				"headers" => [
					"Authorization" => $this->getAccessHeader(),
					"Content-Type" => "application/json",
				],
				"body" => json_encode([
					"agent" => [
						"sdkVersion" => "PHP-SDK v4.0",
						"osPlatform" => PHP_OS . ", PHP Version " . phpversion(),
					],
					"messages" => $messages,
				]),
			]);

			$result = json_decode($response->getBody()->getContents());
		} catch (Exception $e) {
			throw $e;
		}

		return $result;
	}

	private function getAccessHeader()
	{
		$apiKey = env("COOL_SMS_API_KEY");
		$apiSecret = env("COOL_SMS_API_SECRET");
		date_default_timezone_set("Asia/Seoul");
		$date = date("Y-m-d\TH:i:s.Z\Z", time());
		$salt = uniqid();
		$signature = hash_hmac("sha256", $date . $salt, $apiSecret);
		return "HMAC-SHA256 apiKey={$apiKey}, date={$date}, salt={$salt}, signature={$signature}";
	}
}