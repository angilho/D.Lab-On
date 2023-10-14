import React from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import Text from "@components/elements/Text";

const TotalPriceBox = ({ price }) => {
	return (
		<Row>
			<Col>
				<TotalPriceContainer>
					<PriceGuideText primary p3>
						결제하실 금액:
					</PriceGuideText>
					<TotalPriceText primary h5>
						{`총 ${price.toLocaleString()}원`}
					</TotalPriceText>
				</TotalPriceContainer>
			</Col>
		</Row>
	);
};

const TotalPriceContainer = styled.div`
	display: flex;
	align-items: center;
	flex-start: end;

	border: 0.125rem solid ${({ theme }) => theme.colors.primary};
	border-radius: 4px;

	@media only screen and (max-width: 767.98px) {
		margin-top: 0.75rem;
		height: 4.125rem;
		justify-content: space-between;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 1.25rem;
		height: 5.938rem;
		justify-content: flex-end;
	}
`;

const PriceGuideText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		margin-left: 1.25rem;
		font-size: 0.875rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.125rem;
	}
`;

const TotalPriceText = styled(Text)`
	font-family: BMDOHYEON;
	@media only screen and (max-width: 767.98px) {
		margin-right: 1.25rem;
		font-size: 1.313rem;
		text-align: right;
	}
	@media only screen and (min-width: 768px) {
		margin-left: 2.5rem;
		margin-right: 3.438rem;
		font-size: 2.25rem;
	}
`;

export default TotalPriceBox;
