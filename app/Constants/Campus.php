<?php

namespace App\Constants;

abstract class Campus
{
	const NONE = 0;
	const PANGYO = 1;
	const DAECHI = 2;
	const DAEGU_SUSEONG = 3;
	const MOKDONG = 4;
	const DONGTAN = 5;
	const ULSAN = 6;
	const JAMSIL = 7;
	const JUNGJA = 8;
	const PYEONGCHON = 9;
	const SONGDO = 10;
	const CHEONGJU = 12;
	const DLABON = 11;

	public static function all()
	{
		return [
			self::NONE,
			self::PANGYO,
			self::DAECHI,
			self::DAEGU_SUSEONG,
			self::MOKDONG,
			self::DONGTAN,
			self::ULSAN,
			self::JAMSIL,
			self::JUNGJA,
			self::PYEONGCHON,
			self::SONGDO,
			self::CHEONGJU,
			self::DLABON,
		];
	}

	public static function convertCampusToString($campus)
	{
		switch ($campus) {
			case Campus::NONE:
				return "없음";
			case Campus::PANGYO:
				return "판교캠퍼스";
			case Campus::DAECHI:
				return "대치캠퍼스";
			case Campus::DAEGU_SUSEONG:
				return "대구수성캠퍼스";
			case Campus::MOKDONG:
				return "목동캠퍼스";
			case Campus::DONGTAN:
				return "동탄캠퍼스";
			case Campus::ULSAN:
				return "울산캠퍼스";
			case Campus::JAMSIL:
				return "잠실캠퍼스";
			case Campus::JUNGJA:
				return "정자캠퍼스";
			case Campus::PYEONGCHON:
				return "평촌캠퍼스";
			case Campus::SONGDO:
				return "송도캠퍼스";
			case Campus::CHEONGJU:
				return "청주캠퍼스";
			case Campus::DLABON:
				return "디랩온";
		}

		return "없음";
	}
}
