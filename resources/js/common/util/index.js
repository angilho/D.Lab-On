export const convertDateTimeStr = date => {
	return new Date(date)
		.toISOString()
		.slice(0, 10)
		.replaceAll("-", "/");
};

export const getYearList = (maxAge = 30) => {
	let currentYear = new Date().getFullYear();
	return Array.from({ length: maxAge }, (_, idx) => currentYear - idx);
};

export const getMonthList = () => {
	return Array.from({ length: 12 }, (_, idx) => idx + 1);
};

export const getDayList = () => {
	return Array.from({ length: 31 }, (_, idx) => idx + 1);
};
/**
 *  yyyy-MM-dd 포맷으로 반환
 */
export const getFormatDate = (date, delimiter = ".") => {
	if (typeof date === "string") date = new Date(date);
	var year = date.getFullYear(); //yyyy
	var month = 1 + date.getMonth(); //M
	month = month >= 10 ? month : "0" + month; //month 두자리로 저장
	var day = date.getDate(); //d
	day = day >= 10 ? day : "0" + day; //day 두자리로 저장
	return year + delimiter + month + delimiter + day; //'-' 추가하여 yyyy.mm.dd 형태 생성 가능
};

/**
 *  mm월 - dd일 포맷으로 반환
 */
export const getKoreanFormatDate = date => {
	if (typeof date === "string") date = new Date(date);
	var month = 1 + date.getMonth(); //M
	var day = date.getDate(); //d
	return `${month}월 ${day}일`;
};

export const convertDayOfWeekStr = dayOfWeek => {
	let dayOfWeekStr = ["일", "월", "화", "수", "목", "금", "토"];
	return dayOfWeekStr[dayOfWeek];
};

export const addNumberComma = number => {
	let regexp = /\B(?=(\d{3})+(?!\d))/g;
	return number.toString().replace(regexp, ",");
};

export const pad = n => {
	return n < 10 ? "0" + n : n;
};

export const getCsrfToken = () => {
	const metas = document.getElementsByTagName("meta");
	for (let i = 0; i < metas.length; i++) {
		if (metas[i].getAttribute("name") === "csrf-token") {
			return metas[i].getAttribute("content");
		}
	}

	return "";
};

export const validateEmail = email => {
	if (email) {
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email.toLowerCase());
	}
};

export const validatePhoneNumber = phone => {
	var patternPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
	return patternPhone.test(phone);
};

export const toKoreanPhoneNumber = orgPhone => {
	var number = orgPhone.replace(/[^0-9]/g, "");
	var phone = "";
	if (number.length < 4) {
		return number;
	} else if (number.length < 7) {
		phone += number.substr(0, 3);
		phone += "-";
		phone += number.substr(3);
	} else if (number.length < 11) {
		phone += number.substr(0, 3);
		phone += "-";
		phone += number.substr(3, 3);
		phone += "-";
		phone += number.substr(6);
	} else {
		phone += number.substr(0, 3);
		phone += "-";
		phone += number.substr(3, 4);
		phone += "-";
		phone += number.substr(7);
	}

	return phone;
};

import CourseType from "@constants/CourseType";
export const getCourseTime = (course, courseSection) => {
	let isRegularCourse = course.type === CourseType.REGULAR;
	return !isRegularCourse
		? "협의"
		: `${courseSection.duration_day_str} ${courseSection.duration_time_str} (주 ${courseSection.cycle_week} 회 / 총 ${course.duration_week}회)`;
};

import PaymentStatus from "@constants/PaymentStatus";
export const getPaymentStatusStr = status => {
	switch (status) {
		case PaymentStatus.SUCCESS:
			return "결제완료";
		case PaymentStatus.REQUEST:
			return "결제요청";
		case PaymentStatus.CANCEL:
			return "결제취소";
		case PaymentStatus.FAIL:
			return "결제실패";
		case PaymentStatus.READY:
			return "결제대기";
		default:
			return "결제요청";
	}
};

export const generateTargetString = (targetGroup, targetGrade) => {
	let result = "";

	switch (targetGroup) {
		case 0:
			result = `초등부 ${targetGrade}학년`;
			break;
		case 1:
			result = `중등부 ${targetGrade}학년`;
			break;
		case 2:
			result = `고등부 ${targetGrade}학년`;
			break;
		case 4:
			result = "중고등부";
			break;
		default:
			result = "일반";
			break;
	}

	return result;
};

/*
 * 쿠폰 타입에 따라 할인금액을 반환
 */
import CouponType from "@constants/CouponType";
export const getCouponValueStr = coupon => {
	switch (coupon.type) {
		case CouponType.PERCENT_DISCOUNT:
			return `${coupon.value}%`;
		case CouponType.VALUE_DISCOUNT:
			return `${addNumberComma(coupon.value)}원`;
	}
	return coupon.value;
};
