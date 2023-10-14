<?php

namespace App\Constants;

/**
 * 자녀 성별을 나타내는 값
 * 남성: m, 여성: f
 */
abstract class Gender
{
	const MALE = "m";
	const FEMALE = "f";

	public static function all()
	{
		return [self::MALE, self::FEMALE];
	}

	public static function convertStringToAtrribute($gender)
	{
		return $gender == "남" ? Gender::MALE : Gender::FEMALE;
	}
}