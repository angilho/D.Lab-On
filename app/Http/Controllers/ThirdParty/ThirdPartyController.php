<?php

namespace App\Http\Controllers\ThirdParty;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ThirdPartyController extends Controller
{
	/**
	 * Show the application courses.
	 *
	 * @return \Illuminate\View\View
	 */
	public function searchAddressGet()
	{
		$jusoKey = env("JUSO_API_KEY", "");

		return view("thirdParty.searchAddress", [
			"juso_api_key" => $jusoKey,
			"addr" => [
				"address" => "",
				"address_detail" => "",
			],
			"input_yn" => "N",
		]);
	}
	/**
	 * Show the application courses.
	 *
	 * @return \Illuminate\View\View
	 */
	public function searchAddressPost(Request $request)
	{
		$jusoKey = env("JUSO_API_KEY", "");
		$postData = $request->post();

		return view("thirdParty.searchAddress", [
			"juso_api_key" => $jusoKey,
			"addr" => [
				"address" => $postData["jibunAddr"],
				"address_detail" => $postData["addrDetail"],
			],
			"input_yn" => "Y",
		]);
	}

	public function searchSchoolGet()
	{
		return view("thirdParty.searchSchool", []);
	}

	public function searchSchoolPost(Request $request)
	{
		$postData = $request->post();
		$result = [];

		//검색 요청이 들어올 경우 API 요청을 보낸다.
		if (isset($postData["search"]) && !empty($postData["search"])) {
			$apiKey = env("OPEN_API_KEY", "");
			$response = Http::get(
				"https://open.neis.go.kr/hub/schoolInfo?KEY={$apiKey}&SCHUL_NM={$postData["search"]}&Type=json&pIndex=1&pSize=1000"
			)
				->throw()
				->json();

			//검색 결과가 없다면 메시지 반환
			if (isset($response["RESULT"]["MESSAGE"]) && !empty($response["RESULT"]["MESSAGE"])) {
				return view("thirdParty.searchSchool", [
					"message" => $response["RESULT"]["MESSAGE"],
				]);
			}

			//검색 결과가 존재하면 array로 반환하자.
			//TODO: Pagination
			if (
				isset($response["schoolInfo"]) &&
				!empty($response["schoolInfo"]) &&
				count($response["schoolInfo"]) > 0
			) {
				//첫번째 결과는 메시지 출력 및 리스트 정보이다. 일단 무시하고 데이터부터 잘 뿌려보자.
				array_shift($response["schoolInfo"]);
				foreach ($response["schoolInfo"][0]["row"] as $school) {
					array_push($result, [
						"name" => $school["SCHUL_NM"],
						"address" => "{$school["ORG_RDNMA"]},{$school["ORG_RDNDA"]}",
						"postcode" => $school["ORG_RDNZC"],
						"kind" => $school["SCHUL_KND_SC_NM"],
					]);
				}
			}
		}

		return view("thirdParty.searchSchool", [
			"searchResult" => $result,
		]);
	}
}