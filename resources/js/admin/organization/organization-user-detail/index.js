import React, { useState, useEffect } from "react";
import { Form, Row, Col, Table } from "react-bootstrap";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import { Link, useHistory } from "react-router-dom";
import CourseType from "@constants/CourseType";
import UserRole from "@constants/UserRole";

import PasswordChangeModal from "../../user/modal/password-change";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminOrganizationUserDetail = ({ user_id }) => {
	let history = useHistory();
	const [user, setUser] = useState({});
	const [enrollments, setEnrollments] = useState([]);
	const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

	useEffect(() => {
		ctrl.getOrganizationUser(user_id, setUser);
		ctrl.getUserEnrollments(user_id, callbackGetEnrollments);
	}, []);

	const callbackGetEnrollments = enrollments => {
		setEnrollments(enrollments.enrollments);
	};

	const renderEnrollmentsTable = () => {
		return (
			<Col>
				<Text h5 className="mt-40">
					{user.name || ""}의 수강 내역
				</Text>
				<Table striped bordered hover className="mt-20">
					<thead>
						<tr>
							<th>D.LAB 과목 ID</th>
							<th>과목명</th>
							<th>수강생</th>
							<th>수강 상태</th>
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
							return (
								<tr key={_}>
									<td>{enrollment.course.dlab_course_code || ""}</td>
									<td>{enrollment.course.name || ""}</td>
									<td>{enrollment.user.name || ""}</td>
									<td>{enrollment.status === "complete" ? "정상" : "수강 취소"}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
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
				<Text p2>{`기업명: ${user.organization?.name || ""}`}</Text>
				<Text p2>{`아이디: ${user.user_login || ""}`}</Text>
				<Text p2>{`이메일: ${user.email || "-"}`}</Text>
				<Text p2>{`전화번호: ${user.phone || ""}`}</Text>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<Row>
				<Col className="align-self-center align-items-center">{renderUserBasicInfo()}</Col>
				<Col md={3} className="align-self-center align-items-center">
					<Link to={`/admin/organization_users/${user.id}/edit`}>
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
			<Row className="mt-20">{enrollments && renderEnrollmentsTable()}</Row>
			<PasswordChangeModal
				show={showPasswordChangeModal}
				onHide={() => setShowPasswordChangeModal(false)}
				user={user}
			/>
		</React.Fragment>
	);
};

export default AdminOrganizationUserDetail;
