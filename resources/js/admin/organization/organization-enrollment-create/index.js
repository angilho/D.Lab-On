import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import Text from "@components/elements/Text";
import styled from "styled-components";
import UserAddModal from "../modal/user-add";
import EnrollmentAddModal from "../modal/enrollment-add";

import * as ctrl from "./index.ctrl";

const AdminOrganizationEnrollmentCreate = () => {
	const history = useHistory();
	const [enrollments, setEnrollments] = useState([]);
	const [allChecked, setAllChecked] = useState(false);
	const [userLogin, setUserLogin] = useState("");
	const [courseCode, setCourseCode] = useState("");
	const [courseName, setCourseName] = useState("");
	const [sectionId, setSectionId] = useState(null);
	const [showUserAddModal, setShowUserAddModal] = useState(false);
	const [showEnrollmentAddModal, setShowEnrollmentAddModal] = useState(false);

	const onAddEnrollment = () => {
		if (userLogin == "" || courseCode == "") {
			return alert("수강 신청할 정보를 잘못 입력하였습니다.");
		}
		setEnrollments([
			...enrollments,
			{
				user_login: userLogin,
				course_code: courseCode,
				course_name: courseName,
				section_id: sectionId,
				selected: false
			}
		]);
		setUserLogin("");
		setCourseCode("");
		setCourseName("");
		setSectionId(null);
	};

	const onSaveSelectedEnrollments = () => {
		if (enrollments.filter(e => e.selected).length === 0) {
			alert("수강 신청할 항목이 없습니다.");
			return;
		}

		ctrl.createOrganizationEnrollmentImport(
			enrollments.filter(e => e.selected),
			() => history.push({ pathname: "/admin/organization_enrollments" })
		);
	};

	const onDeleteSelectedEnrollments = () => {
		if (confirm("삭제하시겠습니까?")) {
			let remainEnrollments = enrollments.filter(e => !e.selected);
			setEnrollments(remainEnrollments);
		}
	};

	const onAllChecked = () => {
		if (allChecked) {
			setAllChecked(false);
		} else {
			setAllChecked(true);
		}

		let checkedEnrollments = enrollments.map(e => {
			e.selected = !allChecked;
			return e;
		});
		setEnrollments(checkedEnrollments);
	};

	const handleUserAdd = user => {
		setUserLogin(user.user_login);
		setShowUserAddModal(false);
	};

	const handleEnrollmentAdd = (course, section) => {
		setCourseName(course.name);
		setCourseCode(course.dlab_course_code);
		setSectionId(section.id);
		setShowEnrollmentAddModal(false);
	};

	return (
		<React.Fragment>
			<Row className="mt-3">
				<Col>
					<Text>기업회원, B2B과목 검색을 통해서 관리자가 B2B 멤버들의 수강신청을 진행할 수 있습니다.</Text>
					<Text>수강 신청시에는 회원아이디와 강의코드가 필요합니다.</Text>
				</Col>
			</Row>
			<EnrollmentAddContainer className="mt-5">
				<h4 className="mt-3">개별추가</h4>
				<Row className="mt-3">
					<Col md={4}>
						<FormLabel>회원아이디</FormLabel>
						<Row>
							<Col>
								<div className="input-group">
									<WithButtonControl
										className="form-control"
										type="text"
										placeholder="회원아이디"
										value={userLogin}
										disabled
									/>
									<div className="input-group-append">
										<Button
											type="button"
											className="input-group-text"
											secondary
											size="large"
											onClick={() => setShowUserAddModal(true)}
										>
											검색
										</Button>
									</div>
								</div>
							</Col>
						</Row>
					</Col>
					<Col md={4}>
						<FormLabel>강의코드</FormLabel>
						<Row>
							<Col>
								<div className="input-group">
									<WithButtonControl
										className="form-control"
										type="text"
										value={courseCode}
										placeholder="강의코드"
										disabled
									/>
									<div className="input-group-append">
										<Button
											type="button"
											className="input-group-text"
											secondary
											size="large"
											onClick={() => setShowEnrollmentAddModal(true)}
										>
											검색
										</Button>
									</div>
								</div>
							</Col>
						</Row>
					</Col>
					<Col md={2} className="mt-36">
						<Button primary className="w-100" onClick={onAddEnrollment}>
							추가
						</Button>
					</Col>
				</Row>
			</EnrollmentAddContainer>
			<Row className="justify-content-end mt-3">
				<Col md={2}>
					<Button primary className="w-100" onClick={onSaveSelectedEnrollments}>
						저장
					</Button>
				</Col>
				<Col md={2}>
					<Button danger className="w-100" onClick={onDeleteSelectedEnrollments}>
						선택삭제
					</Button>
				</Col>
			</Row>
			<OrganizationTable striped bordered hover className="mt-3">
				<thead>
					<tr>
						<th>
							<Checkbox checked={allChecked} onChange={onAllChecked} label="" />
						</th>
						<th>번호</th>
						<th>회원아이디</th>
						<th>강의명(코드)</th>
						<th>차시</th>
					</tr>
				</thead>
				<tbody>
					{enrollments &&
						enrollments.length > 0 &&
						enrollments.map((enrollment, idx) => {
							return (
								<tr key={idx}>
									<td>
										<Checkbox
											checked={enrollment.selected}
											onChange={value => {
												let changedEnrollments = enrollments.map(e => e);
												changedEnrollments[idx].selected = value;
												setEnrollments(changedEnrollments);
											}}
											label=""
										/>
									</td>
									<td>{idx + 1}</td>
									<td>{enrollment.user_login}</td>
									<td>{`${enrollment.course_name}(${enrollment.course_code})`}</td>
									<td>{`ID: ${enrollment.section_id}`}</td>
								</tr>
							);
						})}
				</tbody>
			</OrganizationTable>
			<UserAddModal
				show={showUserAddModal}
				onHide={() => {
					setShowUserAddModal(false);
				}}
				handleAdd={handleUserAdd}
			/>
			<EnrollmentAddModal
				show={showEnrollmentAddModal}
				onHide={() => {
					setShowEnrollmentAddModal(false);
				}}
				handleAdd={handleEnrollmentAdd}
			/>
		</React.Fragment>
	);
};

const EnrollmentAddContainer = styled.div`
	border: 1px solid gray;
	border-radius: 0.5rem;
	padding: 1rem;
`;

const OrganizationTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

const WithButtonControl = styled(FormControl)`
	border-right: 1px solid ${({ theme }) => theme.colors.primary};
	&:disabled {
		border-right: 0px;
	}
`;

export default AdminOrganizationEnrollmentCreate;
