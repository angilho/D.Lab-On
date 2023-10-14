import * as api from "@common/api";
import CouponCategory from "@constants/CouponCategory";
import CouponType from "@constants/CouponType";
import CourseType from "@constants/CourseType";

export const getDefaultCoupon = () => ({
	category: CouponCategory.ONE_TIME,
	name: "",
	type: CouponType.VALUE_DISCOUNT,
	value: null,
	code: "", // 쿠폰 코드 (다회성 쿠폰)
	course_type_list: [CourseType.REGULAR, CourseType.ONEONONE, CourseType.PACKAGE, CourseType.VOD],
	end_at: "",
	end_at_date: null, // 쿠폰 만료일 (다회성 쿠폰)
	count: null // 자동 생성 개수 (일회성 쿠폰)
});

export const handleCreate = (coupon, callback) => {
	if (!validateCoupon(coupon)) return;

	api.createCoupon({
		...coupon,
		course_type: coupon.course_type_list.join(",")
	}).then(response => {
		if (response.status !== 201) {
			alert("쿠폰 추가에 실패하였습니다.");
			return;
		}

		alert("쿠폰을 추가하였습니다.");
		callback();
	});
};

export const validateCoupon = coupon => {
	if (!coupon.name) {
		alert("쿠폰 제목이 없습니다.");
		return false;
	}
	if (!coupon.value) {
		alert("쿠폰 할인 금액이 잘못되었습니다.");
		return false;
	}
	if (coupon.course_type_list.length === 0) {
		alert("쿠폰 사용 강좌 타입이 없습니다.");
		return;
	}
	if (coupon.category === CouponCategory.ONE_TIME) {
		// 일회성 쿠폰 data validation
		if (!coupon.count) {
			alert("발급 매수가 잘못되었습니다.");
			return false;
		}
	} else {
		// 다회성 쿠폰 data validation
		if (!coupon.code) {
			alert("쿠폰 코드가 잘못되었습니다.");
			return false;
		}
		if (!coupon.end_at) {
			alert("쿠폰 유효기간이 잘못되었습니다.");
			return false;
		}
	}

	return true;
};
