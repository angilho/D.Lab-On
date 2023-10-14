<?php

namespace App\Constants;

abstract class CoursePostType
{
	// 질문
	const QUESTION = "question";
	// 과제
	const ASSIGNMENT = "assignment";
	// 공지
	const NOTICE = "notice";

	public static function all()
	{
		return [self::QUESTION, self::ASSIGNMENT, self::NOTICE];
	}
}