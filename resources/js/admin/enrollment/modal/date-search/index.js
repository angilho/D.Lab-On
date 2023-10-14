import React, { useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminDateSearchModal = props => {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	return (
		<Modal show={props.show} onHide={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title>날짜별 수강현황 조회하기</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="content-fluid">
					<p className="mb-5">자녀 정보를 추가하면 자동으로 UID가 생성됩니다.</p>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" block onClick={() => props.onComplete(startDate, endDate)}>
					확인
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AdminDateSearchModal;
