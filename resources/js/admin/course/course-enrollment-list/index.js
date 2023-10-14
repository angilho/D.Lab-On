import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminCourseEnrollmentList = ({ course_id }) => {
	const history = useHistory();
	const [course, setCourse] = useState({});
	const [enrollments, setEnrollments] = useState([]);

	useEffect(() => {
		if (course.sections && course.sections.length > 0) {
			let courseSectionsId = course.sections.map(_ => _.id);
			let query = {
				"filter[course_section_id]": courseSectionsId
			};
			ctrl.getEnrollments(query, setEnrollments);
		}
	}, [course]);

	useEffect(() => {
		ctrl.getCourse(course_id, setCourse);
	}, []);

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col>
					<Text h5>과목 정보</Text>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>시작일</th>
								<th>종료일</th>
								<th>시간</th>
								<th>할인가격</th>
								<th>엘리스 과목 ID</th>
								<th>수강 관리</th>
							</tr>
						</thead>
						<tbody>
							{course.sections &&
								course.sections.map((courseSection, _) => {
									return (
										<tr key={_}>
											<td>
												<Link to={`/admin/courses/${course.id}/edit`}>
													<span className="text-primary" role="button">
														{course.name}
													</span>
												</Link>
											</td>
											<td>{util.addNumberComma(course.price - course.discount_price)}원</td>
											<td>{util.addNumberComma(course.price)}원</td>
											<td>{util.addNumberComma(course.discount_price)}원</td>
											<td>{course.elice_course_id}</td>
											<td>
												<Button
													secondary
													onClick={() => onClickEnrollmentManagementBtn(course.id)}
												>
													수강 관리
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
				</Col>
			</Row>
		</React.Fragment>
	);
};

export default AdminCourseEnrollmentList;
