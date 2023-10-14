const SmsNotificationType = {
	COURSE_THREE_DAY_BEFORE: "course_three_day_before", // 라이브 클래스, 1:1 패키지, 1:1 클래스 시작 3일전 (1회성), 과목 section에 신청된 학생
	COURSE_ONE_DAY_BEFORE: "course_one_day_before", // 라이브 클래스, 1:1 패키지, 1:1 클래스 시작 1일전 (1회성)
	REGULAR_LESSON_BEFORE: "regular_lesson_before", // 라이브 클래스 수업 시작 전 : 라이브 클래스 수업 당일 (요일에 맞춘 발송)
	VOD_END_ONE_MONTH_BEFORE: "vod_end_one_month_before", // VOD 종료 1달전 : 1회성, VOD 클래스 수강생
	VOD_END_ONE_WEEK_BEFORE: "vod_end_one_week_before", // VOD 종료 1주일전 : 1회성
	VOD_ENCOURAGE: "vod_encourage", // VOD 독려문자 : 1회성

	convertToString(value) {
		switch (value) {
			case this.COURSE_THREE_DAY_BEFORE:
				return "수업시작 D-Day3";
			case this.COURSE_ONE_DAY_BEFORE:
				return "수업시작 D-Day1";
			case this.REGULAR_LESSON_BEFORE:
				return "매 수업 시작전 알림";
			case this.VOD_END_ONE_MONTH_BEFORE:
				return "VOD클래스 종료 1달전";
			case this.VOD_END_ONE_WEEK_BEFORE:
				return "VOD클래스 종료 1주일전";
			case this.VOD_ENCOURAGE:
				return "VOD클래스 독려문자";
		}
		return "";
	}
};

export default SmsNotificationType;
