<?php

namespace App\Container\API;

use App\Constants\PaymentStatus;
use App\Constants\CouponCategory;
use App\Container\Iamport\IamportAPI;
use App\Models\Payment;
use App\Models\PaymentItem;
use App\Models\Coupon;
use Carbon\Carbon;

class PaymentCompleteService
{
	private $payment;
	private $validated;
	private $iamportPaymentData;
	private $isFree = false;

	function __construct($validated, $userid, $id)
	{
		$this->payment = Payment::findOrFail($id);
		$this->validated = $validated;
		// 무료결제는 iamport 정보가 없다.
		if ($this->payment->method === "free") {
			$this->isFree = true;
			return;
		}

		$iamportApi = new IamportAPI();
		$this->iamportPaymentData = $iamportApi->getPayment($this->validated["imp_uid"]);
	}

	/**
	 * Webhook에서 초기화 할 때 필요한 내용
	 */
	public static function initInWebhook($validated)
	{
		$payment = Payment::where(["merchant_uid" => $validated["merchant_uid"]])->first();
		if (!$payment) {
			throw new \Exception("결제 정보 존재하지 않음");
		}

		return new PaymentCompleteService($validated, null, $payment->id);
	}

	/**
	 * 위변조 된 결제 요청인지 판별한다.
	 */
	public function isFakePayment()
	{
		// 무료결제는 위변조 체크가 필요 없음
		if ($this->isFree) {
			return;
		}

		//동일 상품 정보 체크
		if ($this->payment->merchant_uid !== $this->iamportPaymentData->response->merchant_uid) {
			$this->payment->status = PaymentStatus::FAIL;
			throw new \Exception("결제 정보 불일치");
		}

		//결제 상태 체크
		if ($this->payment->total_price !== $this->iamportPaymentData->response->amount) {
			$this->payment->status = PaymentStatus::FAIL;
			throw new \Exception("결제 정보 위변조 의심");
		}
	}

	public function paymentComplete()
	{
		// 쿠폰을 사용한 경우 해당 쿠폰이 일회성인 경우 used_at을 기록한다.
		if (isset($this->payment->coupon_id)) {
			$coupon = Coupon::where("id", $this->payment->coupon_id)->first();
			if ($coupon && $coupon->category === CouponCategory::ONE_TIME) {
				$coupon->update([
					"used_at" => Carbon::now(),
				]);
			}
		}

		// 무료는 바로 완료 처리한다.
		if ($this->isFree) {
			$this->payment->status = PaymentStatus::SUCCESS;
			return;
		}

		switch ($this->iamportPaymentData->response->status) {
			case "ready": // 가상계좌 발급일 경우
				$this->payment->status = PaymentStatus::READY;
				$this->payment->vbank_name = $this->iamportPaymentData->response->vbank_name;
				$this->payment->vbank_num = $this->iamportPaymentData->response->vbank_num;
				break;
			case "paid": // 결제 완료
				$this->payment->status = PaymentStatus::SUCCESS;
				break;
		}
	}

	public function updatePayment()
	{
		if ($this->payment->isDirty()) {
			$this->payment->update();
		}
	}

	public function getPayment()
	{
		return $this->payment;
	}
}