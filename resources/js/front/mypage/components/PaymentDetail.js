import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";

import PaymentStatus from "@constants/PaymentStatus";
import CourseType from "@constants/CourseType";

import * as ctrl from "./PaymentDetail.ctrl";
import * as util from "@common/util";

const PaymentDetail = ({ payment_id }) => {
	const history = useHistory();
	const [payment, setPayment] = useState({});

	useEffect(() => {
		if (userInfo.id) {
			ctrl.getPayment(userInfo.id, payment_id, payment => {
				if (!payment || payment.length == 0) {
					alert("상세 결제 내역이 없습니다.");
					history.go(1);
					return;
				}
				setPayment(payment);
			});
		}
	}, []);

	const renderPaymentItem = (paymentItem, idx) => {
		let time = util.getCourseTime(paymentItem.course, paymentItem.course_section);
		let paymentAt = "";
		if (
			payment[0].payment[0].status === PaymentStatus.READY ||
			payment[0].payment[0].status === PaymentStatus.CANCEL
		) {
			paymentAt = payment[0].payment[0].updated_at;
		} else {
			paymentAt = payment[0].payment[0].payment_at;
		}
		return (
			<PaymentContainer key={idx}>
				<Row>
					<Col className="mb-20">
						<Text h5>{paymentItem.course.name}</Text>
					</Col>
				</Row>
				{paymentItem.course.type !== CourseType.VOD && (
					<React.Fragment>
						<Row>
							<Col md={2}>
								<Text p3 fontWeight={500}>
									수강 기간
								</Text>
							</Col>
							<Col>
								<Text p3>{paymentItem.course_section.duration_period_str || "-"}</Text>
							</Col>
						</Row>
						<Separator />
						<Row>
							<Col md={2}>
								<Text p3 fontWeight={500}>
									일시 (회차 / 횟수)
								</Text>
							</Col>
							<Col>
								<Text p3>{time || "-"}</Text>
							</Col>
						</Row>
						<Separator />
					</React.Fragment>
				)}
				<Row>
					<Col md={2}>
						<Text p3 fontWeight={500}>
							결제자 명
						</Text>
					</Col>
					<Col>
						<Text p3>{userInfo.name}</Text>
					</Col>
					<Col md={2}>
						<Text p3 fontWeight={500}>
							결제 상태
						</Text>
					</Col>
					<Col>
						<Text p3>{payment[0].payment[0].status_str}</Text>
					</Col>
				</Row>
				<Separator />
				<Row>
					<Col md={2}>
						<Text p3 fontWeight={500}>
							결제 요청일
						</Text>
					</Col>
					<Col>
						<Text p3>{paymentAt && util.getFormatDate(paymentAt)}</Text>
					</Col>
					<Col md={2}>
						<Text p3 fontWeight={500}>
							결제 금액
						</Text>
					</Col>
					<Col>
						<Text p3>{`${util.addNumberComma(payment[0].payment[0].total_price)}원`}</Text>
					</Col>
				</Row>
				{payment[0].payment[0].vbank_str && (
					<React.Fragment>
						<Separator />
						<Row>
							<Col md={2}>
								<Text p3 fontWeight={500}>
									입금 정보
								</Text>
							</Col>
							<Col>
								<Text p3>
									{payment[0].payment[0].vbank_str}
									&nbsp;&nbsp;{"(예금주: 주식회사 디랩)"}
								</Text>
							</Col>
						</Row>
					</React.Fragment>
				)}
				<Separator />
				<Row>
					<Col md={2}>
						<Text p3 fontWeight={500}>
							환불 규정
						</Text>
					</Col>
					<Col>
						<Text p3>수강시작일로부터 7일 이내 환불요청 해주셔야 위약금 없이 환불 가능합니다.</Text>
						<Text
							p3
							underline
							cursor
							onClick={() => window.open(`/static/policy/refund_policy.html?v=${appVersion}`)}
						>
							[환불정책 상세보기]
						</Text>
					</Col>
				</Row>
				<Separator />
				<Row>
					<Col md={2}>
						<Text p3 fontWeight={500}>
							결제 문의
						</Text>
					</Col>
					<Col>
						<Text p3>고객센터: 031-526-9313</Text>
						<Text p3 className="d-inline">
							카카오채널:&nbsp;
						</Text>
						<Text
							p3
							className="d-inline"
							underline
							cursor
							onClick={() => window.open("http://pf.kakao.com/_Zxclls")}
						>
							디랩온 바로가기
						</Text>
						<Text p3 className="d-inline">
							로 문의
						</Text>
					</Col>
				</Row>
			</PaymentContainer>
		);
	};

	const renderPayment = () => {
		return (
			<React.Fragment>
				{/** 조회한 사용자 내역 */}
				{payment[0].payment_item.map((paymentItem, idx) => {
					return renderPaymentItem(paymentItem, idx);
				})}

				{/** 조회한 사용자의 자식 결제 내역 */}
				{payment[0].children.map((child, idx) => {
					return child.payment_item.map((paymentItem, idx) => {
						return renderPaymentItem(paymentItem, idx);
					});
				})}

				<Button className="float-right w-25" secondary size="large" onClick={() => history.goBack()}>
					뒤로 가기
				</Button>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<Row>
				<Col>
					<React.Fragment>
						<Text primary h5 className="d-inline">
							{userInfo.name}
						</Text>
						<Text h5 className="d-inline">
							님의 결제내역
						</Text>
					</React.Fragment>
				</Col>
			</Row>
			{payment.length > 0 && (
				<Row className="mt-40">
					<Col>{renderPayment()}</Col>
				</Row>
			)}
		</React.Fragment>
	);
};

const PaymentContainer = styled.div`
	margin-bottom: 1.25rem;
	padding: 1.25rem;
	border: 0.063rem solid ${({ theme }) => theme.colors.gray};
`;

const Separator = styled.hr`
	margin-top: 1.25rem;
	margin-bottom: 1.25rem;
	background-color: 0.063rem solid ${({ theme }) => theme.colors.gray};
`;

const PaymentRow = styled(Row)`
	& + & {
		margin-top: 1.25rem;
	}
`;

export default PaymentDetail;
