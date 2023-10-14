import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import AdminTablePagination from "@components/adminTablePagination";
import * as api from "@common/api";
import * as ctrl from "../../index.ctrl";
import CourseSection from "../../components/CourseSection";

const CourseEnrollmentsModal = ({ show, courseId, courseName, onHide }) => {
	const [courseEnrollments, setCourseEnrollments] = useState({});

	useEffect(() => {
		if (show) {
			ctrl.getCourseEnrollments(courseId, callbackGetCourseEnrollments);
		} else {
			setCourseEnrollments({});
		}
	}, [show]);

	const callbackGetCourseEnrollments = courseEnrollments => {
		setCourseEnrollments(courseEnrollments);
	};

	const onClickPageItem = url => {
		if (url) {
			api.getPaginationLink(url)
				.then(response => {
					if (response.data) setCourseEnrollments(response.data);
				})
				.catch(err => console.error(err));
		}
	};

	return (
		<Modal show={show} onHide={onHide} size="xl">
			<Modal.Header closeButton>
				<Modal.Title>과목명: {courseName}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row className="mt-3">
					<Col>
						<StudentInfoTable bordered>
							<StyledThead>
								<tr>
									<th>번호</th>
									<th>회차정보</th>
									<th>수강생ID</th>
									<th>수강생명</th>
								</tr>
							</StyledThead>
							<tbody>
								{courseEnrollments.data &&
									courseEnrollments.data.map((enrollment, idx) => {
										return (
											<tr key={idx}>
												<td>{idx + 1}</td>
												<td className="text-left">
													<CourseSection
														section={enrollment.course_section}
														courseType={enrollment.course.type}
													/>
												</td>
												<td>{enrollment.user.user_login}</td>
												<td>{enrollment.user.name}</td>
											</tr>
										);
									})}
							</tbody>
						</StudentInfoTable>
						<div className="mt-20">
							<AdminTablePagination
								links={courseEnrollments.links}
								firstPageUrl={courseEnrollments.first_page_url}
								lastPageUrl={courseEnrollments.last_page_url}
								onChange={onClickPageItem}
							/>
						</div>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};

const StudentInfoTable = styled(Table)`
	font-size: 13px;
	text-align: center;
`;

const StyledThead = styled.thead`
	background-color: rgba(0, 0, 0, 0.05);
`;

export default CourseEnrollmentsModal;
