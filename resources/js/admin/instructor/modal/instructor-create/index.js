import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Modal } from "react-bootstrap";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import Text from "@components/elements/Text";
import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";
import Campus from "@constants/Campus";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminInstructorCreateModal = props => {
	const [user, setUser] = useState(ctrl.getDefaultUser());
	const [passwordConfirm, setPasswordConfirm] = useState("");
	return (
		<Modal show={props.show} onHide={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title>새 강사 추가하기</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col>
						<Text p3 className="mb-20">
							회원 등록을 위하여 정보를 작성해 주세요.
						</Text>
						<FormLabel required>회원 유형</FormLabel>
						<div key="inline-radio" className="mb-1">
							<Form.Check
								inline
								label="강사회원"
								type="radio"
								id="role-general"
								onChange={event => setUser({ ...user, role: 3 })}
								checked={user.role == 3}
							/>
						</div>
						<FormLabel required>이름</FormLabel>
						<FormControl
							className="w-100"
							type="text"
							placeholder="예) 홍길동"
							value={user.name}
							onChange={event => setUser({ ...user, name: event.currentTarget.value })}
						/>
						<FormLabel required>전화번호</FormLabel>
						<FormControl
							className="w-100"
							type="phone"
							placeholder="예) 010-xxxx-xxxx"
							value={user.phone}
							onChange={event => setUser({ ...user, phone: event.currentTarget.value })}
						/>
						<FormLabel required>이메일</FormLabel>
						<FormControl
							className="w-100"
							type="email"
							placeholder="예) nomail@dlab.com"
							value={user.email}
							onChange={event => setUser({ ...user, email: event.currentTarget.value })}
						/>
						<FormLabel required>아이디</FormLabel>
						<FormControl
							className="w-100"
							type="text"
							placeholder="예) test1234"
							value={user.user_login}
							onChange={event => setUser({ ...user, user_login: event.currentTarget.value })}
						/>
						<FormLabel required>비밀번호</FormLabel>
						<FormControl
							className="w-100"
							type="password"
							placeholder="비밀번호 (영문, 숫자, 특수문자 조합 최소 8자)"
							onChange={event => setUser({ ...user, password: event.currentTarget.value })}
						/>
						<FormLabel required>비밀번호 확인</FormLabel>
						<FormControl
							className="w-100"
							type="password"
							placeholder="••••••••"
							onChange={event => setPasswordConfirm(event.currentTarget.value)}
						/>
						<div className={passwordConfirm === "" || user.password === passwordConfirm ? "d-none" : ""}>
							<Text p3 className="text-danger mb-10 mt-10">
								비밀번호가 일치하지 않습니다.
							</Text>
						</div>
						<FormLabel required>생년월일</FormLabel>
						<Row className="align-items-center" align={"center"}>
							<Col>
								<FormControl
									className="w-100 m-0"
									type="number"
									placeholder="1990"
									min={1900}
									max={3000}
									value={user.birthday.year}
									onChange={event =>
										setUser({
											...user,
											birthday: {
												...user.birthday,
												year: event.currentTarget.value
											}
										})
									}
								/>
							</Col>
							<Col xs="auto" md="auto" className="pl-0">
								<Text p3>년</Text>
							</Col>
							<Col>
								<FormControl
									className="w-100 m-0"
									type="number"
									placeholder="01"
									value={user.birthday.month}
									min="1"
									max="12"
									onChange={event =>
										setUser({
											...user,
											birthday: {
												...user.birthday,
												month: event.currentTarget.value
											}
										})
									}
								/>
							</Col>
							<Col xs="auto" md="auto" className="pl-0">
								<Text p3>월</Text>
							</Col>
							<Col>
								<FormControl
									className="w-100 m-0"
									type="number"
									placeholder="01"
									value={user.birthday.day}
									min="1"
									max="31"
									onChange={event =>
										setUser({
											...user,
											birthday: {
												...user.birthday,
												day: event.currentTarget.value
											}
										})
									}
								/>
							</Col>
							<Col xs="auto" md="auto" className="pl-0">
								<Text p3>일</Text>
							</Col>
						</Row>
						<FormLabel required className="mt-3">
							주소
						</FormLabel>
						<FormControl
							className="w-100"
							type="text"
							placeholder="예) 서울시 서초구"
							value={user.address}
							onChange={event => setUser({ ...user, address: event.currentTarget.value })}
						/>
						<FormControl
							className="w-100"
							type="text"
							placeholder="상세주소 입력"
							value={user.address_detail}
							onChange={event => setUser({ ...user, address_detail: event.currentTarget.value })}
						/>
						<FormLabel required>재직기간</FormLabel>
						<Row className="align-items-center">
							<Col md={5}>
								<StyledDatePicker
									selected={user.start_at_date}
									onChange={date => {
										setUser({
											...user,
											start_at: util.getFormatDate(date, "-"),
											start_at_date: date
										});
									}}
									dateFormat="yyyy-MM-dd"
								/>
							</Col>
							<Col md={2} className="text-center">
								~
							</Col>
							<Col md={5}>
								<StyledDatePicker
									selected={user.end_at_date}
									onChange={date => {
										setUser({
											...user,
											end_at: util.getFormatDate(date, "-"),
											end_at_date: date
										});
									}}
									dateFormat="yyyy-MM-dd"
								/>
							</Col>
						</Row>
						<FormLabel required className="mt-3">
							성별
						</FormLabel>
						<div key="inline-radio-2" className="mb-1">
							<Form.Check
								inline
								label="남자"
								type="radio"
								id="gender-male"
								onChange={event => setUser({ ...user, gender: "m" })}
								checked={user.gender == "m"}
							/>
							<Form.Check
								inline
								label="여자"
								type="radio"
								id="gender-female"
								onChange={event => setUser({ ...user, gender: "f" })}
								checked={user.gender == "f"}
							/>
						</div>
						<FormLabel required className="mt-3">
							디랩코딩학원
						</FormLabel>
						<FormControl
							className="w-100 p-0 m-0"
							as="select"
							name="campus"
							value={user.campus}
							onChange={event => setUser({ ...user, campus: event.currentTarget.value })}
						>
							{Campus.allCampus().map((value, idx) => {
								return (
									<option key={idx} value={value}>
										{Campus.convertToString(value)}
									</option>
								);
							})}
						</FormControl>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button
					className="w-25"
					primary
					size="large"
					onClick={() => ctrl.handleCreate(user, props.callback_url)}
				>
					확인
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const StyledDatePicker = styled(DatePicker)`
	border: 0.063rem solid #e1e1e1;
	padding: 1px 2px 1px 2px;
	text-indent: 1rem;
	border-radius: 0.25rem;
	width: 100%;
	height: 3rem;
`;

export default AdminInstructorCreateModal;
