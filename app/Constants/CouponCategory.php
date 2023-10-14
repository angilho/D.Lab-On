<?php

namespace App\Constants;

abstract class CouponCategory
{
	//일회성 쿠폰
	const ONE_TIME = "one_time";
	//다회성 쿠폰
	const MULTIPLE_TIME = "multiple_time";

	public static function all()
	{
		return [self::ONE_TIME, self::MULTIPLE_TIME];
	}
}