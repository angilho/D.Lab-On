import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import FormControl from "@components/elements/FormControl";

import * as ctrl from "./index.ctrl";
import * as util from "@common/util";

const PasswordChangeModal = props => {
	const [user, setUser] = useState(props.user);
	const onClickPasswordChange = () => {
		if (confirm("비밀번호를 변경하시겠습니까?")) {
			ctrl.updateUser(user, () => {
				alert("비밀번호가 변경되었습니다.");
				props.onHide();
			});
		}
	};

	useEffect(() => {
		setUser(props.user);
	}, [props.user]);

	return (
		<Modal show={props.show} onHide={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title>비밀번호 변경</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="container">
					<Text>변경할 비밀번호를 입력해 주세요</Text>
					<FormControl
						className="w-100 mt-20"
						type="password"
						placeholder="비밀번호 (영문, 숫자, 특수문자 조합 최소 8자)"
						onChange={event => setUser({ ...user, password: event.currentTarget.value })}
					/>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button primary size="large" className="w-25" onClick={onClickPasswordChange}>
					확인
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default PasswordChangeModal;
