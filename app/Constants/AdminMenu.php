<?php

namespace App\Constants;

abstract class AdminMenu
{
	const DASHBOARD = ["id" => 1, "name" => "대시보드"];
	const ENROLLMENTS = ["id" => 2, "name" => "수강 관리"];
	const ADMIN_USERS = ["id" => 3, "name" => "관리자 회원 관리"];
	const PARENT_USERS = ["id" => 4, "name" => "학생/학부모 관리"];
	const COURSES = ["id" => 5, "name" => "과목 관리"];
	const PAYMENTS = ["id" => 6, "name" => "결제 관리"];
	const COUPONS = ["id" => 7, "name" => "쿠폰 관리"];
	const MESSAGES = ["id" => 8, "name" => "SMS 관리"];
	const SUPPORTS = ["id" => 9, "name" => "고객 센터 관리"];
	const ORGANIZATIONS = ["id" => 10, "name" => "B2B 관리"];
	const ORGANIZATION_USERS = ["id" => 11, "name" => "B2B 회원 관리"];
	const ORGANIZATION_ENROLLMENTS = ["id" => 12, "name" => "B2B 수강 관리"];
	const MAINPAGE_CAROUSELS = ["id" => 13, "name" => "메인페이지 관리"];
	const MAINPAGE_CATEGORY = ["id" => 14, "name" => "메인페이지 카테고리"];
	const CURRICULUM_CATEGORY = ["id" => 15, "name" => "커리큘럼 카테고리"];
	const MENU_PERMISSIONS = ["id" => 16, "name" => "메뉴 권한 관리"];
	const INSTRUCTORS = ["id" => 17, "name" => "강사 관리"];
	const VOD_COURSE_POSTS = ["id" => 18, "name" => "VOD 과목 게시판 관리"];
	const SUPPORT_CLASSES = ["id" => 19, "name" => "보충수업 관리"];
	const SMS_NOTIFICATIONS = ["id" => 20, "name" => "SMS 노티관리"];
	const ATTENDANCE = ["id" => 21, "name" => "출결관리"];
	const VOD_PROGRESS_RATE = ["id" => 22, "name" => "VOD 클래스 진도율 확인"];

	public static function all()
	{
		return [
			self::DASHBOARD,
			self::ENROLLMENTS,
			self::ADMIN_USERS,
			self::PARENT_USERS,
			self::COURSES,
			self::PAYMENTS,
			self::COUPONS,
			self::MESSAGES,
			self::SUPPORTS,
			self::ORGANIZATIONS,
			self::ORGANIZATION_USERS,
			self::ORGANIZATION_ENROLLMENTS,
			self::MAINPAGE_CAROUSELS,
			self::MAINPAGE_CATEGORY,
			self::CURRICULUM_CATEGORY,
			self::MENU_PERMISSIONS,
			self::INSTRUCTORS,
			self::VOD_COURSE_POSTS,
			self::SUPPORT_CLASSES,
			self::SMS_NOTIFICATIONS,
			self::ATTENDANCE,
			self::VOD_PROGRESS_RATE,
		];
	}
}
