<?php

namespace App\Constants;

abstract class CoursePostStatus
{
	// 미답변
	const NONE = "none";
	// 답변완료
	const CONFIRM = "confirm";

	public static function all()
	{
		return [self::NONE, self::CONFIRM];
	}
}