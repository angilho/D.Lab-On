<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\Models\FaqCategory;
use App\Models\FaqItem;

class FaqSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		if (FaqCategory::all()->isEmpty() && FaqItem::all()->isEmpty()) {
			$this->addCourseFaq();
			$this->addEnrollmentFaq();
			$this->addAccountFaq();
			$this->addPaymentFaq();
		}
	}

	/**
	 * FAQ - 수업
	 */
	private function addCourseFaq()
	{
		$courseCategory = FaqCategory::create([
			"name" => "수업",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "디랩온은 다른 코딩 수업과 어떤 점이 다른가요?",
			"description" => "1. 차별화된 교육용 콘텐츠를 제공하는 온라인 라이브 코딩 교육 서비스
				온라인에서 만나기 어려운 쿨하고 차별화된 콘텐츠를 제공합니다.
				화상 라이브 코딩 교육을 통하여 우리 아이들의 안전에 대한 걱정 없이 유익한 학습의 경험을 이어갑니다.
				
				2. 디랩코딩학원의 훌륭한 교육이 온라인에서 그대로!
				코딩 교육 전문 기관 ‘디랩’이 오프라인을 넘어 온라인에서도 새로운 교육의 혁신을 이끌어 갑니다.
				디랩은 코드아카데미 교육 사업을 통해 대한민국 코딩 교육을 선도해오면서 디랩을 경험한 학생들과 학부모님들로부터 깊은 신뢰를 받아 왔습니다.
		
				3. 언제 어디서나 원하는 수업 참여가 가능한 서비스
				오프라인에서 이루어진 교육의 경험을 토대로 연령별 최적화된 시간대별로 다양한 콘텐츠를 제공합니다.
		
				디랩온에서는 내 아이에게 맞는 콘텐츠를 직관적으로 탐색하여 바로 수강 신청이 가능합니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "디랩온의 수업을 들으면 무엇을 할 수 있나요?",
			"description" =>
				"디랩온의 교육 목표는 ‘소프트웨어 교육을 통한 창업가 경험'입니다. 디랩온 수업을 통해 시대에 필수적인 소프트웨어 지식을 기르고, 그 지식으로 자신만의 창의적이고 독특한 프로젝트를 진행할 수 있게 됩니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "수업에 필요한 노트북/컴퓨터 사양은 어떻게 되나요?",
			"description" => "최소 사양으로는 [윈도우 10 / i5 4세대 / 메모리 8GB] 이며 화상 화면과 교육(코딩)화면을 번갈아 사용해야 하므로 듀얼 모니터를 권장하고 있습니다.
				- 듀얼모니터 란? 한 개의 컴퓨터에 두 개의 모니터 또는 노트북에 별도 모니터를 연결하여 사용하는 것입니다. 원격 수업과 학생의 작업 화면을 한번에 볼 수 있습니다.
				- 듀얼 모니터를 사용하지 않아도 수업을 듣는 데 문제는 없지만, 선생님의 수업과 학생의 작업 화면을 동시에 사용한다면 훨씬 수업 진행 효과가 좋을 것 같습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "방과 후 수업, 타 교육과정을 통해 스크래치를 배웠는데, 필수 과목을 건너뛸 수 있나요?",
			"description" =>
				"타 기관을 통해 스크래치 과정을 수강 했어도 기관 별 이수한 교육 과정의 난이도가 다르기 때문에 디랩온 고객센터와 상담 후 결정하시는 것을 추천해 드립니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "1:1 클래스와 라이브 클래스는 어떤 점이 다른가요?",
			"description" => "라이브 클래스는 정해진 날짜, 시간에만 수강이 가능하고  4명 정도의 소규모로 수업이 진행됩니다.
				1:1 클래스는 고객이 원하는 날짜와 시간대를 위주로 클래스 시간을 정할 수 있습니다. 
				맞춤형 일대일 강의로 학생의 수준에 맞춰 수업을 진행하는 등 특화된 집중 케어가 제공됩니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "수업에 빠졌는데, 보충은 어떻게 하나요?",
			"description" => "- 공통 : 디랩온 카카오톡 채널로 기본 정보(휴대폰번호/학생이름/클래스) 와 함께 보충을 문의해 주시거나 디랩온 고객센터로 전화주시기 바랍니다.
				- 라이브 클래스는 예정된 수업 시작일 하루 전까지 디랩온 고객센터에 사전 연락을 주셔야 합니다. 
				보충 방법은 예약제로 보충 클래스를 운영합니다. 
				디랩온 상담원이 고객에게 각 과목별 보충 클래스 시간을 설명하고 가능한 시간을 예약 진행합니다. 고객의 예약한 날짜, 시간대를 확인하여 보충을 진행할 수 있도록 안내 드리고 있습니다.
				- 1:1 클래스는 수업일 하루 전까지 결석에 대한 의사를 담당 선생님 및 고객센터로 연락을 주셔야만 보충 수업을 진행할 수 있습니다.
				보충 방법은 담당 선생님과 고객이 가능한 날짜 및 시간을 확인하여 디랩온 상담원이 보충을 진행할 수 있도록 안내 드리고 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "학습 진도는 어디서 확인하나요?",
			"description" =>
				"[ 메인 > 나의 코딩스페이스 > 수강 중인 수업 > 교안 보기 > 학습정보 > 학습현황 ] 에서 현재 진행 중인 수업의 진도를 확인하실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "수업 전 준비물은 무엇인가요?",
			"description" =>
				"ZOOM을 활용하여 수업이 진행되기에 노트북 혹은 데스크톱을 사용하신다면 웹캠과 마이크가 꼭 필요합니다. 제작 키트로 진행되는 수업 외에는 다른 준비물은 없습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "결제 후 수강 안내는 어떻게 진행되나요?",
			"description" => "결제 완료 안내를 받는 날로부터 영업일 기준 다음날에 수강 안내 문자를 보내드립니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $courseCategory->id,
			"name" => "지각, 결석에 대한 규정",
			"description" => "[지각]
				수업 시작 후 30분 이내에 출석할 때는 예정대로 수업이 진행됩니다.
				수업은 정시부터 진행되며, 학생이 지각할 경우에도 정해진 시간에 수업이 종료됩니다. 
				[결석]
			 	예정된 수업 시작일 하루 전까지 담당 선생님이나 디랩온 고객센터로 사전 연락을 주셔야 합니다. 만약 사전에 통보되지 않고 결석일 경우 수업의 회차는 자동으로 수강한 것으로 간주됩니다. ",
		]);
	}

	/**
	 * FAQ - 수강신청
	 */
	private function addEnrollmentFaq()
	{
		$enrollmentCategory = FaqCategory::create([
			"name" => "수강신청",
		]);

		FaqItem::create([
			"faq_category_id" => $enrollmentCategory->id,
			"name" => "수강 신청은 언제 가능한가요?",
			"description" => "과목 유형별로 안내해 드리겠습니다.
				- 라이브 클래스는 강사 선생님이 배정되면 [ 메인 > 커리큘럼 > 과목 상세페이지 > 요일, 시간, 날짜 ]를 선택하여 신청할 수 있습니다.
				- 1:1 클래스 및 1:1 패키지 클래스는 상시 신청이 가능합니다! 
				수업 별 강사 선생님들의 수업 일정에 따라 조기 마감될 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $enrollmentCategory->id,
			"name" => "수강 신청은 어디서 하나요?",
			"description" =>
				"[ 메인 > 커리큘럼 > 희망하는 수업 선택 > 수강 신청하기 ] 홈페이지 상단의 커리큘럼 메뉴를 통해 수업 목록을 확인하고 원하시는 수업을 선택하여 수강 신청을 진행해 주시면 됩니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $enrollmentCategory->id,
			"name" => "수강 신청 확인은 어떻게 할 수 있나요?",
			"description" => "[나의 코딩스페이스] 메뉴 또는 [마이페이지 > 수강내역] 메뉴에서 확인하실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $enrollmentCategory->id,
			"name" => "자녀 수강 신청 시 꼭 자녀 추가를 해야 하나요?",
			"description" => "자녀를 위한 수업을 신청 하려면 자녀 추가를 해주셔야 합니다.
				추가 해주신 자녀 정보로 수업 신청 시 자녀의 결제를 도와줄 수 있으니 정확한 정보로 가입 후 수강 신청 해주시길 부탁 드립니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $enrollmentCategory->id,
			"name" => "어떤 강의를 수강해야 할지 모르겠어요",
			"description" => "디랩온 카카오 채널 및 고객센터로 연락 주세요.
				고객에게 적합한 수업을 맞춤 상담을 통해 추천해 드립니다.
				혹여 문의가 급격히 증가하는 경우, 답변이 다소 지연될 수 있음을 양해 부탁 드립니다.",
		]);
	}

	/**
	 * FAQ - 계정
	 */
	private function addAccountFaq()
	{
		$accountCategory = FaqCategory::create([
			"name" => "계정",
		]);

		FaqItem::create([
			"faq_category_id" => $accountCategory->id,
			"name" => "회원가입은 어디서 하나요?",
			"description" => "디랩온 홈페이지 우측 상단에 '회원가입' 버튼을 누르시면 가입하실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $accountCategory->id,
			"name" => "아이디 / 비밀번호를 분실하면 어떻게 해야 하나요?",
			"description" => "[ 메인 > 로그인 > 아이디/비밀번호찾기 ] 
				우측 상단에 로그인 버튼을 누르신 후, 로그인 화면에서 아이디/비밀번호 찾기 버튼을 눌러 진행하시면 분실하신 아이디 및 비밀번호를 찾으실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $accountCategory->id,
			"name" => "비밀번호를 변경하려면 어떻게 해야 하나요?",
			"description" => "[마이페이지 > 계정 > 비밀번호]  메뉴에서 비밀번호를 재 설정 하실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $accountCategory->id,
			"name" => "휴대폰, 이메일이 없는 자녀도 가입이 가능한가요?",
			"description" =>
				"네 가능합니다. 다만, 휴대폰이나 구글 계정이 필요한 수업도 있으니 수업 준비물을 꼼꼼히 확인해 주시기 바랍니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $accountCategory->id,
			"name" => "회원 정보 변경은 어떻게 하나요?",
			"description" =>
				"로그인하신 후 우측 상단 [ 마이페이지 > 계정 > 가입 정보 ] 메뉴를 통하여 정보를 수정하실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $accountCategory->id,
			"name" => "회원 정보에서 자녀를 추가로 등록하고 싶어요. 어떻게 하나요?",
			"description" => "[ 메인 > 마이페이지 > 자녀 정보 > 자녀추가 ] 메뉴에서 자녀를 추가 등록하실 수 있습니다.",
		]);
	}

	/**
	 * FAQ - 결제
	 */
	private function addPaymentFaq()
	{
		$paymentCategory = FaqCategory::create([
			"name" => "결제",
		]);

		FaqItem::create([
			"faq_category_id" => $paymentCategory->id,
			"name" => "결제 방법은 무엇이 있나요?",
			"description" => "결제 방법은 신용카드와 무통장 입금 두 가지 방법으로 결제할 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $paymentCategory->id,
			"name" => "수강료 분할 납부도 가능한가요?",
			"description" => "카드 결제 시 분할 납부 가능합니다.
				단, 카드사 별 무이자 할부 가능 개월 수는 상이할 수 있으니, 꼭 확인 후 결제해 주시기 바랍니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $paymentCategory->id,
			"name" => "계좌이체 시 현금영수증을 신청할 수 있나요?",
			"description" => "[ 결제페이지 > 약관동의 > 현금영수증발행 체크확인 > 소등공제용&지출증빙용 확인 > 주민등록번호&카드번호&휴대폰 번호 입력 ] 
				결제 페이지에서 '결제하기' 버튼을 누르시고 약관 동의 후 KG이니시스 무통장입금 화면이 나옵니다. 화면 하단에 기본적으로 현금영수증 발행이 체크되어 있으며, 소득공제용인지 지출 증빙용인지 체크 하신 후, 주민등록번호, 카드번호, 휴대폰 번호 중 원하시는 항목을 체크하여 진행하시면 현금 영수증을 신청하실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $paymentCategory->id,
			"name" => "결제 내역은 어디에서 확인이 가능한가요?",
			"description" =>
				"[ 로그인 > 메인(오른쪽 상단) > 마이페이지 > 결제 내역 ] 메뉴에서 결제 내역을 확인하실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $paymentCategory->id,
			"name" => "쿠폰은 어떻게 사용하나요?",
			"description" => "[ 커리큘럼 > 장바구니 > 결제 > 쿠폰 등록하기 > 적용하기 > 최종 결제 정보 ] 
				커리큘럼에서 희망하는 수업을 장바구니에 담으신 후 장바구니에서 결제 진행 시 할인 쿠폰 코드를 입력하고 적용하기를 누르시면 총 결제 금액에 쿠폰 할인이 적용됩니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $paymentCategory->id,
			"name" => "해외에서는 어떻게 결제하면 될까요?",
			"description" => "VISA, MASTER, JCB, 다이너스, AMEX 카드를 이용하시면 결제하실 수 있습니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $paymentCategory->id,
			"name" => "결제 취소나 환불은 어떻게 하나요?",
			"description" => "- 결제 취소는 디랩온 고객센터로 문의 하시면 안내 받으실 수 있습니다.
				- 환불은 환불 정책을 확인하신 후 디랩온 고객센터로 문의 하시면 안내 받으실 수 있습니다. [환불정책 바로가기]
				- 고객센터: 031-526-9313 & 카카오 채널 [디랩온 채널 바로가기]
				문의가 급격히 증가하는 경우, 답변 처리가 다소 지연될 수 있음을 양해 부탁 드립니다.",
		]);

		FaqItem::create([
			"faq_category_id" => $paymentCategory->id,
			"name" => "수강료 환불 기준",
			"description" => "수업 시작 전 미리 제공된 콘텐츠 소비를 하지 않은 상태에서는 전액 환불 됩니다.

			총 수업일 1개월 이내에는 「학원의 설립 · 운영 및 과외교습에 관한 법률」 제18조 1항 및 「학원의 설립 · 운영 및 과외 교습에 관한 법률 시행령」 제18조 제2항에 따라 환불 합니다.
			
			수업시간 1/3 경과 전 : 수강료 2/3 환불
			수업시간 2/3 경과 전 : 수강료 1/2 환불
			수업시간 1/2 경과 후 : 환불금액 없음
			
			- 환불 의사를 밝힌 다음 날부터 계산하여 환불 합니다.
			- 환불 금액은 수업 시간을 기준(반올림)으로 산정합니다.
			- 환불 금액의 10원 미만은 절삭 합니다.
			- 반환 사유 발생 시 3영업일 이내 환불 됩니다.
			- 1개월 산정 기준은 민법 제 160조(역에 의한 계산)를 적용합니다.
			  실제 일수와 상관없이 수업 시작일이 3월 7일인 경우, 1개월은 4월 6일까지 입니다.
			  단, 수업 시작일이 1월 31일인 경우, 1개월은 월의 말일 인 2월 28일까지 입니다.
			
			교습 기간이 1개월을 초과하는 경우 지난 월 기준 수강료에 대해서는 환불이 불가능하며, 수강 해지 요청(환불 의사 밝힌) 시점의 해당 월 수강 일수를 기준으로 부분 금액을 환불 합니다.
			해당 월 수강 일수에 대한 환불 기준은 위 '총 수업일 1개월 이내'의 기준과 동일합니다.",
		]);
	}
}
