import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import AttendanceStudentHistoryModal from "./modal/attendance-student-history";
import * as ctrl from "./index.ctrl";

const AttendanceStudentList = ({ attendanceCourseId, attendanceSectionId }) => {
	const [isdAttendanceCompleted, setIsdAttendanceCompleted] = useState(false);
	const [enrollmentStudents, setEnrollmentStudents] = useState(null);
	const [attendanceStudents, setAttendanceStudents] = useState(null);
	const [attendanceCourse, setAttendanceCourse] = useState(null);
	const [studentAttendancesModalInfo, setStudentAttendancesModalInfo] = useState({ show: false });

	useEffect(() => {
		getAttendanceStudentsData();
	}, []);

	const getAttendanceStudentsData = () => {
		ctrl.getAttendanceStudents(attendanceCourseId, attendanceSectionId, setAttendanceStudentsData);
	};

	const setAttendanceStudentsData = (attendanceData, enrollmentData) => {
		setEnrollmentStudents(enrollmentData);
		setAttendanceCourse(attendanceData.attendance_course);
		setAttendanceStudents(attendanceData.attendance_students);
		setIsdAttendanceCompleted(attendanceData.attendance_checked);
	};

	const onChangeCheckboxStatus = (value, idx) => {
		let attdStudents = enrollmentStudents.map(e => e);
		attdStudents[idx].checked = value;
		setEnrollmentStudents(attdStudents);
	};

	const onClickShowAttendanceStudentHistory = studentId => {
		setStudentAttendancesModalInfo({
			show: true,
			studentId,
			attendanceCourseId,
			courseName: attendanceCourse.course.name
		});
	};

	const checkAttendanceStatus = userId => {
		const checkAttendanceStudent = attendanceStudents.find(student => student.user_id == userId);
		if (checkAttendanceStudent == undefined) {
			return "-";
		}
		return checkAttendanceStudent.attendance ? "출석" : "결석";
	};

	const onClickAttendanceStudents = () => {
		if (!enrollmentStudents.some(e => e.checked)) {
			return alert("선택하신 항목이 없습니다.");
		}
		if (confirm("출석 완료하시겠습니까?")) {
			let students = enrollmentStudents.map(e => {
				return {
					user_id: e.user_id,
					attendance: e.checked ? true : false
				};
			});

			ctrl.updateAttendanceStudents(attendanceCourseId, attendanceSectionId, students, res => {
				let updatedEnrollmentStudents = enrollmentStudents.map(e => {
					return {
						...e,
						attendance: e.checked ? "출석" : "결석",
						checked: false
					};
				});
				setEnrollmentStudents(updatedEnrollmentStudents);
				setIsdAttendanceCompleted(true);
			});
		}
	};

	const onSaveAttendanceStudentHistory = () => {
		getAttendanceStudentsData();
		setStudentAttendancesModalInfo({ show: false });
	};

	const attendanceCourseSection = sections => {
		if (sections.length == 0) return;
		const sectionId = attendanceCourse.section_id;
		const section = sections.find(s => s.id == sectionId);
		let days = section.duration_day.join(", ");
		let time = `${section.duration_time_str}`;
		const result = `${attendanceCourse.course.name}(${days}요일 ${time})`;
		return result;
	};

	return (
		<React.Fragment>
			<Row className="mt-2 text-right">
				<Col>
					{!isdAttendanceCompleted && (
						<Button type="button" size="large" primary onClick={onClickAttendanceStudents}>
							출석완료
						</Button>
					)}
				</Col>
			</Row>
			<Row className="mt-3">
				<Col>
					<AttendanceStudentTable striped bordered hover>
						<thead>
							<tr>
								<th>체크</th>
								<th>아이디</th>
								<th>학생이름</th>
								<th>과목명</th>
								<th>출결확인</th>
								<th>출결기록</th>
							</tr>
						</thead>
						<tbody>
							{attendanceStudents &&
								attendanceCourse &&
								enrollmentStudents &&
								enrollmentStudents.map((student, idx) => {
									return (
										<tr key={idx}>
											<td>
												<Checkbox
													className="justify-content-center"
													checked={student.checked || false}
													onChange={value => {
														onChangeCheckboxStatus(value, idx);
													}}
												></Checkbox>
											</td>
											<td>{student.user.user_login}</td>
											<td>{student.user.name}</td>
											<td>{attendanceCourseSection(attendanceCourse.course.sections)}</td>
											<td>
												{student.attendance
													? student.attendance
													: checkAttendanceStatus(student.user_id)}
											</td>
											<td>
												<Button
													primary
													onClick={() => {
														onClickShowAttendanceStudentHistory(student.user_id);
													}}
												>
													보기
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</AttendanceStudentTable>
				</Col>
			</Row>
			<AttendanceStudentHistoryModal
				onHide={() => {
					setStudentAttendancesModalInfo({ ...studentAttendancesModalInfo, show: false });
				}}
				studentAttendancesModalInfo={studentAttendancesModalInfo}
				handleSave={onSaveAttendanceStudentHistory}
			/>
		</React.Fragment>
	);
};

const AttendanceStudentTable = styled(Table)`
	text-align: center;
	& tbody tr td:nth-child(4) {
		text-align: left;
	}
`;

export default AttendanceStudentList;
