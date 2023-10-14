import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";

import useSizeDetector from "@hooks/useSizeDetector";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const UserTypeBox = ({ image, title, text, goTo }) => {
	const [mouseInside, setMouseInside] = useState(false);
	const SizeDetector = useSizeDetector();

	const mouseEnter = () => {
		setMouseInside(true);
	};

	const mouseLeave = () => {
		setMouseInside(false);
	};

	const renderDesktop = () => {
		return (
			<StyledRowBox onClick={goTo} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
				<Col md={1} />
				<Col md={5} className="align-self-center">
					<StyledUserTypeImg src={image} />
				</Col>
				<Col xs={5} md={6} className="align-self-center">
					<Row>
						<NoPaddingCol xs={12} md={9}>
							<TitleText h6 fontWeight={700}>
								{title}
							</TitleText>
							{text()}
						</NoPaddingCol>
						<ButtonCol md={3} className="align-self-center">
							<Button circle hover={mouseInside}>
								<ArrowForwardIcon />
							</Button>
						</ButtonCol>
					</Row>
				</Col>
			</StyledRowBox>
		);
	};

	const renderMobile = () => {
		return (
			<StyledRowBox onClick={goTo} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
				<MobileLeftContainer>
					<StyledUserTypeMobileImg src={image} />
				</MobileLeftContainer>
				<MobileRightContainer>
					<TitleText h6 fontWeight={700}>
						{title}
					</TitleText>
					{text()}
				</MobileRightContainer>
			</StyledRowBox>
		);
	};

	return (
		<React.Fragment>
			<SizeDetector.Desktop>{renderDesktop()}</SizeDetector.Desktop>
			<SizeDetector.Mobile>{renderMobile()}</SizeDetector.Mobile>
		</React.Fragment>
	);
};

const TitleText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1.25rem;
		margin-bottom: 0.375rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		margin-bottom: 1.25rem;
	}
`;

const StyledRowBox = styled.div`
	border: 0.125rem solid ${({ theme }) => theme.colors.gray};
	cursor: pointer;
	&:hover {
		border: 0.125rem solid ${({ theme }) => theme.colors.primary};
	}
	@media only screen and (max-width: 767.98px) {
		max-width: 100%;
	}
	@media only screen and (min-width: 768px) {
		display: flex;
		justify-content: center;
		border-radius: 6.25rem;
		min-height: 12.5rem;
		width: 36.375rem;
	}
	width: 100%;
`;

const StyledUserTypeImg = styled.img`
	max-width: 13.479rem;
	max-height: 12.5rem;
`;

const StyledUserTypeMobileImg = styled.img`
	max-width: 6.875rem;
	max-height: 6.25rem;
`;

const NoPaddingCol = styled(Col)`
	@media only screen and (max-width: 767.98px) {
		padding-left: 0;
		padding-right: 0;
	}
	@media only screen and (min-width: 768px) {
	}
`;

const ButtonCol = styled(Col)`
	padding-left: 0;
	padding-right: 0;
	padding: 0rem 2rem 0rem 0.938rem;
`;

const MobileLeftContainer = styled.div`
	display: inline-block;
	width: 110px;
	height: 100px;
	margin: 8px 12px;
`;

const MobileRightContainer = styled.div`
	display: inline-block;
	width: calc(100% - 150px);
	margin-right: 16px;
`;

export default UserTypeBox;
