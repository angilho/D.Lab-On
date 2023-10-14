import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import Text from "@components/elements/Text";
import useRegisterUser from "@hooks/useRegisterUser";
import useSizeDetector from "@hooks/useSizeDetector";
import UserRegisterForm from "../components/UserRegisterForm";

import * as ctrl from "./index.ctrl";

const RegisterUser = props => {
	const location = useLocation();
	const history = useHistory();
	const SizeDetector = useSizeDetector();
	const registerUserHandler = useRegisterUser({
		initialValues: {
			...ctrl.getDefaultUser(location.state.registerGeneral),
			phone_verify: false,
			agreements: {
				dlab_on: location.state.dlabOn,
				privacy: location.state.privacy,
				promotion: location.state.promotion
			}
		}
	});

	// 약관 동의 정보 체크
	useEffect(() => {
		if (
			typeof location.state === "undefined" ||
			typeof location.state.dlabOn === "undefined" ||
			typeof location.state.privacy === "undefined" ||
			typeof location.state.promotion === "undefined"
		) {
			alert("약관 동의 정보가 없습니다.");
			history.goBack();
			return;
		}

		if (!location.state || typeof location.state.registerGeneral === "undefined") {
			alert("사용자 유형을 선택하지 않았습니다.");
			history.goBack();
			return;
		}
	}, []);

	const registerUser = e => {
		e.preventDefault();
		ctrl.handleCreate(registerUserHandler.user, callbackRegisterUser);
	};

	const callbackRegisterUser = user => {
		if (user.id) {
			// 일반 회원 등록일 경우 아이 등록 화면으로 간다.
			// 그 외는 welcome
			if (location.state.registerGeneral) {
				window.location.href = "/register/child/confirm";
			} else {
				window.location.href = "/register/welcome";
			}
		}
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
								필수정보 입력
							</StyledText>
						</Col>
					</Row>
					{location.state.registerGeneral ? (
						<UserRegisterForm registerUserHandler={registerUserHandler} onRegister={registerUser} />
					) : (
						<UserRegisterForm registerUserHandler={registerUserHandler} onRegister={registerUser} isChild />
					)}
				</Col>
			</Row>
		</div>
	);
};

const StyledText = styled(Text)`
	max-width: 378px;
`;

export default RegisterUser;
