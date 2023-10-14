<?php

namespace App\Constants;

abstract class CourseType
{
	//라이브 클래스
	const REGULAR = "regular";
	//1:1 클래스
	const ONEONONE = "oneonone";
	//1:1 패키지
	const PACKAGE = "package";
	//VOD 클래스
	const VOD = "vod";

	public static function all()
	{
		return [self::REGULAR, self::ONEONONE, self::PACKAGE, self::VOD];
	}
}