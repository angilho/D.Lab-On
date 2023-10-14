import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import TextAnchor from "@components/elements/TextAnchor";

import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";
import Separator from "@components/elements/Separator";

import UserCartForm from "../cart/components/UserCartForm";
import UserPaymentList from "./components/UserPaymentList";
import PaymentTable from "./components/PaymentTable";

import PaymentStatus from "@constants/PaymentStatus";

import usePaymentHandler from "@hooks/usePaymentHandler";
import useSizeDetector from "@hooks/useSizeDetector";

import WaveImage from "@images/curriculum/wave.png";
import ParentImage from "@images/payment/parent.png";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";
import Checkbox from "@components/elements/Checkbox";

const Payment = ({ payment_id }) => {
	const history = useHistory();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const SizeDetector = useSizeDetector();
	const [paymentId, setPaymentId] = useState(payment_id);
	const paymentHandler = usePaymentHandler({
		userId: userInfo.id,
		paymentId: paymentId
	});
	const [couponCode, setCouponCode] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("card");
	const [privacy, setPrivacy] = useState(false);
	const [couponList, setCouponList] = useState([]);

	useEffect(() => {
		if (!userInfo.id) history.push({ pathname: "/login" });

		//모바일 결제 실패 / 성공 시 params로 데이터가 들어온다.
		mobilePaymentRequest();
		ctrl.getUserCoupons(userInfo.id, setUserCouponList);
	}, []);

	useEffect(() => {
		//payment -> payment/:id/success로 오는 경우에 대한 처리를 위함.
		if (location.state && location.state.payment_id) setPaymentId(location.state.payment_id);
	}, [location.state]);

	const onClickPayment = () => {
		ctrl.createPayment(paymentHandler.coupon, paymentMethod, paymentHandler.cartResult, callbackCreatePayment);
	};

	//모바일에서 결제 완료 후 redirect 되는 경우인지 체크한다.
	const mobilePaymentRequest = () => {
		let merchantUid = query.get("merchant_uid");
		let impUid = query.get("imp_uid");
		let impSuccess = query.get("imp_success") ? query.get("imp_success") === "true" : false;
		let errorMsg = query.get("error_msg");

		if (merchantUid && impUid) {
			ctrl.paymentCompleteMobile(userInfo.id, merchantUid, impUid, impSuccess, errorMsg, callbackCreatePayment);
		}
	};

	const callbackCreatePayment = payment => {
		if (payment.id) {
			history.push({
				pathname: `/payment/${payment.id}/success`,
				state: {
					payment_id: payment.id
				}
			});
		}
	};

	const isPaymentAvailable = () => {
		if (!privacy) return false;

		return true;
	};

	const setUserCouponList = coupons => {
		setCouponList(coupons);
	};

	const renderTitle = text => {
		return (
			<React.Fragment>
				<SizeDetector.Desktop>
					<Text p1 fontWeight={500} fontSize={1.125}>
						{text}
					</Text>
				</SizeDetector.Desktop>
				<SizeDetector.Mobile>
					<Text h3 fontWeight={500} fontSize={1}>
						{text}
					</Text>
				</SizeDetector.Mobile>
			</React.Fragment>
		);
	};

	const renderPaymentRequest = () => {
		let isCard = paymentMethod === "card";

		return (
			<React.Fragment>
				<Separator />
				<Row className="mb-20">
					<Col>
						<Text primary h4>
							결제하기
						</Text>
					</Col>
				</Row>
				<Row xs={1} md={2}>
					{paymentHandler.paymentPrice !== 0 ? (
						<Col xs={{ order: 2 }} md={{ order: 1 }}>
							<Row className={!SizeDetector.isDesktop ? "mt-10" : null}>
								<Col>{renderTitle("결제방식 선택")}</Col>
							</Row>
							<Row className="mt-20">
								<Col className={SizeDetector.isDesktop ? "pr-10" : "pr-6"}>
									<CardSelectButton
										primary={isCard}
										secondary={!isCard}
										className="h-100"
										onClick={() => setPaymentMethod("card")}
									>
										<Text fontSize={1.125} fontWeight={400} className="justify-content-center">
											신용카드
										</Text>
									</CardSelectButton>
								</Col>
								<Col className={SizeDetector.isDesktop ? "pl-10" : "pl-6"}>
									<CardSelectButton
										primary={!isCard}
										secondary={isCard}
										onClick={() => setPaymentMethod("vbank")}
									>
										<Text fontSize={1.125} fontWeight={400} className="justify-content-center">
											가상계좌
										</Text>
									</CardSelectButton>
								</Col>
							</Row>
						</Col>
					) : (
						<Col xs={{ order: 2 }} md={{ order: 1 }}></Col>
					)}
					<MobileMarginCol xs={{ order: 1 }} md={{ order: 1 }}>
						<UserInfoRow className={SizeDetector.isDesktop ? "mb-20" : "mb-10"}>
							<Col>{renderTitle("신청자 정보")}</Col>
							<Col className="align-self-center">
								<Text
									p1
									fontWeight={500}
									fontSize={!SizeDetector.isDesktop ? 0.875 : null}
									underline
									link="/mypage"
									className="justify-content-end"
								>
									정보 수정
								</Text>
							</Col>
						</UserInfoRow>
						<UserInfoRow>
							<Col className="align-self-center">
								<Text p1 fontWeight={!SizeDetector.isDesktop ? 500 : null}>
									이메일
								</Text>
							</Col>
							<Col>
								<Text
									p2
									fontWeight={500}
									fontSize={!SizeDetector.isDesktop ? 0.75 : null}
									className="justify-content-end"
								>
									{paymentHandler.cartResult.email}
								</Text>
							</Col>
						</UserInfoRow>
						<UserInfoRow>
							<Col>
								<UserInfoSeparator />
							</Col>
						</UserInfoRow>

						<UserInfoRow>
							<Col className="align-self-center">
								<Text p1 fontWeight={!SizeDetector.isDesktop ? 500 : null}>
									이름
								</Text>
							</Col>
							<Col>
								<Text
									p2
									fontWeight={500}
									fontSize={!SizeDetector.isDesktop ? 0.75 : null}
									className="justify-content-end"
								>
									{paymentHandler.cartResult.name}
								</Text>
							</Col>
						</UserInfoRow>
						<UserInfoRow>
							<Col>
								<UserInfoSeparator />
							</Col>
						</UserInfoRow>
						<UserInfoRow>
							<Col className="align-self-center">
								<Text p1 fontWeight={!SizeDetector.isDesktop ? 500 : null}>
									휴대폰 번호
								</Text>
							</Col>
							<Col>
								<Text
									p2
									fontWeight={500}
									fontSize={!SizeDetector.isDesktop ? 0.75 : null}
									className="justify-content-end"
								>
									{paymentHandler.cartResult.phone}
								</Text>
							</Col>
						</UserInfoRow>
						<SizeDetector.Mobile>
							<UserInfoRow>
								<Col>
									<UserInfoSeparator />
								</Col>
							</UserInfoRow>
						</SizeDetector.Mobile>
					</MobileMarginCol>
				</Row>
				{paymentHandler.paymentPrice !== 0 && (
					<Row className={SizeDetector.isDesktop ? "mt-40" : "mt-20"}>
						<Col>
							{renderTitle("쿠폰 등록하기")}
							<Row className={SizeDetector.isDesktop ? "mt-20" : "mt-10"}>
								<Col md={10} className={SizeDetector.isDesktop ? "pr-10" : "mb-12"}>
									<FormControl
										className="w-100 mb-0"
										type="text"
										placeholder="할인 쿠폰 코드를 입력해 주세요."
										value={couponCode}
										onChange={e => setCouponCode(e.currentTarget.value)}
										disabled={paymentHandler.couponActivated}
									/>
								</Col>
								<Col md={2} className={SizeDetector.isDesktop ? "pl-10" : ""}>
									<Button
										primary
										size="large"
										className="w-100"
										disabled={paymentHandler.couponActivated}
										onClick={() => paymentHandler.checkCoupon(couponCode)}
									>
										<SizeDetector.Desktop>적용하기</SizeDetector.Desktop>
										<SizeDetector.Mobile>
											<Text fontSize={1.125} className="justify-content-center">
												적용하기
											</Text>
										</SizeDetector.Mobile>
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				)}
				{paymentHandler.paymentPrice !== 0 && (
					<Row className={SizeDetector.isDesktop ? "mt-40" : "mt-20"}>
						<Col>
							{renderTitle("내 쿠폰 적용")}
							<Row className={SizeDetector.isDesktop ? "mt-20" : "mt-10"}>
								<Col md={6} className={SizeDetector.isDesktop ? "pr-10" : "mb-12"}>
									<FormControl
										className="w-100 p-0 m-0"
										as="select"
										onChange={e => setCouponCode(e.target.value)}
										disabled={paymentHandler.couponActivated}
									>
										<option value={""}>내 쿠폰 적용 안함</option>
										{couponList &&
											couponList.map((data, idx) => {
												var coupon = data.coupon;
												return (
													<option value={coupon.code} key={idx}>
														{`${coupon.name} / ${util.getCouponValueStr(coupon)} / ~
														${util.getFormatDate(coupon.end_at)}`}
													</option>
												);
											})}
									</FormControl>
								</Col>
							</Row>
						</Col>
					</Row>
				)}
				<Row className={SizeDetector.isDesktop ? "mt-40 mb-20" : "mt-20"}>
					<Col>{renderTitle("최종 결제 정보")}</Col>
				</Row>

				<PaymentTable
					price={paymentHandler.totalPrice}
					discountPrice={paymentHandler.totalDiscountPrice}
					paymentPrice={paymentHandler.paymentPrice}
				/>
				<Row className="mt-10">
					<Col>
						<SizeDetector.Desktop>
							<Checkbox
								checked={privacy}
								className="d-inline"
								onChange={value => {
									setPrivacy(value);
								}}
								name="privay"
							>
								<TextAnchor
									p2
									underline
									fontWeight={600}
									className="d-inline ml-8"
									target="_blank"
									href={`/static/policy/privacy_statement.html?v=${appVersion}`}
								>
									개인정보 수집 이용 및 제3자 제공 동의
								</TextAnchor>

								<Text p2 className="d-inline" fontWeight={!SizeDetector.isDesktop ? 200 : null}>
									&nbsp;및&nbsp;
								</Text>
								<TextAnchor
									p2
									underline
									fontWeight={600}
									className="d-inline"
									target="_blank"
									href={`/static/policy/refund_policy.html?v=${appVersion}`}
								>
									취소 및 환불 규정
								</TextAnchor>
								<Text p2 className="d-inline" fontWeight={!SizeDetector.isDesktop ? 200 : null}>
									에 동의합니다.(필수)
								</Text>
							</Checkbox>
						</SizeDetector.Desktop>
						<SizeDetector.Mobile>
							<div>
								<Checkbox
									checked={privacy}
									onChange={value => {
										setPrivacy(value);
									}}
									name="privay"
								>
									<div className="ml-8">
										<TextAnchor
											p2
											underline
											fontWeight={600}
											className="d-inline"
											target="_blank"
											href={`/static/policy/privacy_statement.html?v=${appVersion}`}
										>
											개인정보 수집 이용 및 제3자 제공 동의
										</TextAnchor>
										<Text p2 className="d-inline" fontWeight={!SizeDetector.isDesktop ? 200 : null}>
											&nbsp;및&nbsp;
										</Text>
										<TextAnchor
											p2
											underline
											fontWeight={600}
											className="d-inline"
											target="_blank"
											href={`/static/policy/refund_policy.html?v=${appVersion}`}
										>
											취소 및 환불 규정
										</TextAnchor>
										<Text p2 className="d-inline" fontWeight={!SizeDetector.isDesktop ? 200 : null}>
											에 동의합니다.(필수)
										</Text>
									</div>
								</Checkbox>
							</div>
						</SizeDetector.Mobile>
					</Col>
				</Row>
				<SizeDetector.Desktop>
					<Row className="mt-16" align="right">
						<Col>
							<Button
								primary
								size="large"
								className="w-10"
								minWidth={13.438}
								onClick={onClickPayment}
								disabled={!isPaymentAvailable()}
							>
								{`${
									paymentHandler.paymentPrice > 0 ? paymentHandler.paymentPrice.toLocaleString() : 0
								}원 결제하기`}
							</Button>
						</Col>
					</Row>
				</SizeDetector.Desktop>
			</React.Fragment>
		);
	};

	const renderPaymentSuccess = () => {
		let paymentAt = "";
		let paymentMethodLocale = "";
		let paymentStatus = "";
		let vbankStr = "";
		let totalOrgPrice = 0;
		let totalPaymentPrice = 0;
		if (
			paymentHandler.paymentResult &&
			paymentHandler.paymentResult.payment &&
			paymentHandler.paymentResult.payment[0]
		) {
			if (paymentHandler.paymentResult.payment[0].status !== PaymentStatus.SUCCESS) {
				paymentAt = paymentHandler.paymentResult.payment[0].updated_at;
			} else {
				paymentAt = paymentHandler.paymentResult.payment[0].payment_at;
			}

			paymentMethodLocale = paymentHandler.paymentResult.payment[0].method_str;
			paymentStatus = paymentHandler.paymentResult.payment[0].status_str;
			vbankStr = paymentHandler.paymentResult.payment[0].vbank_str;

			// 전체 금액
			totalOrgPrice = paymentHandler.paymentResult.payment_item.reduce((acc, cur) => {
				return acc + cur.course.price;
			}, 0);
			// 결제 금액
			totalPaymentPrice = paymentHandler.paymentResult.payment[0].total_price;
		}

		return (
			<React.Fragment>
				<PaymentInfoContainer className="mt-20">
					<PaymentPriceInfoRow className={SizeDetector.isDesktop ? "mt-32" : "mt-1_25rem"}>
						<Col md={4}>
							<PaymentInfoTitle p1>정가</PaymentInfoTitle>
						</Col>
						<Col>
							<Text>{`${totalOrgPrice.toLocaleString()}원`}</Text>
						</Col>
					</PaymentPriceInfoRow>
					<PaymentPriceInfoRow>
						<Col md={4}>
							<PaymentInfoTitle p1>특가할인 + 쿠폰적용가</PaymentInfoTitle>
						</Col>
						<Col>
							<Text>{`${(totalPaymentPrice - totalOrgPrice).toLocaleString()}원`}</Text>
						</Col>
					</PaymentPriceInfoRow>
					<PaymentPriceInfoRow className={SizeDetector.isDesktop ? "mb-32" : "mb-1_25rem"}>
						<Col md={4}>
							<PaymentInfoTitle p1>총 결제금액</PaymentInfoTitle>
						</Col>
						<Col>
							<Text>{`${totalPaymentPrice.toLocaleString()}원`}</Text>
						</Col>
					</PaymentPriceInfoRow>
					<PaymentInfoSeparator />

					<PaymentInfoRow>
						<Col md={4}>
							<PaymentInfoTitle p1>결제요청일</PaymentInfoTitle>
						</Col>
						<Col>
							<Text>{paymentAt && util.convertDateTimeStr(paymentAt)}</Text>
						</Col>
					</PaymentInfoRow>
					<PaymentInfoSeparator />

					<PaymentInfoRow>
						<Col md={4}>
							<PaymentInfoTitle p1>결제형태</PaymentInfoTitle>
						</Col>
						<Col md={8}>
							<Text>{paymentMethodLocale}</Text>
						</Col>
					</PaymentInfoRow>
					{vbankStr && (
						<React.Fragment>
							<PaymentInfoSeparator />
							<PaymentInfoRow>
								<Col md={4}>
									<PaymentInfoTitle p1>입금 정보</PaymentInfoTitle>
								</Col>
								<Col md={8}>
									<Text>{`${vbankStr} (예금주: 주식회사 디랩)`}</Text>
								</Col>
							</PaymentInfoRow>
						</React.Fragment>
					)}
					<PaymentInfoSeparator />
					<PaymentInfoRow>
						<Col md={4}>
							<PaymentInfoTitle p1>결제여부</PaymentInfoTitle>
						</Col>
						<Col md={8}>
							<Text>{paymentStatus}</Text>
						</Col>
					</PaymentInfoRow>
					<PaymentInfoSeparator />
					<PaymentInfoRow>
						<Col md={4}>
							<PaymentInfoTitle p1>취소 및 환불기간</PaymentInfoTitle>
						</Col>
						<Col md={8}>
							<Text>
								수강 시작일로부터 7일 이내 환불요청 해주셔야 위약금 없이 환불 가능합니다.&nbsp;
								<TextAnchor href={`/static/policy/refund_policy.html?v=${appVersion}`} target="_new">
									[환불정책 상세보기]
								</TextAnchor>
							</Text>
						</Col>
					</PaymentInfoRow>
				</PaymentInfoContainer>
				<Row className="mt-10">
					<Col>
						<Text p2>{`수강 신청 내역은 [마이페이지>수강내역]에서 확인하실 수 있습니다.`}</Text>
					</Col>
				</Row>
				<Row align="right">
					<Col>
						<SizeDetector.Desktop>
							<Button
								secondary
								size="large"
								minWidth={21.313}
								onClick={() => history.push({ pathname: "/mycodingspace" })}
							>
								DLAB ON! 나의 강의실로 GO!
							</Button>
						</SizeDetector.Desktop>
						<SizeDetector.Mobile>
							<Button
								secondary
								size="large"
								className="fixed-bottom rounded-0 w-100 bg-white"
								onClick={() => history.push({ pathname: "/mycodingspace" })}
							>
								DLAB ON! 나의 강의실로 GO!
							</Button>
						</SizeDetector.Mobile>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<React.Fragment>
				<WaveImg src={WaveImage} />
				<CourseContainer className="container">
					<Row>
						<Col md={6}>
							<Text h4 className="text-white">
								{paymentId ? "수강 신청이 완료되었습니다!" : "구매정보"}
							</Text>
							<SizeDetector.Desktop>
								<Text p1 className="text-white mt-20">
									결제 완료 후, 수강정보를 학부모님 연락처로 보내드리겠습니다 .
								</Text>
							</SizeDetector.Desktop>
							<SizeDetector.Mobile>
								<Text fontWeight={400} fontSize={0.75} className="text-white mt-20">
									결제 완료 후,
								</Text>
								<Text fontWeight={400} fontSize={0.75} className="text-white">
									수강정보를 학부모님 연락처로 보내드리겠습니다 .
								</Text>
							</SizeDetector.Mobile>
						</Col>
						<Col md={6} className={!SizeDetector.isDekstop ? "d-flex justify-content-center" : ""}>
							<ParentImg src={ParentImage} />
						</Col>
					</Row>
					<Row className="mt-40">
						<Col>
							{paymentId ? (
								<UserPaymentList paymentResult={paymentHandler.paymentResult} />
							) : (
								<UserCartForm cartResult={paymentHandler.cartResult} />
							)}
						</Col>
					</Row>
					{paymentId ? renderPaymentSuccess() : renderPaymentRequest()}
				</CourseContainer>
			</React.Fragment>
			{/**결제하기 페이지에서만 모바일일 경우 결제하기 버튼을 아래에 보여준다. */}
			{!paymentId && (
				<SizeDetector.Mobile>
					<Button
						primary
						size="large"
						className="fixed-bottom rounded-0 w-100"
						onClick={onClickPayment}
						disabled={!isPaymentAvailable()}
					>
						{`${paymentHandler.paymentPrice.toLocaleString()}원 결제하기`}
					</Button>
				</SizeDetector.Mobile>
			)}
		</React.Fragment>
	);
};

const CourseContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding-top: 2.5rem;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 3.75rem; //Top Menu 3.75rem + 마진 3.75rem;
	}
	background-color: transparent;
