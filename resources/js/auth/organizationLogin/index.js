import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";
import Checkbox from "@components/elements/Checkbox";
import * as ctrl from "./index.ctrl";

const OrganizationLogin = ({ path }) => {
	const history = useHistory();
	const location = useLocation();
	const [userLogin, setUserLogin] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [error, setError] = useState("");
	const [findUserLogin, setFindUserLogin] = useState("");

	useEffect(() => {
		//아이디 찾기에서 들어왔을 경우 로그인 페이지로 리다이렉트 한 뒤, 아이디 정보를 표시한다.
		if (location.state && location.state.findUserLogin) {
			setFindUserLogin(location.state.findUserLogin);
			history.replace(location.pathname, null);
		}
	}, [location]);

	const login = e => {
		e.preventDefault();
		e.stopPropagation();

		if (!userLogin) {
			setError("아이디를 입력하여 주십시오.");
			return;
		}
		if (!userPassword) {
			setError("비밀번호를 입력하여 주십시오.");
			return;
		}
		ctrl.login(userLogin, userPassword, path, remember, callbackLoginFailed);
	};

	const callbackLoginFailed = () => {
		setError("로그인에 실패하였습니다.");
	};

	return (
		<div className="container mt-60">
			<Row className="justify-content-center">
				<Col align="center">
					<StyledForm
						onSubmit={e => {
							login(e);
						}}
					>
						<Text h5 className="mb-40">
							{findUserLogin ? "아이디 찾기 완료" : "B2B 강의로그인"}
						</Text>
						{findUserLogin && (
							<FindIdContainer className="mt-40 mb-40">
								<Text p2 fontWeight={500} lineHeight={1.5} className="d-block">
									회원님께서 등록하신 아이디는
								</Text>
								<Text p2 fontWeight={500} lineHeight={1.5} className="d-inline" primary>
									{findUserLogin}
								</Text>
								<Text p2 fontWeight={500} lineHeight={1.5} className="d-inline">
									입니다.
								</Text>
							</FindIdContainer>
						)}
						<Text p3 fontWeight={300} className="mb-10">
							아이디
						</Text>
						<FormControl
							type="text"
							placeholder="아이디 입력"
							className="w-100"
							onChange={event => setUserLogin(event.currentTarget.value)}
							onKeyDown={event => {
								if (event.key == "Enter") login(event);
							}}
						/>
						<Text p3 fontWeight={300} className="mb-10">
							비밀번호
						</Text>
						<FormControl
							type="password"
							autoComplete="on"
							placeholder="••••••••"
							onKeyDown={event => {
								if (event.key == "Enter") login(event);
							}}
							onChange={event => setUserPassword(event.currentTarget.value)}
							className="w-100 mb-10"
						/>
						<Checkbox
							label="로그인 유지하기"
							name="remember"
							fontWeight={300}
							checked={remember}
							onChange={value => setRemember(value)}
						/>
						{error && (
							<div className="mt-10 mb-10">
								<Text p3 className="text-danger">
									{error}
								</Text>
							</div>
						)}
						<Button
							className="w-100 mt-40"
							primary
							size="large"
							onClick={e => {
								login(e);
							}}
						>
							로그인
						</Button>
						<Row className="mt-10">
							<Col>
								<Text p3 underline cursor link={`/user/find?path=${path}`}>
									아이디/비밀번호 찾기
								</Text>
							</Col>
						</Row>
					</StyledForm>
				</Col>
			</Row>
		</div>
	);
};

const FindIdContainer = styled.div`
	border: 0.063rem solid ${({ theme }) => theme.colors.primary};
	text-align: center;
	padding: 12px 20px 12px 20px;
`;

const StyledForm = styled.form`
	max-width: 378px;
`;

export default OrganizationLogin;
