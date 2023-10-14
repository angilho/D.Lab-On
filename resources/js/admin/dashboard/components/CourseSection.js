import React from "react";
import CourseType from "@constants/CourseType";

import * as util from "@common/util";

const CourseSection = ({ section, courseType }) => {
	function courseSectionText() {
		// VOD 과목의 경우 회차정보가 특별히 없기 때문에 과목 유형값을 반환한다.
		if (courseType == CourseType.VOD) {
			return CourseType.convertToString(CourseType.VOD);
		}

		let isRegularClass = courseType === CourseType.REGULAR;
		let days = isRegularClass ? section.duration_day.join(", ") : "요일 협의";
		let target = util.generateTargetString(section.target_group, section.target_grade);
		let time = isRegularClass
			? `${section.start_hour} : ${section.start_minute} ~ ${section.end_hour} : ${section.end_minute}`
			: "시간 협의";
		let date = `${util.convertDateTimeStr(section.start_at)} ~ ${util.convertDateTimeStr(section.end_at)}`;
		const result = `ID: ${section.id} / ${target} / ${days} / ${time} / (${date}) / 총 ${section.cycle_week} 회`;

		return result;
	}

	return <React.Fragment>{courseSectionText()}</React.Fragment>;
};

export default CourseSection;
