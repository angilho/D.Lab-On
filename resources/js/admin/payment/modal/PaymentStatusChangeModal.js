import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";

import PaymentStatus from "@constants/PaymentStatus";
import * as util from "@common/util";

const PaymentStatusChangeModal = ({ show, onHide, payment, handleOk }) => {
	const [status, setStatus] = useState(payment.status);

	useEffect(() => {
		setStatus(payment.status);
	}, [payment]);

	const onClickOkBtn = () => {
		handleOk(payment, status);
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>결제 상태 변경</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="container">
					<Text>변경할 상태를 선택해 주세요.</Text>
					<FormControl
						as="select"
						className="w-100 mt-20"
						name="status"
						value={status}
						onChange={event => setStatus(event.currentTarget.value)}
					>
						{Object.keys(PaymentStatus).map(key => {
							return (
								<option key={key} value={PaymentStatus[key]}>
									{util.getPaymentStatusStr(PaymentStatus[key])}
								</option>
							);
						})}
					</FormControl>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button primary size="large" className="w-25" onClick={onClickOkBtn}>
					확인
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default PaymentStatusChangeModal;
