<?php

namespace App\Container\API;

use App\Constants\PaymentStatus;
use App\Constants\CouponType;

use App\Models\User;
use App\Models\Coupon;
use App\Models\Payment;
use App\Models\PaymentItem;
use Carbon\Carbon;

class PaymentStoreService
{
	private User $user;
	private $validated;

	public function __construct($userId, $validated)
	{
		if (isset($userId) && !empty($userId)) {
			$this->user = User::with([
				"cart.course",
				"cart.course_section",
				"children.cart.course",
				"children.cart.course_section",
			])
				->where("id", $userId)
				->first();
		}

		if (isset($validated) && !empty($validated)) {
			$this->validated = $validated;
		}
	}

	/**
	 * 결제 정보를 생성한다.
	 */
	public function calcPaymentData()
	{
		//프론트에서 받은 결제 값을 신뢰할 수 없으므로
		//장바구니 기반으로 결제하므로, 결제할 값들을 계산해 저장할 데이터들을 만들어 준다.
		$paymentDataArr = [];
		$totalPrice = 0;
		$name = "";
		$count = 0;

		//현재 사용자가 결제한 데이터들을 취합하자.
		foreach ($this->user->cart as $key => $cart) {
			$coursePrice = $cart->course->price - $cart->course->discount_price;
			array_push(
				$paymentDataArr,
				$this->createPaymentInfoData(
					null,
					$cart->user_id,
					$cart->course_id,
					$cart->course_section_id,
					$coursePrice
				)
			);

			$totalPrice += $coursePrice;
			if ($count == 0 && strlen($name) == 0) {
				$name .= $cart->course->name;
			} else {
				$count += 1;
			}
		}

		//현재 사용자와 연결된 데이터들을 취합하자
		foreach ($this->user->children as $key => $child) {
			foreach ($child->cart as $key => $cart) {
				$coursePrice = $cart->course->price - $cart->course->discount_price;
				array_push(
					$paymentDataArr,
					$this->createPaymentInfoData(
						null,
						$cart->user_id,
						$cart->course_id,
						$cart->course_section_id,
						$coursePrice
					)
				);

				$totalPrice += $coursePrice;
				if ($count == 0 && strlen($name) == 0) {
					$name .= $cart->course->name;
				} else {
					$count += 1;
				}
			}
		}

		//결제 정보 이름을 설정하기 위함.
		if ($count >= 1) {
			$name .= "외 ${count}건";
		}

		//쿠폰 아이디가 존재한다면 쿠폰 데이터를 받아와 할인 가격을 totalPrice로 지정한다.
		if (isset($this->validated["coupon_id"]) && !empty($this->validated["coupon_id"])) {
			$totalPrice = $this->calcCouponPrice($totalPrice, $this->validated["coupon_id"]);
		}

		//계산이 다 끝났다면 validated 데이터에 최종적으로 DB에 넣을 값을 업데이트 한다.
		$this->validated["total_price"] = $totalPrice;
		$this->validated["name"] = $name;
		$this->validated["payment_items"] = $paymentDataArr;
	}

	public function appendAdditionalData()
	{
		$now = Carbon::now();
		$this->validated["req_user_id"] = $this->user->id;
		$this->validated["merchant_uid"] = "OR_{$this->user->id}_{$now->format("Ymd_His")}";
		$this->validated["status"] = PaymentStatus::REQUEST;
	}

	public function validated()
	{
		return $this->validated;
	}

	private function createPaymentInfoData($paymentId, $userId, $courseId, $courseSectionId, $price)
	{
		$paymentInfo = [
			"payment_id" => $paymentId ?? "",
			"user_id" => $userId ?? "",
			"course_id" => $courseId ?? "",
			"course_section_id" => $courseSectionId ?? "",
			"price" => $price ?? "",
		];

		return $paymentInfo;
	}

	/**
	 * Coupon이 있다면 Coupon 계산을 한 값을 저장한다.
	 */
	private function calcCouponPrice($totalPrice, $couponId)
	{
		$coupon = Coupon::findOrFail($couponId);

		switch ($coupon->type) {
			//가격 할인일 경우에는 바로 해당 가격을 붙여서 할인을 때린다
			case CouponType::VALUE_DISCOUNT:
				$totalPrice -= $coupon->value;
				break;
			//퍼센트 깎는 형식일 경우(10%, 20%등의 형태로 들어있음)
			case CouponType::PERCENT_DISCOUNT:
				$totalPrice -= ceil($totalPrice * ($coupon->value / 100));
				break;
		}

		//혹시나 가격 할인 쿠폰이 너무 좋아서 사려고 하는 가격보다 클 경우 0원을 반환하자
		if ($totalPrice < 0) {
			return 0;
		}

		return $totalPrice;
	}
}
