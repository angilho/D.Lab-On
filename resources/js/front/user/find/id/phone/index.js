import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import usePhoneVerificationHandler from "@hooks/usePhoneVerificationHandler";

import * as ctrl from "./index.ctrl";
import * as utils from "@common/util";

const UserFindIdByPhone = () => {
	const history = useHistory();
	const location = useLocation();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [verifyCode, setVerifyCode] = useState("");

	const path = location.state?.path;

	const phoneVerificationHandler = usePhoneVerificationHandler({
		phone: phone,
		verifyCode: verifyCode,
		checkUniqueNumber: false,
		handleConfirm: user => {
			if (user) {
				ctrl.findUserIdByPhone(name, phone, data => {
					if (data.user_login) {
						history.push({
							pathname: path ? `/${path}` : "/login",
							state: {
								findUserLogin: data.user_login
							}
						});
					} else {
						alert("입력하신 정보와 일치하는 정보가 없습니다.");
					}
				});
			}
		}
	});

	return (
		<div className="container">
			<Row className="justify-content-center">
				<Col md={4}>
					<Text h5 className="mt-60 mb-40">
						휴대폰 인증으로 아이디 찾기
					</Text>
					<FormLabel className="mb-10">이름</FormLabel>
					<FormControl
						className="w-100"
						type="text"
						placeholder="이름"
						value={name}
						onChange={event => setName(event.currentTarget.value)}
					/>
					<FormLabel className="mb-10 mt-10">전화번호</FormLabel>
					<FormControl
						className="w-100"
						type="phone"
						placeholder="전화번호"
						maxLength="13"
						value={phone}
						onKeyUp={() => setPhone(utils.toKoreanPhoneNumber(phone))}
						onChange={event => setPhone(event.currentTarget.value)}
					/>
					{phoneVerificationHandler.smsRequest && (
						<div>
							<Text p3 className="mb-10 mt-10">
								인증번호 확인
							</Text>
							<div>
								<FormControl
									className="w-100 d-inline mb-0"
									type="text"
									placeholder="인증번호 6자리"
									value={verifyCode}
									onChange={event => setVerifyCode(event.currentTarget.value)}
								/>
							</div>

							<div className="mt-10">
								<Text p3 className="d-inline">
									인증번호를 받지 못하셨나요?
								</Text>
								<Text
									p3
									underline
									cursor
									className="d-inline float-right"
									onClick={phoneVerificationHandler.sendSmsCode}
								>
									인증번호 재발송
								</Text>
							</div>
						</div>
					)}
					<div>
						{phoneVerificationHandler.smsRequest ? (
							<Button
								size="large"
								primary
								className="w-100 mt-40"
								onClick={phoneVerificationHandler.verifySmsCode}
							>
								본인인증 완료
							</Button>
						) : (
							<Button
								size="large"
								secondary
								className="w-100 mt-40"
								onClick={phoneVerificationHandler.sendSmsCode}
							>
								본인 인증하기
							</Button>
						)}
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default UserFindIdByPhone;
