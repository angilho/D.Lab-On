import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import useRegisterUser from "@hooks/useRegisterUser";
import UserRegisterForm from "../../../auth/register/components/UserRegisterForm";

import * as ctrl from "./UserEdit.ctrl";

const UserEdit = ({ admin, ...props }) => {
	let location = useLocation();
	let history = useHistory();
	const [user, setUser] = useState({});

	const registerUserHandler = useRegisterUser({
		initialValues: {
			...user
		},
		isUpdate: true,
		isAdmin: admin,
		phone_verify: true
	});

	useEffect(() => {
		ctrl.getUser(props.id, callbackGetUser);
	}, []);

	useEffect(() => {
		registerUserHandler.setUser(user);
	}, [user]);

	const callbackGetUser = user => {
		setUser({
			...user,
			...user.user_metadata,
			...user.instructor_metadata,
			start_at_date: user.instructor_metadata ? new Date(user.instructor_metadata.start_at) : null,
			end_at_date: user.instructor_metadata ? new Date(user.instructor_metadata.end_at) : null
		});
	};

	const callbackUpdateUser = user => {
		//관리자 페이지의 회원 수정에서 접속했을 경우 뒤로 간다.
		if (location.pathname.toLowerCase().includes("admin")) history.goBack();
		else window.location.reload();
	};

	const updateUser = () => {
		if (!ctrl.validateUser(registerUserHandler.user, userInfo.is_child)) {
			return;
		}
		ctrl.updateUser(props.id, registerUserHandler.user, callbackUpdateUser);
	};

	return (
		<Row>
			<Col>
				<UserRegisterForm
					title="가입정보 확인 및 변경"
					isAdmin={admin}
					isChild={userInfo.is_child}
					registerUserHandler={registerUserHandler}
					onRegister={updateUser}
				/>
			</Col>
		</Row>
	);
};

export default UserEdit;
