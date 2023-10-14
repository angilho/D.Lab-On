<?php

namespace App\Constants;

abstract class LearningStatus
{
	const COMPLETE = "complete";
	const INCOMPLETE = "incomplete";

	public static function all()
	{
		return [self::COMPLETE, self::INCOMPLETE];
	}
}