<?php

namespace App\Constants;

/**
 * 사용자 권한을 나타내는 값
 * 관리자: 0, 일반 회원: 1, 자녀: 2, 강사: 3
 */
abstract class Role
{
	const ADMIN = 0;
	const MEMBER = 1;
	const CHILD = 2;
	const INSTRUCTOR = 3;

	public static function convertRoleToString($role)
	{
		switch ($role) {
			case Role::ADMIN:
				return "관리자";
			case Role::MEMBER:
				return "회원";
			case Role::CHILD:
				return "자녀";
			case Role::INSTRUCTOR:
				return "강사";
		}
	}
}
