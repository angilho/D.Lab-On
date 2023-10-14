import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Text from "@components/elements/Text";
import UserTypeBox from "../components/UserTypeBox";
import useSizeDetector from "@hooks/useSizeDetector";

import GeneralImg from "@images/register/userType/general.png";
import StudentImg from "@images/register/userType/student.png";

const UserTypeConfirm = () => {
	const history = useHistory();
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		if (amplitude) amplitude.getInstance().logEvent("Join");
	}, []);

	const renderGeneralText = () => {
		return (
			<React.Fragment>
				<SizeDetector.Desktop>
					<Text p3 fontWeight={300} className="text-left">
						만 14세 미만 자녀 학생가입은
						<br />
						학부모 회원가입 시 자녀 등록
						<br />
						또는 학부모 계정으로 로그인 후<br />
						자녀추가로 가능합니다.
					</Text>
				</SizeDetector.Desktop>
				<SizeDetector.Mobile>
					<Text fontWeight={300} fontSize={0.688} lineHeight={1} className="text-left mb-20">
						만 14세 미만 자녀 학생가입은 학부모 회원가입 시 자녀 등록 또는 학부모 계정으로 로그인 후
						자녀추가로 가능합니다.
					</Text>
				</SizeDetector.Mobile>
			</React.Fragment>
		);
	};

	const renderStudentText = () => {
		return (
			<React.Fragment>
				<SizeDetector.Desktop>
					<Text p3 fontWeight={300} className="text-left">
						만 14세 이상은
						<br />
						학부모 회원가입을 거치지 않고
						<br />
						바로 가입할 수 있습니다.
					</Text>
				</SizeDetector.Desktop>
				<SizeDetector.Mobile>
					<Text fontWeight={300} fontSize={0.688} lineHeight={1} className="text-left mb-20">
						만 14세 이상은 학부모 회원가입을 거치지 않고 바로 가입할 수 있습니다.
					</Text>
				</SizeDetector.Mobile>
			</React.Fragment>
		);
	};

	const onClickGeneralType = () => {
		history.push({
			pathname: "/register/agreement",
			state: {
				registerGeneral: true
			}
		});
	};

	const onClickStudentType = () => {
		history.push({
			pathname: "/register/agreement",
			state: {
				registerGeneral: false
			}
		});
	};

	return (
		<div className="container">
			<SizeDetector.Mobile>
				<Row>
					<Col>
						<TitleText>회원가입</TitleText>
					</Col>
				</Row>
			</SizeDetector.Mobile>
			<UserTypeRow className="justify-content-center">
				<Col align="center">
					<UserTypeBox
						image={GeneralImg}
						title={"일반 / 학부모 회원"}
						text={renderGeneralText}
						goTo={onClickGeneralType}
					/>
				</Col>
			</UserTypeRow>
			<UserTypeRow className="justify-content-center mt-20">
				<Col align="center">
					<UserTypeBox
						image={StudentImg}
						title={"학생(14세 이상)회원"}
						text={renderStudentText}
						goTo={onClickStudentType}
					/>
				</Col>
			</UserTypeRow>
		</div>
	);
};

const TitleText = styled(Text)`
	font-weight: 700;
	font-size: 1.313rem;
	line-height: 2.125rem;
	margin-top: 2.5rem;
	margin-bottom: 1.25rem;
`;

const UserTypeRow = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		margin-top: 0.625rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 3.75rem;
	}
`;

export default UserTypeConfirm;
