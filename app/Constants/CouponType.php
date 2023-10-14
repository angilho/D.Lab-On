<?php

namespace App\Constants;

abstract class CouponType
{
	//가격 절대할인
	const VALUE_DISCOUNT = "value_discount";
	//퍼센트 할인
	const PERCENT_DISCOUNT = "percent_discount";

	public static function all()
	{
		return [self::VALUE_DISCOUNT, self::PERCENT_DISCOUNT];
	}
}