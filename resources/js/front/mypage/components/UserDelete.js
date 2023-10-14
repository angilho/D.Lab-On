import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";
import Checkbox from "@components/elements/Checkbox";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import * as ctrl from "./UserDelete.ctrl";

const UserDelete = props => {
	const history = useHistory();

	const [title, setTitle] = useState(props.title);
	const [stage, setStage] = useState(0);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState(false);

	useEffect(() => {
		if (!userInfo.id) history.goBack();
	}, []);

	const onClickNextBtn = e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		ctrl.checkUser(email, password, callbackCheckUser);
	};

	const onClickDeleteUser = () => {
		if (!confirm) {
			alert("안내사항에 동의해 주세요.");
			return;
		}
		ctrl.deleteUser(userInfo.id, callbackDeleteUser);
	};

	const callbackDeleteUser = res => {
		if (res) {
			history.push({ pathname: "/user/delete/complete" });
		}
	};

	const callbackCheckUser = res => {
		if (res) {
			setStage(1);
			setTitle("회원 정보 및 이용기록 삭제 안내");
		} else {
			alert("인증에 실패하였습니다.");
		}
	};

	const renderStage0 = () => {
		return (
			<form onSubmit={onClickNextBtn}>
				<Row>
					<Col>
						<FormLabel required>이메일</FormLabel>
						<FormControl
							type="text"
							placeholder="nomail@dlab.com"
							className="w-100"
							name="email"
							value={email}
							onChange={event => setEmail(event.currentTarget.value)}
						/>
						<FormLabel required>비밀번호</FormLabel>
						<FormControl
							type="password"
							placeholder="••••••••"
							className="w-100"
							name="password"
							autoComplete="on"
							value={password}
							onChange={event => setPassword(event.currentTarget.value)}
						/>
						<Text p3 primary>
							<InfoRoundedIcon />
							본인 확인을 위하여 다시 한 번 비밀번호를 입력해주세요.
						</Text>
					</Col>
				</Row>
				<Row className="mt-20">
					<Col>
						<Button primary size="large" className="w-100" onClick={onClickNextBtn}>
							다음
						</Button>
					</Col>
				</Row>
			</form>
		);
	};

	const renderStage1 = () => {
		return (
			<React.Fragment>
				<Row>
					<Col>
						<Text p2>- 결제 및 수강 신청 내역</Text>
						<Text p2>- 등록 자녀 정보</Text>

						<Text h5 className="mt-40">
							탈퇴 후에는 개인의 데이터를
						</Text>
						<Text h5 className="mb-40">
							복구할 수 없습니다.
						</Text>

						<Checkbox
							label="안내 사항을 모두 확인하였으며, 이에 동의합니다."
							name="confirm"
							onChange={value => setConfirm(value)}
							checked={confirm}
						/>
					</Col>
				</Row>

				<Row className="mt-40">
					<Col>
						<Text p3 primary>
							<InfoRoundedIcon />
							탈퇴 후 회원님의 디랩온 이용 정보가 모두 삭제되어 복구 불가능하니 신중하게 결정해 주시기
							바랍니다.
						</Text>
						<Button
							className="mt-10"
							primary
							size="large"
							style={{
								width: "23.75rem"
							}}
							onClick={onClickDeleteUser}
							disabled={!confirm}
						>
							탈퇴하기
						</Button>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<Row>
				<Col>
					<Text h5>{title}</Text>
				</Col>
			</Row>
			<Row className="mt-40">
				<Col>
					{stage === 0 && renderStage0()}
					{stage === 1 && renderStage1()}
				</Col>
			</Row>
		</React.Fragment>
	);
};

export default UserDelete;
