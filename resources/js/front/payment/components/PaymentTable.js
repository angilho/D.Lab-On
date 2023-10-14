import React from "react";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";
import Text from "@components/elements/Text";

import useSizeDetector from "@hooks/useSizeDetector";

const PaymentTable = ({ price, discountPrice, paymentPrice }) => {
	const SizeDetector = useSizeDetector();
	return (
		<React.Fragment>
			<Row>
				<Col>
					<BorderContainer>
						<PriceRow className="mt-20 mb-20">
							<Text p1 fontSize={!SizeDetector.isDesktop ? 0.875 : null}>
								정가
							</Text>
							<Text
								h5
								fontWeight={600}
								fontSize={!SizeDetector.isDesktop ? 1 : null}
							>{`${price.toLocaleString()}원`}</Text>
						</PriceRow>
						<Separator />
						<PriceRow className="mt-20 mb-20">
							<Text p1 fontSize={!SizeDetector.isDesktop ? 0.875 : null}>
								특가할인+쿠폰 적용가
							</Text>
							<Text h5 fontWeight={600} fontSize={!SizeDetector.isDesktop ? 1 : null}>{`-${
								discountPrice > price ? price.toLocaleString() : discountPrice.toLocaleString()
							}원`}</Text>
						</PriceRow>
						<TotalPriceRow primary={"true"} className="">
							<Col>
								<PriceRow className="mt-10 mb-10">
									<Text
										primary
										h6
										fontWeight={SizeDetector.isDesktop ? 500 : 400}
										fontSize={!SizeDetector.isDesktop ? 0.875 : null}
										className="text-white"
									>
										총 결제금액
									</Text>
									<Text
										primary
										h4
										className="text-white"
										fontSize={!SizeDetector.isDesktop ? 1.25 : null}
									>
										{`${paymentPrice > 0 ? paymentPrice.toLocaleString() : 0}원`}
									</Text>
								</PriceRow>
							</Col>
						</TotalPriceRow>
					</BorderContainer>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const BorderContainer = styled(Col)`
	border: 0.063rem solid #979797;
`;

const PriceRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const TotalPriceRow = styled(Row)`
	${props =>
		props.primary &&
		css`
			background-color: ${({ theme }) => theme.colors.primary};
		`}
`;

const Separator = styled.hr`
	margin-top: 0.625rem;
	margin-bottom: 0.625rem;
	background-color: ${({ theme }) => theme.colors.gray};
`;

export default PaymentTable;