`;

const CardSelectButton = styled(Button)`
	height: 9.938rem;
	width: 100%;
`;

const MobileMarginCol = styled(Col)`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1.25rem;
	}
`;

const UserInfoRow = styled(Row)`
	@media only screen and (min-width: 768px) {
		max-width: 525.5px;
		display: flex;

		margin-left: auto;
		margin-right: auto;
	}
`;

const UserInfoSeparator = styled.hr`
	@media only screen and (min-width: 768px) {
		max-width: 525.5px;
		display: flex;
		margin-left: auto;
		margin-right: auto;
	}
	margin-top: 16px;
	margin-bottom: 16px;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const PaymentInfoSeparator = styled.hr`
	margin-left: 2.5rem;
	margin-right: 2.5rem;
	margin-top: 0rem;
	margin-bottom: 0rem;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const PaymentInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	border: 0.063rem solid ${({ theme }) => theme.colors.gray};
`;

const PaymentPriceInfoRow = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		margin: 0.5rem 1.25rem 0 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		margin: 0.5rem 2rem 0 2rem;
	}
`;

const PaymentInfoRow = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		margin: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		margin: 2rem;
	}
`;

const PaymentInfoTitle = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		margin-bottom: 0.125rem;
	}
`;

const WaveImg = styled.img`
	position: absolute;
	width: 100%;
	@media only screen and (max-width: 767.98px) {
		height: 22.5rem;
	}
	@media only screen and (min-width: 768px) {
		height: 21.563rem;
	}
`;

const ParentImg = styled.img`
	@media only screen and (max-width: 767.98px) {
		margin-bottom: -120px;
		max-height: 248px;
		max-width: 272.8px;
	}
	@media only screen and (min-width: 768px) {
		position: absolute;
		left: 25%;
		top: -6.25rem;
		max-width: 23.925rem;
		max-height: 21.75rem;
	}
`;

export default Payment;
