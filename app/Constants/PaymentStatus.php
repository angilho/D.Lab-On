<?php

namespace App\Constants;

abstract class PaymentStatus
{
	//결제 완료
	const SUCCESS = "success";
	//결제 요청
	const REQUEST = "request";
	//결제 취소
	const CANCEL = "cancel";
	//결제 실패
	const FAIL = "fail";
	//결제 대기(가상 계좌를 위함)
	const READY = "ready";

	public static function all()
	{
		return [self::SUCCESS, self::REQUEST, self::CANCEL, self::FAIL, self::READY];
	}

	public static function convertLocaleString($status)
	{
		switch ($status) {
			case self::SUCCESS:
				return "결제완료";
			case self::REQUEST:
				return "결제요청";
			case self::CANCEL:
				return "결제취소";
			case self::FAIL:
				return "결제실패";
			case self::READY:
				return "결제대기";
			default:
				return "결제요청";
		}
	}
}