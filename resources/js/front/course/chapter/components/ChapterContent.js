import React from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import useSizeDetector from "@hooks/useSizeDetector";
import Text from "@components/elements/Text";
import TurtleImage from "@images/mycodingspace/codingspace_turtle.png";

const ChapterContent = ({ title, renderFunction }) => {
	const SizeDetector = useSizeDetector();
	return (
		<ContentContainer>
			<Row>
				<Col>
					<TitleText primary h5>
						{title}
					</TitleText>
				</Col>
			</Row>
			<SizeDetector.Desktop>
				<TurtleImg src={TurtleImage} />
			</SizeDetector.Desktop>
			{renderFunction()}
		</ContentContainer>
	);
};

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	border: 0.063rem solid ${({ theme }) => theme.colors.gray};
	background-color: ${({ theme }) => theme.colors.white};
	& + & {
		@media only screen and (max-width: 767.98px) {
			margin-top: 1.25rem;
		}
		@media only screen and (min-width: 768px) {
			margin-top: 1.25rem;
		}
	}
`;

const TitleText = styled(Text)`
	background-color: ${({ theme }) => `${theme.colors.primary}20`};
	font-weight: 700;
	@media only screen and (max-width: 767.98px) {
		padding-left: 1rem;
		padding-top: 0.625rem;
		padding-bottom: 0.625rem;
	}
	@media only screen and (min-width: 768px) {
		padding-left: 1.5rem;
		padding-top: 1.25rem;
		padding-bottom: 1.25rem;
	}
`;

const TurtleImg = styled.img`
	position: absolute;
	right: 1.25rem;
	margin-top: -15rem;
	width: 27.5rem;
	height: 23.577rem;
`;

export default ChapterContent;
