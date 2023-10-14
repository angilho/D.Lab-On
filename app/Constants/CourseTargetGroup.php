<?php

namespace App\Constants;

abstract class CourseTargetGroup
{
	const ELEMENTRY_SCHOOL = 0;
	const MIDDLE_SCHOOL = 1;
	const HIGH_SCOOL = 2;
	const GENERAL = 3;
	const MIDDLE_AND_HIGH_SCHOOL = 4;

	public static function all()
	{
		return [
			self::ELEMENTRY_SCHOOL,
			self::MIDDLE_SCHOOL,
			self::HIGH_SCOOL,
			self::GENERAL,
			self::MIDDLE_AND_HIGH_SCHOOL,
		];
	}
}