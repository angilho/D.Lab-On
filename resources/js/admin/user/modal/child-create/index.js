import React, { useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminChildCreateModal = props => {
	const [child, setChild] = useState(ctrl.getDefaultChild());

	const renderYear = () => {
		//최대 30살까지로 지정하자.
		let years = util.getYearList();
		return years.map((value, idx) => {
			return <option key={idx}>{value}</option>;
		});
	};

	const renderMonth = () => {
		let month = util.getMonthList();
		return month.map((value, idx) => {
			return <option key={idx}>{value}</option>;
		});
	};

	const renderDay = () => {
		let day = util.getDayList();
		return day.map((value, idx) => {
			return <option key={idx}>{value}</option>;
		});
	};

	return (
		<Modal show={props.show} onHide={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title>자녀 정보 추가하기</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="content-fluid">
					<p className="mb-5">자녀 정보를 추가하면 자동으로 UID가 생성됩니다.</p>
					<Form.Label>자녀 이름</Form.Label>
					<div key="inline-text" className="mb-3">
						<Form.Control
							size="md"
							type="text"
							placeholder="이름"
							className="mb-1"
							value={child.name}
							onChange={event => setChild({ ...child, name: event.currentTarget.value })}
						/>
					</div>
					<Form.Label>자녀 성별</Form.Label>
					<div key="inline-radio" className="mb-3">
						<Form.Check
							inline
							label="여자"
							type="radio"
							id="role-general"
							onChange={event => setChild({ ...child, gender: "f" })}
							checked={child.gender == "f"}
						/>
						<Form.Check
							inline
							label="남자"
							type="radio"
							id="role-admin"
							onChange={event => setChild({ ...child, gender: "m" })}
							checked={child.gender == "m"}
						/>
					</div>
					<div key="inline-birth" className="mb-3">
						<Form.Label>자녀 생년월일</Form.Label>
						<Row>
							<Col>
								<Form.Control
									placeholder="년도"
									as="select"
									onChange={event => {
										setChild({
											...child,
											birth: {
												...child.birth,
												year: event.currentTarget.value
											}
										});
									}}
								>
									{renderYear()}
								</Form.Control>
							</Col>
							<Col>
								<Form.Control
									placeholder="월"
									as="select"
									onChange={event => {
										setChild({
											...child,
											birth: {
												...child.birth,
												month: event.currentTarget.value
											}
										});
									}}
								>
									{renderMonth()}
								</Form.Control>
							</Col>
							<Col>
								{" "}
								<Form.Control
									placeholder="일"
									as="select"
									onChange={event => {
										setChild({
											...child,
											birth: {
												...child.birth,
												day: event.currentTarget.value
											}
										});
									}}
								>
									{renderDay()}
								</Form.Control>
							</Col>
						</Row>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" block onClick={() => ctrl.handleCreate(props.user.id || 0, child)}>
					확인
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AdminChildCreateModal;
