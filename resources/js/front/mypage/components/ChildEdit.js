import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

import useRegisterUser from "@hooks/useRegisterUser";
import UserRegisterForm from "../../../auth/register/components/UserRegisterForm";

import * as ctrl from "./UserEdit.ctrl";

const ChildEdit = ({ child_id }) => {
	const [user, setUser] = useState({});

	const registerUserHandler = useRegisterUser({
		initialValues: {
			...user
		},
		isUpdate: true,
		phone_verify: true
	});

	useEffect(() => {
		ctrl.getUser(child_id, callbackGetUser);
	}, []);

	useEffect(() => {
		registerUserHandler.setUser(user);
	}, [user]);

	const callbackGetUser = user => {
		setUser({
			...user,
			...user.user_metadata
		});
	};

	const callbackUpdateUser = user => {
		//관리자 페이지의 회원 수정에서 접속했을 경우 뒤로 간다.
		window.location.reload();
	};

	const updateUser = () => {
		if (!ctrl.validateUser(registerUserHandler.user, true)) {
			return;
		}
		ctrl.updateUser(child_id, registerUserHandler.user, callbackUpdateUser);
	};

	return (
		<Row className="child-edit">
			<Col>
				<UserRegisterForm
					title="자녀 정보 수정"
					isChild={true}
					align={"left"}
					registerUserHandler={registerUserHandler}
					onRegister={updateUser}
				/>
			</Col>
		</Row>
	);
};

export default ChildEdit;
