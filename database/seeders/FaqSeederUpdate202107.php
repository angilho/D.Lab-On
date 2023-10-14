<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\Models\FaqCategory;
use App\Models\FaqItem;

class FaqSeederUpdate202107 extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		if (!FaqCategory::where("name", "VOD 클래스")->exists()) {
			$this->addVodCourseFaq();
		}
	}

	/**
	 * FAQ - VOD 클래스
	 */
	private function addVodCourseFaq()
	{
		$vodCategory = FaqCategory::create([
			"name" => "VOD 클래스",
		]);

		FaqItem::create([
			"faq_category_id" => $vodCategory->id,
			"name" => "VOD 클래스 수강 기간은 어떻게 되나요?",
			"description" => "디랩온 VOD 클래스는 한번의 결제로 1년간 수강 할 수 있는 클래스입니다. ",
		]);

		FaqItem::create([
			"faq_category_id" => $vodCategory->id,
			"name" => "결제 후 언제부터 수강할 수 있나요?",
			"description" => '결제 완료 후 바로 수강하실 수 있습니다. 수강 중인 수업은 아래와 같이 확인하실 수 있습니다.
			* 웹(PC) : 디랩온 홈페이지 > 로그인 > 나의 코딩스페이스 > 수강중인수업 > "강의입장" 클릭
			* 앱(모바일) : 디랩온 홈페이지 > 오른쪽 상단 메뉴바(3선) 클릭 > 로그인 > 오른쪽 상단 메뉴바(3선) 클릭 > 나의 코딩스페이스 > 수강중인수업 > "강의입장" 클릭 ',
		]);

		FaqItem::create([
			"faq_category_id" => $vodCategory->id,
			"name" => "영상 재생이 잘 안되거나 문제가 발생하면 어떻게 해결하나요?",
			"description" =>
				"공용 Wi-fi를 사용하실 경우 네트워크 상태에 따라 일시적으로 끊김 현상이 일어날 수 있습니다. 컴퓨터 및 모바일의 네트워크 상태를 확인했지만 지속적인 문제 발생 시 페이지 맨 아래의 디랩온 카카오 채널(검색ID : dlabon)로 문의 해주세요.",
		]);

		FaqItem::create([
			"faq_category_id" => $vodCategory->id,
			"name" => "영상을 다운로드 할 수 있나요?",
			"description" =>
				"영상은 디랩온 웹(PC) 및 앱(모바일) 내에서만 온라인으로 무제한 재생이 가능하여 개별 다운로드는 불가합니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $vodCategory->id,
			"name" => "환불 규정이 어떻게 되나요?",
			"description" => '결제 후 7일 이내에 영상을 재생한 이력이 없을 시 전액 환불이 가능합니다.
			자세한 환불 규정은 맨 아래 좌측 하단의 "환불정책"에서 확인 해주세요.',
		]);

		FaqItem::create([
			"faq_category_id" => $vodCategory->id,
			"name" => "환불 신청은 어디서 하나요?",
			"description" =>
				'디랩온 카카오 채널(검색ID : dlabon)로 접속 후 "VOD 클래스 환불 요청합니다." 라고 문의 해주시면 친절히 안내드리겠습니다.',
		]);
	}
}