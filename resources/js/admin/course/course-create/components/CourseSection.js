import React from "react";
import { Row, Col } from "react-bootstrap";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";

import CourseType from "@constants/CourseType";

import * as util from "@common/util";

const CourseSection = ({ idx, section, courseType, onShowUpdateCourseSectionModal, onDeleteCourseSection }) => {
	let isRegularClass = courseType === CourseType.REGULAR;

	let days = isRegularClass ? section.duration_day.join(", ") : "요일 협의";
	let target = util.generateTargetString(section.target_group, section.target_grade);
	let time = isRegularClass
		? `${section.start_hour} : ${section.start_minute} ~ ${section.end_hour} : ${section.end_minute}`
		: "시간 협의";
	let date = `${util.convertDateTimeStr(section.start_at)} ~ ${util.convertDateTimeStr(section.end_at)}`;

	return (
		<Row className="mt-2 align-self-center justify-content-center" align="center">
			<Col md={2} className="align-self-center">
				<Button
					secondary
					onClick={() => {
						onShowUpdateCourseSectionModal(idx);
					}}
				>
					수정
				</Button>
				<Button
					secondary
					onClick={() => {
						onDeleteCourseSection(idx);
					}}
				>
					삭제
				</Button>
			</Col>
			<Col md={2} className="align-self-center">
				<Text p2 className="d-flex">
					{section.id ? `${idx + 1}차 (ID: ${section.id})` : `${idx + 1}차`}
				</Text>
			</Col>
			<Col md={8} className="align-self-center justify-content-start">
				<Text p2>{`${target} / ${days} / ${time} / (${date}) / 총 ${section.cycle_week} 회`}</Text>
			</Col>
		</Row>
	);
};

export default CourseSection;
