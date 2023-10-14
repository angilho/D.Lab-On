import React, { useState, useEffect } from "react";
import { Form, Row, Col, Table } from "react-bootstrap";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import CourseType from "@constants/CourseType";
import UserRole from "@constants/UserRole";

import PasswordChangeModal from "../modal/password-change";
import EnrollmentAddModal from "../modal/enrollment-add";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const InstructorDetail = ({ ...props }) => {
	let history = useHistory();
	const [user, setUser] = useState({});
	const [enrollments, setEnrollments] = useState([]);
	const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
	const [showEnrollmentAddModal, setShowEnrollmentAddModal] = useState(false);

	useEffect(() => {
		ctrl.getInstructor(props.id, callbackGetUser);
		ctrl.getUserEnrollments(props.id, callbackGetEnrollments);
	}, []);

	const callbackGetUser = user => {
		setUser(user);
	};

	const callbackGetEnrollments = enrollments => {
		setEnrollments(enrollments.enrollments);
	};

	const addInstructorEnrollment = (courseId, sectionId) => {
		ctrl.createInstructorEnrollment(user.id, courseId, sectionId, () => {
			ctrl.getUserEnrollments(props.id, callbackGetEnrollments);
		});
	};

	const deleteInstructorEnrollment = enrollmentId => {
		ctrl.deleteInstructorEnrollment(user.id, enrollmentId, () => {
			ctrl.getUserEnrollments(props.id, callbackGetEnrollments);
		});
	};

	const renderLectureTable = () => {
		return (
			<Col>
				<Row className="mt-40">
					<Col md="auto">
						<Text h5>강의내역</Text>
					</Col>
					<Col md="auto">
						<Button primary className="w-100 m-0" onClick={() => setShowEnrollmentAddModal(true)}>
							과목추가
						</Button>
					</Col>
				</Row>
				<LectureTable striped bordered hover className="mt-20">
					<thead>
						<tr>
							<th>과목ID</th>
							<th>과목명</th>
							<th style={{ minWidth: "80px" }}>차수ID</th>
							<th>시작일</th>
							<th>종료일</th>
							<th style={{ minWidth: "120px" }}>시간 정보</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{enrollments.map((enrollment, _) => {
							let isRegularCourse = enrollment.course.type === CourseType.REGULAR;
							let time = !isRegularCourse
								? "시간 협의"
								: `${util.pad(enrollment.course_section.start_hour)} : ${util.pad(
										enrollment.course_section.start_minute
								  )} ~ ${util.pad(enrollment.course_section.end_hour)} : ${util.pad(
										enrollment.course_section.end_minute
								  )}`;

							let startAt = enrollment.course_section.start_at;
							let endAt = enrollment.course_section.end_at;
							if (enrollment.course.type === CourseType.VOD) {
								time = "VOD 클래스";
								startAt = enrollment.updated_at;
								endAt = new Date(enrollment.updated_at);
								endAt.setFullYear(endAt.getFullYear() + 1);
								endAt.setDate(endAt.getDate() - 1);
							}
							return (
								<tr key={_}>
									<td>{enrollment.course.dlab_course_code || ""}</td>
									<td>{enrollment.course.name || ""}</td>
									<td>{enrollment.course_section.id || ""}</td>
									<td>{util.convertDateTimeStr(startAt || "")}</td>
									<td>{util.convertDateTimeStr(endAt || "")}</td>
									<td>{time}</td>
									<td>
										<Button primary onClick={() => deleteInstructorEnrollment(enrollment.id)}>
											삭제
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</LectureTable>
			</Col>
		);
	};

	/**
	 * 사용자 정보 출력
	 */
	const renderUserBasicInfo = () => {
		return (
			<React.Fragment>
				<Text h5>{user.name || ""}</Text>
				<Text p2>{`아이디: ${user.user_login || ""}`}</Text>
				<Text p2>{`사원번호: ${user.instructor_metadata?.employee_number ?? ""}`}</Text>
				<Text p2>{`이메일: ${user.email || "-"}`}</Text>
				<Text p2>{`역할: ${UserRole[user.role] || "-"}`}</Text>
				<Text p2>{`성별: ${user.instructor_metadata?.gender === "m" ? "남" : "여"}`}</Text>
				<Text p2>{`생년월일: ${user.birthday?.year ?? "-"}.${user.birthday?.month ?? "-"}.${user.birthday
					?.day ?? "-"}`}</Text>
				<Text p2>{`재직기간: ${user.instructor_metadata?.start_at ?? ""} ~ ${user.instructor_metadata?.end_at ??
					""}`}</Text>
				<Text p2>{`전화번호: ${user.phone || ""}`}</Text>
				<Text p2>{`주소: ${user.address || ""}, ${user.address_detail || ""}`}</Text>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<Row>
				<Col className="align-self-center align-items-center">{renderUserBasicInfo()}</Col>
				<Col md={3} className="align-self-center align-items-center">
					<Link to={`/admin/instructors/${user.id}/edit`}>
						<Button primary size="large" className="w-100 mb-10 m-0" id="editEnrollmentBtn">
							회원 정보 수정
						</Button>
					</Link>

					<Button
						primary
						size="large"
						className="w-100 mb-10 m-0"
						id="resetPasswordBtn"
						onClick={() => setShowPasswordChangeModal(true)}
					>
						비밀번호 수정
					</Button>
					<Button
						primary
						size="large"
						className="w-100 mb-10 m-0"
						id="deleteAccountBtn"
						onClick={() => ctrl.handleUserDelete(user, () => history.goBack())}
					>
						회원 탈퇴
					</Button>
				</Col>
			</Row>
			<Row className="mt-20">{renderLectureTable()}</Row>
			<PasswordChangeModal
				show={showPasswordChangeModal}
				onHide={() => setShowPasswordChangeModal(false)}
				user={user}
			/>
			<EnrollmentAddModal
				show={showEnrollmentAddModal}
				onHide={() => setShowEnrollmentAddModal(false)}
				handleAdd={(course, section) => {
					setShowEnrollmentAddModal(false);
					addInstructorEnrollment(course.id, section.id);
				}}
			/>
		</React.Fragment>
	);
};

const LectureTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default InstructorDetail;
