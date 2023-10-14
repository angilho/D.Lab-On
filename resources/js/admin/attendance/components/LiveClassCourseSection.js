import React from "react";

const LiveClassCourseSection = ({ section }) => {
	function courseSectionText() {
		let days = section.duration_day.join(", ");
		let time = `${section.duration_time_str}`;
		const result = `${days}요일 ${time}`;

		return result;
	}

	return <React.Fragment>{courseSectionText()}</React.Fragment>;
};

export default LiveClassCourseSection;
