import React from "react";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import WelcomeImg from "@images/register/welcome.png";

import useSizeDetector from "@hooks/useSizeDetector";

const Welcome = ({}) => {
	const SizeDetector = useSizeDetector();
	const goHome = () => {
		window.location.href = "/";
	};

	return (
		<div className="container">
			<Row className="justify-content-center align-items-center">
				<Col md={6}>
					<SizeDetector.Desktop>
						<Container className="mt-100" src={WelcomeImg}>
							<Text h5>회원가입 완료</Text>
							<Text p2 fontWeight={500} className="mt-40">
								디랩온의 회원이 되신 것을 축하합니다.
							</Text>
							<Text p2 fontWeight={500}>
								이제 즐거운 코딩 탐험을 함께 시작해 볼까요?
							</Text>
							<Button
								primary
								minWidth={13.813}
								size="large"
								className="mt-40"
								onClick={event => goHome()}
							>
								디랩온 수업 둘러보기
							</Button>
						</Container>
					</SizeDetector.Desktop>
					<SizeDetector.Mobile>
						<Container className="mt-40">
							<Text h5>회원가입 완료</Text>
							<Text p2 className="mt-40">
								디랩온의 회원이 되신 것을 축하합니다.
							</Text>
							<Text p2>이제 즐거운 코딩 탐험을 함께 시작해 볼까요?</Text>
							<Button primary size="large" className="mt-40 mb-40 w-100" onClick={event => goHome()}>
								디랩온 수업 둘러보기
							</Button>
							<div align="center" className="mb-20">
								<MobileWelcomeImg src={WelcomeImg} />
							</div>
						</Container>
					</SizeDetector.Mobile>
				</Col>
			</Row>
		</div>
	);
};

const Container = styled.div`
	@media only screen and (min-width: 768px) {
		height: 25.563rem;
	}
	${props =>
		props.src &&
		css`
			background-image: url(${props.src});
			background-size: 459px 345px;
			background-repeat: no-repeat;
			background-position: right;
		`}
`;

const MobileWelcomeImg = styled.img`
	max-height: 280px;
	max-width: 100%;
`;

export default Welcome;
