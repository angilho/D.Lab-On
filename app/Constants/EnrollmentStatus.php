<?php

namespace App\Constants;

abstract class EnrollmentStatus
{
	//수강 승인
	const COMPLETE = "complete";
	//수강 취소
	const CANCEL = "cancel";

	public static function all()
	{
		return [self::COMPLETE, self::CANCEL];
	}
}