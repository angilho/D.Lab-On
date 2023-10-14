import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import Text from "@components/elements/Text";
import UserTypeBox from "../components/UserTypeBox";
import useSizeDetector from "@hooks/useSizeDetector";

import StudentImg from "@images/register/userType/student.png";

const ChildConfirm = () => {
	const history = useHistory();
	const location = useLocation();
	const SizeDetector = useSizeDetector();

	useState(() => {
		if (!userInfo.id) {
			history.push({ pathname: "/" });
			return;
		}
	}, []);

	const renderGeneralText = () => {
		return (
			<React.Fragment>
				<Text p3 className="text-left">
					자녀를 지금 등록하겠습니다.
				</Text>
			</React.Fragment>
		);
	};

	const onClickGeneralType = () => {
		history.push({
			pathname: `/register/user/${userInfo.id}/child`
		});
	};

	return (
		<div className="container">
			<Row className="justify-content-center">
				<Col>
					<Row className="mt-60">
						<Col>
							<Text h5 className={SizeDetector.isDesktop ? "justify-content-center" : ""}>
								자녀(학생 회원) 등록
							</Text>
						</Col>
					</Row>
					<Row className="mt-20">
						<Col>
							<Text
								p2
								className={SizeDetector.isDesktop ? "justify-content-center" : ""}
								fontWeight={SizeDetector.isDesktop ? 500 : 0}
							>
								한번 학생 회원 등록이 완료되면 학부모 회원의
							</Text>
							<Text
								p2
								className={SizeDetector.isDesktop ? "justify-content-center" : ""}
								fontWeight={SizeDetector.isDesktop ? 500 : 0}
							>
								로그인 없이도 디랩온 서비스를 이용할 수 있습니다.
							</Text>
						</Col>
					</Row>
					<Row className="mt-40">
						<Col align="center">
							<UserTypeBox
								image={StudentImg}
								title={"지금 등록하기"}
								text={renderGeneralText}
								goTo={onClickGeneralType}
							/>
						</Col>
					</Row>
					<Row className="mt-20 justify-content-center">
						<SizeDetector.Desktop>
							<Col md={3} />
						</SizeDetector.Desktop>

						<Col xs={7} md={3}>
							<Text p3>홈페이지 먼저 둘러보시겠어요?</Text>
						</Col>
						<Col xs={5} md={2}>
							<Text p3 link={"/"} underline cursor className="justify-content-end">
								나중에 등록하기
							</Text>
						</Col>
						<SizeDetector.Desktop>
							<Col md={3} />
						</SizeDetector.Desktop>
					</Row>
				</Col>
			</Row>
		</div>
	);
};

export default ChildConfirm;
