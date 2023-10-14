import React, { useState, useEffect } from "react";
import { Form, Row, Col, Table } from "react-bootstrap";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import CourseType from "@constants/CourseType";
import UserRole from "@constants/UserRole";
import RoleType from "@constants/RoleType";
import AdminSideBarMenu from "@constants/AdminSideBarMenu";

import PasswordChangeModal from "../modal/password-change";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const UserDetail = ({ from = "users", ...props }) => {
	let history = useHistory();
	const [user, setUser] = useState({});
	const [enrollments, setEnrollments] = useState([]);
	const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

	useEffect(() => {
		ctrl.getChildren(props.id, callbackGetUser);
		ctrl.getUserEnrollments(props.id, callbackGetEnrollments);
	}, []);

	const callbackGetUser = user => {
		setUser(user);
	};

	const callbackGetEnrollments = enrollments => {
		setEnrollments(enrollments.enrollments);
	};

	const hasPermissionMenu = menu => {
		return user.menu_permission.some(menuPermission => menuPermission.menu_id === menu.id);
	};

	const renderAdminPermissionTable = () => {
		return (
			<Col>
				<Text h5 className="mt-40">
					접근 메뉴
				</Text>
				<UserTable striped bordered hover className="mt-20">
					<thead>
						<tr>
							<th>메뉴ID</th>
							<th>메뉴명</th>
							<th>권한여부</th>
						</tr>
					</thead>
					<tbody>
						{AdminSideBarMenu.map((adminMenu, _) => {
							return (
								<tr key={_}>
									<td>{adminMenu.id}</td>
									<td>{adminMenu.title}</td>
									<td>{hasPermissionMenu(adminMenu) ? "Y" : "N"}</td>
								</tr>
							);
						})}
					</tbody>
				</UserTable>
			</Col>
		);
	};

	const renderChildrenTable = () => {
		return (
			<Col>
				<Text h5 className="mt-40">
					자녀 정보
				</Text>
				<UserTable striped bordered hover className="mt-20">
					<thead>
						<tr>
							<th>자녀ID</th>
							<th>이름</th>
							<th>성별</th>
							<th>전화번호</th>
							<th>학교</th>
							<th>학년</th>
						</tr>
					</thead>
					<tbody>
						{user.children.map((child, _) => {
							let gender = child.user_metadata.gender === "m" ? "남" : "여";
							return (
								<tr key={_}>
									<td>{child.user_info.user_login || ""}</td>
									<td>{child.user_info.name || ""}</td>
									<td>{gender}</td>
									<td>{child.user_info.phone || ""}</td>
									<td>{child.user_metadata.school || ""}</td>
									<td>{child.user_metadata.grade_str || ""}</td>
								</tr>
							);
						})}
					</tbody>
				</UserTable>
			</Col>
		);
	};

	const renderParentTable = () => {
		return (
			<Col>
				<Text h5 className="mt-40">
					학부모 정보
				</Text>
				<UserTable striped bordered hover className="mt-20">
					<thead>
						<tr>
							<th>학부모ID</th>
							<th>이름</th>
							<th>전화번호</th>
							<th>이메일</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{user.parent.parent_info.user_login || ""}</td>
							<td>{user.parent.parent_info.name || ""}</td>
							<td>{user.parent.parent_info.phone || ""}</td>
							<td>{user.parent.parent_info.email || ""}</td>
						</tr>
					</tbody>
				</UserTable>
			</Col>
		);
	};

	const renderEnrollmentsTable = () => {
		return (
			<Col>
				<Text h5 className="mt-40">
					{user.name || ""}의 수강 내역
				</Text>
				<EnrollmentTable striped bordered hover className="mt-20">
					<thead>
						<tr>
							<th>D.LAB 과목 ID</th>
							<th>과목명</th>
							<th>수강생</th>
							<th>차수ID</th>
							<th>시작일</th>
							<th>종료일</th>
							<th>시간 정보</th>
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
									<td>{enrollment.user.name || ""}</td>
									<td>{enrollment.course_section.id || ""}</td>
									<td>{util.convertDateTimeStr(startAt || "")}</td>
									<td>{util.convertDateTimeStr(endAt || "")}</td>
									<td>{time}</td>
									<td>{enrollment.status === "complete" ? "정상" : "수강 취소"}</td>
								</tr>
							);
						})}
					</tbody>
				</EnrollmentTable>
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
				<Text p2>{`이메일: ${user.email || "-"}`}</Text>
				<Text p2>{`역할: ${UserRole[user.role] || "-"}`}</Text>
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
					<Link to={`/admin/${from}/${user.id}/edit`}>
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
			<Row className="mt-20">{user.role == RoleType.ADMIN && renderAdminPermissionTable()}</Row>
			<Row className="mt-20">{user.role != RoleType.CHILD && user.children && renderChildrenTable()}</Row>
			<Row className="mt-20">{user.role == RoleType.CHILD && user.parent && renderParentTable()}</Row>
			<Row className="mt-20">{enrollments && renderEnrollmentsTable()}</Row>
			<PasswordChangeModal
				show={showPasswordChangeModal}
				onHide={() => setShowPasswordChangeModal(false)}
				user={user}
			/>
		</React.Fragment>
	);
};

const UserTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

const EnrollmentTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default UserDetail;
