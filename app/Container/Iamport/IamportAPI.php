<?php

namespace App\Container\Iamport;

use GuzzleHttp;
use Firebase\JWT\JWT;

class IamportAPI
{
	private $GET_TOKEN_URL = "https://api.iamport.kr/users/getToken";
	private $GET_PAYMENT = "https://api.iamport.kr/payments";
	private $CANCEL_PAYMENT = "https://api.iamport.kr/payments/cancel";
	private $client = null;

	public function __construct()
	{
		$this->client = new GuzzleHttp\Client();
	}

	/**
	 * Iamport 에서 결제정보 가져오기
	 */
	public function getPayment($impUid)
	{
		$result = null;

		try {
			$token = $this->getAccessToken();
			if (empty($token->response->access_token) || !isset($token->response->access_token)) {
				throw new Exception("Get token failed.");
			}

			$response = $this->client->request("GET", "{$this->GET_PAYMENT}/{$impUid}", [
				"headers" => [
					"Authorization" => $token->response->access_token,
				],
			]);

			$result = json_decode($response->getBody()->getContents());
			if (!empty($response->response) && isset($response->response)) {
				$result = $response->response;
			}
		} catch (Exception $e) {
			throw $e;
		}

		return $result;
	}

	/**
	 * Iamport에서 결제 취소
	 */
	public function cancelPayment($merchantUid)
	{
		$result = null;

		try {
			$token = $this->getAccessToken();
			if (empty($token->response->access_token) || !isset($token->response->access_token)) {
				throw new Exception("Get token failed.");
			}

			$response = $this->client->request("POST", "{$this->CANCEL_PAYMENT}", [
				"headers" => [
					"Authorization" => $token->response->access_token,
				],
				"form_params" => [
					"merchant_uid" => $merchantUid,
					"reason" => "수강 신청 취소",
				],
			]);

			$result = json_decode($response->getBody()->getContents());
			if (!empty($response->response) && isset($response->response)) {
				$result = $response->response;
			}
		} catch (Exception $e) {
			throw $e;
		}

		return $result;
	}

	/**
	 * Iamport API 호출을 위한 Access Token 발급
	 */

	private function getAccessToken()
	{
		$result = null;
		$impKey = env("IAMPORT_API_KEY");
		$impSecret = env("IAMPORT_API_SECRET");

		if (empty($impKey) || empty($impSecret)) {
			throw new Exception("Iamport key not exists.");
		}

		try {
			$response = $this->client->request("POST", $this->GET_TOKEN_URL, [
				"headers" => [
					"Content-Type" => "application/json",
				],
				"body" => json_encode([
					"imp_key" => $impKey,
					"imp_secret" => $impSecret,
				]),
			]);
			$result = json_decode($response->getBody()->getContents());
		} catch (Exception $e) {
			throw $e;
		}

		return $result;
	}
}
