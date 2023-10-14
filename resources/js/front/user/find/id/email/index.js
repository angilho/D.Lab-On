import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";

import InfoBox from "../../components/InfoBox";

import * as ctrl from "./index.ctrl";

const UserFindIdByEmail = () => {
	const history = useHistory();
	const location = useLocation();
	const [email, setEmail] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [completed, setCompleted] = useState(false);

	const path = location.state?.path;

	const onClickSendEmailBtn = () => {
		if (email) {
			setDisabled(true);
			ctrl.findUserIdByEmail(
				email,
				() => {
					setCompleted(true);
				},
				() => {
					alert("이메일 전송에 실패하였습니다.");
					setDisabled(false);
				}
			);
		} else {
			alert("이메일 주소를 입력하여 주세요.");
			return;
		}
	};

	const onClickLoginBtn = () => {
		history.push({ pathname: path ? `/${path}` : "/login" });
	};

	return (
		<div className="container">
			<Row className="justify-content-center">
				<Col md={4}>
					<Text h5 className="mt-60 mb-40">
						이메일로 아이디 찾기
					</Text>
					<FormLabel className="mb-10">가입한 이메일 주소</FormLabel>
					<FormControl
						className="w-100"
						type="email"
						placeholder="example@email.com"
						value={email}
						onChange={event => setEmail(event.currentTarget.value)}
					/>
					<div>
						{completed ? (
							<Button size="large" primary className="w-100 mt-40" onClick={onClickLoginBtn}>
								로그인
							</Button>
						) : (
							<Button
								size="large"
								disabled={disabled}
								secondary
								className="w-100 mt-40"
								onClick={onClickSendEmailBtn}
							>
								이메일 인증하기
							</Button>
						)}
					</div>
					{completed && (
						<InfoBox>
							<Text p4 primary>
								이메일 전송이 완료되었습니다. 메일함을 확인해 주세요.
							</Text>
							<Text p4 primary>
								메일을 받지 못하신 경우, [스팸 메일함]을 체크해 주세요.
							</Text>
						</InfoBox>
					)}
				</Col>
			</Row>
		</div>
	);
};

export default UserFindIdByEmail;
