import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import PaymentStatus from "@constants/PaymentStatus";
import CourseType from "@constants/CourseType";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import useSizeDetector from "@hooks/useSizeDetector";

import * as ctrl from "./PaymentList.ctrl";
import * as util from "@common/util";

const PaymentList = props => {
	const history = useHistory();
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		if (userInfo.id) {
			let query = {
				"filter[status]": [PaymentStatus.SUCCESS, PaymentStatus.FAIL, PaymentStatus.READY, PaymentStatus.CANCEL]
			};
			ctrl.getPayments(userInfo.id, query, payments => {
				setPayments(payments);
				setLoading(false);
			});
		}
	}, []);

	const onClickDetail = paymentId => {
		let state = {
			sidebarHide: false,
			contentsHide: false
		};
		if (!SizeDetector.isDesktop) state.sidebarHide = true;
		history.push({ pathname: `/mypage/payment/${paymentId}`, state });
	};

	const renderNoPayments = () => {
		return (
			<Row>
				<Col>
					<Text p1>결제 내역이 없습니다.</Text>
					<Text p1>디랩온이 준비한 다양한 수업을 만나보시겠습니까?</Text>
					<Button
						size="large"
						className="mt-40"
						minWidth={14.563}
						primary
						onClick={() => history.push({ pathname: "curriculum" })}
					>
						커리큘럼 살펴보기
						<ArrowForwardRoundedIcon className="ml-20" />
					</Button>
				</Col>
			</Row>
		);
	};

	const renderPayments = () => {
		return payments.map((payment, idx) => {
			return (
				<React.Fragment key={idx}>
					<PaymentContainer>
						{payment.payment_item.map((paymentItem, idx) => {
							let time = util.getCourseTime(paymentItem.course, paymentItem.course_section);
							let showTotal = SizeDetector.isDesktop
								? idx === 0
								: idx === payment.payment_item.length - 1;
							return (
								<PaymentRow xs={1} md={3} key={idx}>
									<Col md={2}>
										<Text
											p1
											fontWeight={700}
											fontSize={!SizeDetector.isDesktop ? 1 : 1.5}
											lineHeight={!SizeDetector.isDesktop ? 1.5 : 1.75}
										>
											{paymentItem.user.name}
										</Text>
									</Col>
									<Col md={6}>
										<Text
											p1
											fontWeight={700}
											fontSize={!SizeDetector.isDesktop ? 1 : 1.5}
											lineHeight={!SizeDetector.isDesktop ? 1.5 : 1.75}
											className={!SizeDetector.isDesktop ? "mt-10" : null}
										>
											{paymentItem.course.name}
										</Text>
										{paymentItem.course.type !== CourseType.VOD && (
											<div className={SizeDetector.isDesktop ? "mt-16" : "mt-8"}>
												<div>
													<Text p1 primary className="d-inline">
														·
													</Text>
													<Text
														p3
														fontWeight={!SizeDetector.isDesktop ? 400 : null}
														className="d-inline"
													>
														기간:
													</Text>
													<Text p3 className="d-inline ml-10">
														{paymentItem.course_section.duration_period_str}
													</Text>
												</div>
												<div>
													<Text p1 primary className="d-inline">
														·
													</Text>
													<Text
														p3
														fontWeight={!SizeDetector.isDesktop ? 400 : null}
														className="d-inline"
													>
														시간:
													</Text>
													<Text p3 className="d-inline ml-10">
														{time}
													</Text>
												</div>
											</div>
										)}
									</Col>
									{showTotal ? (
										<Col align="right">
											<div className={!SizeDetector.isDesktop ? "mt-10" : ""}>
												<Text
													p1
													className="d-inline"
													lineHeight={!SizeDetector.isDesktop ? 1.5 : 1.75}
												>
													총 결제 금액:
												</Text>
												<Text
													h5
													className="d-inline ml-10"
													lineHeight={!SizeDetector.isDesktop ? 1.5 : 1.75}
												>
													{util.addNumberComma(payment.total_price)}원
												</Text>
											</div>
											<Button
												secondary
												className={SizeDetector.isDesktop ? "mt-20" : "mt-20 w-100"}
												onClick={() => onClickDetail(payment.id)}
											>
												자세히 보기
											</Button>
										</Col>
									) : (
										<Col />
									)}
								</PaymentRow>
							);
						})}
					</PaymentContainer>
					<Separator />
				</React.Fragment>
			);
		});
	};

	return (
		<React.Fragment>
			<Row>
				<Col>
					<Text primary h5 className="d-inline">
						{userInfo.name}
					</Text>
					<Text h5 className="d-inline">
						님의 결제내역
					</Text>
				</Col>
			</Row>
			{!loading && payments.length === 0 ? (
				<Row className={SizeDetector.isDesktop ? "mt-40" : "mt-10"}>
					<Col>{renderNoPayments()}</Col>
				</Row>
			) : (
				<React.Fragment>
					<Separator />
					{renderPayments()}
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

const PaymentContainer = styled.div`
	margin-bottom: 0rem;
	padding: 0rem 1.25rem;
`;

const Separator = styled.hr`
	margin-top: 2rem;
	margin-bottom: 2rem;
	background-color: 0.063rem solid ${({ theme }) => theme.colors.gray};
`;

const PaymentRow = styled(Row)`
	& + & {
		margin-top: 1.25rem;
	}
`;

export default PaymentList;
