import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { Row, Col } from "react-bootstrap";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";

import useSizeDetector from "@hooks/useSizeDetector";

import CompleteBackgroundImage from "@images/user/delete/deleteCompleteBackground.png";

const UserDeleteComplete = () => {
	const history = useHistory();
	const SizeDetector = useSizeDetector();

	const goCurriculum = () => {
		history.push({ pathname: "/curriculum" });
	};

	return (
		<div className="container">
			<Row className="justify-content-center align-items-center">
				<Col md={8} className="mt-100">
					<SizeDetector.Desktop>
						<Container src={CompleteBackgroundImage}>
							<Text h5>회원 탈퇴 완료</Text>
							<Text p2 className="mt-40">
								회원 정보가 모두 삭제되었습니다.
							</Text>
							<Text p2>그동안 디랩온을 이용해주셔서 감사합니다.</Text>
							<Text p2 primary>
								다음에 또 만나요!
							</Text>
							<Button
								primary
								minWidth={13.813}
								size="large"
								className="mt-40"
								onClick={event => goCurriculum()}
							>
								디랩온 둘러보기
							</Button>
						</Container>
					</SizeDetector.Desktop>
					<SizeDetector.Mobile>
						<Container className="mt-40">
							<Text h5>회원 탈퇴 완료</Text>
							<Text p2 className="mt-40">
								회원 정보가 모두 삭제되었습니다.
							</Text>
							<Text p2>그동안 디랩온을 이용해주셔서 감사합니다.</Text>
							<Text p2 primary>
								다음에 또 만나요!
							</Text>
							<Button
								primary
								size="large"
								className="mt-40 mb-40 w-100"
								onClick={event => goCurriculum()}
							>
								디랩온 둘러보기
							</Button>
							<div align="center" className="mb-20">
								<BackgroundImage src={CompleteBackgroundImage} />
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
		height: 487px;
		width: 100%;
		padding-top: 2.5rem;
		padding-left: 6.25rem;
	}
	${props =>
		props.src &&
		css`
			background-image: url(${props.src});
			background-size: 819px 487px;
			background-repeat: no-repeat;
			background-position: center;
		`}
`;

const BackgroundImage = styled.img`
	max-height: 280px;
	max-width: 100%;
`;

export default UserDeleteComplete;
