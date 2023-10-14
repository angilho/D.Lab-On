import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";

import useSizeDetector from "@hooks/useSizeDetector";

import InfoBox from "../../components/InfoBox";

import * as ctrl from "./index.ctrl";

const UserFindPasswordByEmail = () => {
	const history = useHistory();
	const [email, setEmail] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [completed, setCompleted] = useState(false);
	const SizeDetector = useSizeDetector();

	const onClickSendEmailBtn = () => {
		if (email) {
			setDisabled(true);
			ctrl.passwordForgot(
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

	return (
		<div className="container">
			<Row className="justify-content-center">
				<Col md={4}>
					<Text h5 className={SizeDetector.isDesktop ? "mt-60 mb-40" : "mt-40 mb-10"}>
						이메일로 비밀번호 찾기
					</Text>
					<Text fontWeight={500} fontSize={1} lineHeight={1.75}>
						디랩온에 등록하신 이메일을 입력해 주세요.
					</Text>
					<div>
						<Text fontWeight={500} fontSize={1} lineHeight={1.75} underline className="d-inline">
							비밀번호를 재설정 하실 수 있는 링크
						</Text>
						<Text fontWeight={500} fontSize={1} lineHeight={1.75} className="d-inline">
							를 전송해드립니다.
						</Text>
					</div>
					<Text fontWeight={500} fontSize={1} lineHeight={1.75} className="mt-40">
						디랩온은 회원의 개인정보 보호를 위하여 비밀번호를
					</Text>
					<Text fontWeight={500} fontSize={1} lineHeight={1.75}>
						이메일로 보내드리지 않습니다.
					</Text>

					<FormLabel className="mt-40 mb-10">
						<Text
							fontSize={SizeDetector.isDesktop ? 1 : 0.875}
							lineHeight={SizeDetector.isDesktop ? 1.75 : 1.438}
						>
							가입한 이메일 주소
						</Text>
					</FormLabel>
					<FormControl
						className="w-100"
						type="email"
						placeholder="example@email.com"
						value={email}
						onChange={event => setEmail(event.currentTarget.value)}
					/>
					<Button
						size="large"
						primary
						disabled={disabled}
						className="w-100 mt-40"
						onClick={onClickSendEmailBtn}
					>
						비밀번호 재전송 링크 보내기
					</Button>
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

export default UserFindPasswordByEmail;
