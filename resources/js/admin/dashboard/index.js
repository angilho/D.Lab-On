import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import Text from "@components/elements/Text";
import * as ctrl from "./index.ctrl";
import CourseEnrollmentsModal from "./modal/course-enrollments-modal";

const Dashboard = props => {
	const history = useHistory();
	const [courses, setCourses] = useState([]);
	const [todayEnrollmentCount, setTodayEnrollmentCount] = useState(0);
	const [memberCount, setMemberCount] = useState(0);
	const [courseCount, setCourseCount] = useState(0);
	const [adminCount, setAdminCount] = useState(0);
	const [courseEnrollmentsModalInfo, setCourseEnrollmentsModalInfo] = useState({
		show: false,
		courseId: null,
		courseName: ""
	});

	useEffect(() => {
		ctrl.getDashboard(callbackGetDashboard);
		ctrl.getCoursesEnrollments(callbackGetCoursesEnrollments);
	}, []);

	const callbackGetCoursesEnrollments = coursesEnrollments => {
		setCourses(coursesEnrollments);
	};

	const callbackGetDashboard = data => {
		if (data.todayEnrollmentCount) setTodayEnrollmentCount(data.todayEnrollmentCount);
		if (data.memberCount) setMemberCount(data.memberCount);
		if (data.courseCount) setCourseCount(data.courseCount);
		if (data.adminCount) setAdminCount(data.adminCount);
	};

	const renderDashboardCard = (title, value, description, goTo) => {
		return (
			<DashboardContainer onClick={() => history.push({ pathname: goTo })}>
				<div className="p-2">
					<Text h5 primary>
						{title || ""}
					</Text>
					<Text p2>{value || ""}</Text>
					<Text p5 className="mt-20">
						{description || ""}
					</Text>
				</div>
			</DashboardContainer>
		);
	};

	const onClickCloseBtn = () => {
		setCourseEnrollmentsModalInfo({ show: false });
	};

	const openCourseEnrollmentsModal = (courseName, courseId) => {
		setCourseEnrollmentsModalInfo({
			show: true,
			courseId: courseId,
			courseName: courseName
		});
	};

	return (
		<Row className="mt-40">
			<CourseEnrollmentsModal
				show={courseEnrollmentsModalInfo.show}
				courseId={courseEnrollmentsModalInfo.courseId}
				courseName={courseEnrollmentsModalInfo.courseName}
				onHide={onClickCloseBtn}
			/>
			<Col>
				<Row>
					<Col>
						{renderDashboardCard(
							"신규 수강 신청",
							`${todayEnrollmentCount}건`,
							"일일 신규 신청 건수를 보여주며 매일 24시 갱신됩니다",
							"/admin/enrollments"
						)}
					</Col>
					<Col>{renderDashboardCard("회원", `${memberCount}명`, "", "/admin/users")}</Col>
					<Col>{renderDashboardCard("과목", `${courseCount}개`, "", "/admin/courses")}</Col>
					<Col>{renderDashboardCard("관리자", `${adminCount}명`, "", "/admin/users")}</Col>
				</Row>
				<Row className="mt-20">
					<Col>
						<Text p2 className="mb-20">
							교육중인 수업목록
						</Text>
						<DashboardTable striped bordered hover>
							<thead>
								<tr>
									<th>과목ID</th>
									<th>과목명</th>
									<th>수강인원</th>
									<th>누적인원</th>
								</tr>
							</thead>
							<tbody>
								{courses &&
									courses.map((course, _) => {
										return (
											<tr key={_}>
												<td>{course.id || ""}</td>
												<td>{course.name || ""}</td>
												<td onClick={() => openCourseEnrollmentsModal(course.name, course.id)}>
													<LinkStyle>{course.current_enrollment_count}</LinkStyle>
												</td>

												<td>{course.enrollment_count}</td>
											</tr>
										);
									})}
							</tbody>
						</DashboardTable>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

const DashboardContainer = styled.div`
	border: 0.063rem solid ${({ theme }) => theme.colors.primary};
	border-radius: 0.25rem;
	height: 10rem;
	cursor: pointer;
`;

const DashboardTable = styled(Table)`
	font-size: 13px;
`;

const LinkStyle = styled.div`
	color: #007bff;
	cursor: pointer;
	&:hover {
		color: #0056b3;
		text-decoration: underline;
	}
`;

export default Dashboard;
