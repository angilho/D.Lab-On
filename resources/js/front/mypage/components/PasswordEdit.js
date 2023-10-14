import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";

import * as ctrl from "./PasswordEdit.ctrl";

const PasswordEdit = props => {
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
	const [passwordMatch, setPasswordMatch] = useState(false);

	useEffect(() => {
		if (!userInfo.id) history.goBack();
	}, []);

	useEffect(() => {
		if (newPassword.length > 0 && newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm) {
			setPasswordMatch(true);
		}
	}, [newPassword, newPasswordConfirm]);

	const updatePassword = () => {
		ctrl.updateUserPassword(password, newPassword, newPasswordConfirm, () => {
			alert("비밀번호를 성공적으로 변경하였습니다.");
			setPassword("");
			setNewPassword("");
			setNewPasswordConfirm("");
		});
	};

	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				e.stopPropagation();
				updatePassword();
			}}
		>
			<Row>
				<Col>
					<FormLabel required>현재 비밀번호</FormLabel>
					<FormControl
						type="password"
						placeholder="••••••••"
						autoComplete="on"
						className="w-100"
						name="password"
						value={password}
						onChange={event => setPassword(event.currentTarget.value)}
					/>
					<FormLabel required>새 비밀번호</FormLabel>
					<FormControl
						type="password"
						placeholder="••••••••"
						autoComplete="on"
						className="w-100"
						name="new_password"
						value={newPassword}
						onChange={event => setNewPassword(event.currentTarget.value)}
					/>
					<FormLabel required>새 비밀번호 확인</FormLabel>
					<FormControl
						type="password"
						placeholder="••••••••"
						autoComplete="on"
						className="w-100"
						name="new_password_confirm"
						value={newPasswordConfirm}
						onChange={event => setNewPasswordConfirm(event.currentTarget.value)}
					/>
					{newPassword && !passwordMatch && (
						<div className="mt-10 mb-10">
							<Text p3 className="text-danger">
								입력하신 비밀번호와 다릅니다. 다시 확인해 주세요.
							</Text>
						</div>
					)}
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<Button
						primary
						size="large"
						className="w-100"
						type="submit"
						onClick={e => {
							e.preventDefault();
							updatePassword();
						}}
					>
						확인
					</Button>
				</Col>
			</Row>
		</form>
	);
};

export default PasswordEdit;
