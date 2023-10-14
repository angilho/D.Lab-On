import React, { useState, useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";
import styled from "styled-components";

import * as ctrl from "../../index.ctrl";

const AttendanceStudentHistoryModal = ({ onHide, studentAttendancesModalInfo, handleSave }) => {
	const [studentAttendances, setStudentAttendances] = useState([]);

	useEffect(() => {
		if (studentAttendancesModalInfo.show == false) {
			setStudentAttendances([]);
			return;
		}
		ctrl.getAttendanceStudentHistory(
			studentAttendancesModalInfo.attendanceCourseId,
			studentAttendancesModalInfo.studentId,
			data => {
				setStudentAttendances(data);
			}
		);
	}, [studentAttendancesModalInfo]);

	const convertAttendanceDate = attendance_at => {
		const attendanceDate = new Date(attendance_at);
		const attendanceMonth = attendanceDate.getMonth() + 1;
		const attendanceDays = attendanceDate.getDate();
		return `${attendanceMonth}/${attendanceDays}`;
	};

	const onChangeAttendanceStatus = (value, idx) => {
		let changedAttendances = studentAttendances.map((a, attendanceIdx) => {
			if (attendanceIdx == idx) {
				a.attendance = value;
			}
			return a;
		});
		setStudentAttendances(changedAttendances);
	};

	const onClickSaveStudentAttendances = () => {
		if (studentAttendances.length === 0) {
			return alert("갱신할 출석 정보가 없습니댜.");
		}
		ctrl.updateAttendanceStudent(
			studentAttendances,
			studentAttendancesModalInfo.attendanceCourseId,
			studentAttendancesModalInfo.studentId,
			res => {
				handleSave();
			}
		);
	};

	return (
		<Modal show={studentAttendancesModalInfo.show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>출석 히스토리</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row className="justify-content-end">
					<Col md={3}>
						<Button primary size="small" className="w-100" onClick={onClickSaveStudentAttendances}>
							저장
						</Button>
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<HistoryTable striped bordered hover>
							<thead>
								<tr>
									<th>수업차시</th>
									<th>날짜</th>
									<th>과목</th>
									<th>상태</th>
								</tr>
							</thead>
							<tbody>
								{studentAttendances &&
									studentAttendances.map((history, idx) => {
										return (
											<tr key={idx}>
												<td>{`${history.attendance_section.index}차시`}</td>
												<td>{`${convertAttendanceDate(
													history.attendance_section.attendance_at
												)}`}</td>
												<td>{`${studentAttendancesModalInfo.courseName}`}</td>
												<td>
													<FormControl
														as="select"
														value={history.attendance}
														smallSize
														onChange={e => {
															onChangeAttendanceStatus(e.target.value, idx);
														}}
														className="d-inline-block"
													>
														<option value={true}>출석</option>
														<option value={false}>결석</option>
													</FormControl>
												</td>
											</tr>
										);
									})}
							</tbody>
						</HistoryTable>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};

const HistoryTable = styled(Table)`
	& tbody tr td:nth-child(4) div {
		display: inline-block;
	}
	text-align: center;
`;

export default AttendanceStudentHistoryModal;
