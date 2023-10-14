import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import Text from "@components/elements/Text";
import useRegisterUser from "@hooks/useRegisterUser";
import useSizeDetector from "@hooks/useSizeDetector";
import UserRegisterForm from "../components/UserRegisterForm";

import * as ctrl from "./index.ctrl";

const RegisterChild = ({ parent_id }) => {
	const location = useLocation();
	const history = useHistory();
	const SizeDetector = useSizeDetector();
	const registerChildrenHandler = useRegisterUser({
		initialValues: {
			// 부모 ID 정보를 child state에 설정한다.
			...ctrl.getDefaultChild(),
			phone_verify: false,
			parent_id
		}
	});
	const [parent, setParent] = useState({});

	// 약관 동의 정보 체크를 위한 사용자 정보 획득
	useEffect(() => {
		ctrl.getUser(parent_id, callbackGetParent);
	}, []);

	const callbackGetParent = parent => {
		setParent(parent);
	};

	const registerChild = e => {
		e.preventDefault();
		ctrl.handleCreate(parent_id, registerChildrenHandler.user, callbackRegisterUser);
	};

	const registerOtherChild = e => {
		e.preventDefault();
		ctrl.handleCreate(parent_id, registerChildrenHandler.user, callbackRegisterOtherUser);
	};

	const callbackRegisterUser = user => {
		if (user.id) {
			history.push({
				pathname: "/register/welcome"
			});
		}
	};

	const callbackRegisterOtherUser = user => {
		if (user.id) {
			history.go(0);
		}
	};

	const parentDataHandler = param => {
		return parent[param];
	};

	return (
		<div className="container">
			<Row className="justify-content-center mt-60">
				<Col>
					<Row>
						<Col align="center">
							<StyledText
								h5
								className={
									SizeDetector.isDesktop ? "mb-40 justify-content-start" : "justify-content-start"
								}
							>
								자녀(학생 회원) 등록
							</StyledText>
						</Col>
					</Row>
					<UserRegisterForm
						isChild
						registerUserHandler={registerChildrenHandler}
						onRegister={registerChild}
						onRegisterOtherChild={registerOtherChild}
						parentDataHandler={parentDataHandler}
					/>
				</Col>
			</Row>
		</div>
	);
};

const StyledText = styled(Text)`
	max-width: 378px;
`;

export default RegisterChild;
