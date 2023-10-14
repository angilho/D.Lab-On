import React, { useState, useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AdminSearch from "@components/adminSearch";
import Button from "@components/elements/Button";
import AdminTablePagination from "@components/adminTablePagination";
import LiveClassCourseSection from "../components/LiveClassCourseSection";
import * as api from "@common/api";
import * as ctrl from "./index.ctrl";

const AttendanceCourseList = () => {
	const history = useHistory();
	const [attendanceCourses, setAttendanceCourses] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getAttendanceCourses("", setAttendanceCourseList);
	}, []);

	const setAttendanceCourseList = data => {
		setAttendanceCourses(data);
	};

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			api.getPaginationLink(url)
				.then(response => {
					if (response.data) {
						setAttendanceCourses(response.data);
					}
				})
				.catch(err => console.error(err));
		}
	};

	const onClickSearch = keyword => {
		setFilterKeyword(keyword);
		const query = {
			"filter[search]": keyword
		};
		ctrl.getAttendanceCourses(query, setAttendanceCourseList);
	};

	const onClickExport = attendanceCourseId => {
		ctrl.handleExport(attendanceCourseId);
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
			<Row className="mt-40 justify-content-between">
				<Col md={8}>
					<AdminSearch placeholder="과목ID, 과목명" onClick={onClickSearch} />
				</Col>
				<Col md={3} className="text-right">
					{userInfo.is_admin && (
						<Button
							primary
							className="w-50"
							type="button"
							size="large"
							onClick={() => {
								history.push({ pathname: "/admin/attendances/create" });
							}}
						>
							등록
						</Button>
					)}
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<AttendanceTable striped bordered hover>
						<thead>
							<tr>
								<th>번호</th>
								<th>과목코드</th>
								<th width="20%">과목명</th>
								<th>차시</th>
								<th>담당강사</th>
								<th style={{ minWidth: "90px" }}>출결관리</th>
								<th style={{ minWidth: "90px" }}>출결히스토리</th>
							</tr>
						</thead>
						<tbody>
							{attendanceCourses.data && attendanceCourses.data.length === 0 && (
								<tr>
									<td colSpan={7} style={{ textAlign: "center" }}>
										출결관리할 과목이 없습니다.
									</td>
								</tr>
							)}
							{attendanceCourses.data &&
								attendanceCourses.data.map((attendanceCourse, idx) => {
									return (
										<tr key={idx}>
											<td>{idx + 1}</td>
											<td>{attendanceCourse.course.dlab_course_code}</td>
											<td>{attendanceCourse.course.name}</td>
											<td>
												{attendanceCourseSection(
													attendanceCourse.course.sections,
													attendanceCourse.section_id
												)}
											</td>
											<td>{attendanceCourse.instructor.name}</td>
											<td>
												<AttendanceTableButton
													secondary
													onClick={() => {
														history.push({
															pathname: `/admin/attendances/${attendanceCourse.id}`
														});
													}}
												>
													출결관리
												</AttendanceTableButton>
											</td>
											<td>
												<AttendanceTableButton
													secondary
													onClick={() => onClickExport(attendanceCourse.id)}
												>
													다운로드
												</AttendanceTableButton>
											</td>
										</tr>
									);
								})}
						</tbody>
					</AttendanceTable>
					<div className="mt-20">
						<AdminTablePagination
							links={attendanceCourses.links}
							firstPageUrl={attendanceCourses.first_page_url}
							lastPageUrl={attendanceCourses.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const AttendanceTable = styled(Table)`
	font-size: 13px;
`;

const AttendanceTableButton = styled(Button)`
	font-size: 13px;
`;

export default AttendanceCourseList;
