import React, { useState, useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import { useHistory } from "react-router-dom";
import LiveClassCourseSection from "../components/LiveClassCourseSection";

import * as ctrl from "./index.ctrl";

const AttendancCourseSectionList = ({ attendanceCourseId }) => {
	const history = useHistory();
	const [attendanceSections, setAttendanceSections] = useState([]);

	useEffect(() => {
		ctrl.getAttendanceSections(attendanceCourseId, data => {
			setAttendanceSections(data);
		});
	}, []);

	const onChangeCheckboxStatus = (value, idx) => {
		let changedCheckbox = attendanceSections.attendance_section.map((e, sectionIdx) => {
			if (sectionIdx === idx) {
				e.checked = value;
			}
			return e;
		});
		setAttendanceSections({
			...attendanceSections,
			attendance_section: changedCheckbox
		});
	};

	const onClickDeleteAttendanceSections = () => {
		if (!attendanceSections.attendance_section.some(e => e.checked)) {
			return alert("선택하신 항목이 없습니다.");
		}
		if (attendanceSections.attendance_section.some(e => e.checked && e.attendance_checked == 1)) {
			return alert("이미 출결이 진행된 건은 삭제 할 수 없습니다.");
		}
		if (confirm("선택한 차시 수업을 삭제하시겠습니까?")) {
			let attendanceSectionIds = attendanceSections.attendance_section.filter(e => e.checked).map(e => e.id);
			ctrl.deleteAttendanceSections(attendanceCourseId, attendanceSectionIds, res => {
				let remainAttendanceSections = attendanceSections.attendance_section.filter(e => !e.checked);
				setAttendanceSections({
					...attendanceSections,
					attendance_section: remainAttendanceSections
				});
			});
		}
	};

	const attendanceCourseSection = (sections, sectionId) => {
		if (sections.length == 0) {
			return "";
		}
		const section = sections.find(s => s.id == sectionId);
		return <LiveClassCourseSection section={section} />;
	};

	return (
		<React.Fragment>
			<Row>
				<Col className="text-right mb-2">
					<Button primary type="button" onClick={onClickDeleteAttendanceSections}>
						선택삭제
					</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<AttendanceCourseSectionTable striped bordered hover>
						<thead>
							<tr>
								<th>선택</th>
								<th>출결 진행여부</th>
								<th>수업차시</th>
								<th>과목명</th>
								<th>출석체크</th>
							</tr>
						</thead>
						<tbody>
							{attendanceSections.attendance_section &&
								attendanceSections.attendance_section.map((attendanceSection, idx) => {
									return (
										<tr key={idx}>
											<td>
												<Checkbox
													checked={attendanceSection.checked || false}
													onChange={value => {
														onChangeCheckboxStatus(value, idx);
													}}
													label=""
												/>
											</td>
											<td>{attendanceSection.attendance_checked ? "Y" : "N"}</td>
											<td>{attendanceSection.index}차</td>
											<td>
												{`${attendanceSections.course.name}(`}
												{attendanceCourseSection(
													attendanceSections.course.sections,
													attendanceSections.section_id
												)}
												{`)`}
											</td>
											<td>
												<AttendanceCourseSectionTableButton
													primary
													type="button"
													onClick={() => {
														history.push({
															pathname: `/admin/attendances/${attendanceSection.attendance_course_id}/sections/${attendanceSection.id}`
														});
													}}
												>
													출석체크
												</AttendanceCourseSectionTableButton>
											</td>
										</tr>
									);
								})}
						</tbody>
					</AttendanceCourseSectionTable>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const AttendanceCourseSectionTable = styled(Table)`
	text-align: center;
	font-size: 13px;
	& tbody tr td:nth-child(4) {
		text-align: left;
	}
`;

const AttendanceCourseSectionTableButton = styled(Button)`
	font-size: 13px;
`;

export default AttendancCourseSectionList;
