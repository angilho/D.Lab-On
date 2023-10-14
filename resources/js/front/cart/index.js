import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import WaveImage from "@images/course/wave.png";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import Separator from "@components/elements/Separator";

import UserCartForm from "./components/UserCartForm";
import TotalPriceBox from "./components/TotalPriceBox";

import * as api from "@common/api";
import * as ctrl from "./index.ctrl";
import usePaymentHandler from "@hooks/usePaymentHandler";
import useSizeDetector from "@hooks/useSizeDetector";

import BackgroundImage from "@images/cart/bg.png";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

const Cart = props => {
	let history = useHistory();
	const paymentHandler = usePaymentHandler({
		userId: userInfo.id
	});
	const [hasChild, setHasChild] = useState(false);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		let result = paymentHandler.cartResult.children && paymentHandler.cartResult.children.length !== 0;
		if (hasChild != result) setHasChild(!hasChild);
	}, [paymentHandler.cartResult.children]);

	useEffect(() => {
		if (!userInfo.id) history.push({ pathname: "/login" });
	}, []);

	const onClickPayment = async () => {
		if (!paymentHandler.hasCheckedCartItem) {
			alert("선택된 수업이 없습니다.");
			return;
		}
		// 제외하는 아이템은 카트에서 삭제한다.
		await Promise.all(
			paymentHandler.ignoreCartItems.map(ignoreCartItem => {
				return api.deleteCart(ignoreCartItem.user_id, ignoreCartItem.cart_id);
			})
		);
		history.push({
			pathname: "/payment"
		});
	};

	const onClickAddChild = () => {
		history.push({
			pathname: `/register/user/${userInfo.id}/child`
		});
	};

	const onClickCurriculum = () => {
		history.push({
			pathname: "/curriculum"
		});
	};

	/**
	 * 카트의 정보를 제거한다.
	 * @param {} id Cart id
	 */
	const onClickDeleteCartItem = (userId, cartId) => {
		if (confirm("장바구니에서 제거하시겠습니까?")) {
			ctrl.deleteCart(userId, cartId, () => {
				history.go(0);
			});
		}
	};

	/**
	 * 카트의 아이템을 선택한다.
	 */
	const onClickCheckItem = (userId, cartId, checked) => {
		paymentHandler.onCheckCartResult(userId, cartId, checked);
	};

	const renderNoCart = () => {
		return (
			<React.Fragment>
				<Row>
					<Col>
						<Text h5>장바구니</Text>
					</Col>
				</Row>
				<Row>
					<Col>
						<SizeDetector.Desktop>
							<Text p1 className="w-100 mt-20">
								신청된 수업이 없습니다.
							</Text>
							<Text p1>디랩온의 다양한 수업들을 살펴보세요.</Text>
						</SizeDetector.Desktop>
						<SizeDetector.Mobile>
							<Text fontSize={1} fontWeight={500} className={`w-100 mt-20 mb-10`}>
								신청된 수업이 없습니다.
							</Text>
							<Text p2 fontWeight={200}>
								디랩온의 다양한 수업들을 살펴보세요.
							</Text>
						</SizeDetector.Mobile>
					</Col>
				</Row>
				<Row className={SizeDetector.isDesktop ? "mt-40" : "mt-20"}>
					<Col>
						<SizeDetector.Desktop>
							<Button primary size="large" minWidth={12.375} onClick={onClickCurriculum}>
								<Text fontWeight={400} fontSize={1.125} className="d-inline">
									커리큘럼 살펴보기
								</Text>
							</Button>
						</SizeDetector.Desktop>
						<SizeDetector.Mobile>
							<Button primary size="large" className="w-100" onClick={onClickCurriculum}>
								<Text h6 fontWeight={400} fontSize={1.125} className="d-inline">
									커리큘럼 살펴보기
								</Text>
							</Button>
						</SizeDetector.Mobile>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	const renderRecommandCourse = () => {
		return (
			<React.Fragment>
				{!userInfo.is_child && !hasChild ? (
					<React.Fragment>
						<Row>
							<Col>
								<Text h5>추천 수업</Text>
							</Col>
						</Row>
						<Row>
							<Col>
								<SizeDetector.Desktop>
									<Text p1 className="mt-20">
										자녀 정보를 등록해보세요!
									</Text>
									<Text p1>디랩온의 다양한 수업들을 살펴보세요.</Text>
								</SizeDetector.Desktop>
								<SizeDetector.Mobile>
									<Text h6 fontSize={1} fontWeight={500} className="mt-20 mb-10">
										자녀 정보를 등록해보세요!
									</Text>
									<Text p2 fontWeight={200}>
										디랩온의 다양한 수업들을 살펴보세요.
									</Text>
								</SizeDetector.Mobile>
							</Col>
						</Row>
						<Row className={SizeDetector.isDesktop ? "mt-40" : "mt-20"}>
							<Col>
								<SizeDetector.Desktop>
									<Button secondary size="large" minWidth={12.375} onClick={onClickAddChild}>
										<Text fontWeight={400} fontSize={1.125} className="d-inline">
											자녀등록하기
										</Text>
									</Button>
								</SizeDetector.Desktop>
								<SizeDetector.Mobile>
									<Button secondary size="large" className="w-100" onClick={onClickAddChild}>
										<Text h6 fontWeight={400} fontSize={1.125} className="d-inline">
											자녀 등록하기
										</Text>
									</Button>
								</SizeDetector.Mobile>
							</Col>
						</Row>
					</React.Fragment>
				) : null}
			</React.Fragment>
		);
	};

	// 카트 정보를 얻기 전에는 아무것도 출력하지 않는다.
	if (typeof paymentHandler.hasCart === "undefined") return null;

	return (
		<Container isChild={userInfo.is_child} hasChild={hasChild} hasCart={paymentHandler.hasCart}>
			{/** 카트에 담긴 수업이 없을 경우 */}
			{typeof paymentHandler.hasCart !== "undefined" && !paymentHandler.hasCart ? (
				<React.Fragment>
					<CourseContainer className="container">
						{renderNoCart()}
						{!userInfo.is_child && !hasChild && <Separator />}
						{renderRecommandCourse()}
					</CourseContainer>
					{/** 자녀 정보를 등록해보세요! 가 나올때만 일러스트를 그려준다. */}
					{!userInfo.is_child && !hasChild && <BackgroundImg src={BackgroundImage} />}
				</React.Fragment>
			) : (
				<React.Fragment>
					<WaveImg src={WaveImage} />
					<CourseContainer className="container">
						<Row>
							<Col md={12}>
								<SizeDetector.Desktop>
									<Text mainHeader className="text-white">
										우리 아이가 참여할 수업의 날짜, 시간을 정확히 확인해주세요.
									</Text>
								</SizeDetector.Desktop>
								<SizeDetector.Mobile>
									<Text h4 className="text-white">
										우리 아이가 참여할 수업의 날짜,
									</Text>
									<Text h4 className="text-white">
										시간을 정확히 확인해주세요.
									</Text>
								</SizeDetector.Mobile>
							</Col>
						</Row>
						<Row className={SizeDetector.isDektop ? "mt-40" : "mt-20"}>
							<Col>
								<UserCartForm
									cartResult={paymentHandler.cartResult}
									onClickDeleteItem={onClickDeleteCartItem}
									onClickCheckItem={onClickCheckItem}
								/>
								<TotalPriceBox price={paymentHandler.paymentPrice} />
							</Col>
						</Row>
						<Row className={`mt-10 ${!SizeDetector.isDesktop ? "mb-24" : ""}`}>
							<Col>
								<Text p1 className="align-items-center">
									<SizeDetector.Desktop>
										<NotificationsNoneRoundedIcon />
									</SizeDetector.Desktop>
									&nbsp;결제 완료 후, 수강정보를 학부모님 연락처로 보내드리겠습니다 .
								</Text>
							</Col>
						</Row>
						<Row align="right">
							<Col>
								<PaymentButton
									secondary
									size="large"
									minWidth={9.25}
									onClick={() =>
										history.push({
											pathname: "/detail_curriculum"
										})
									}
								>
									수업 추가하기
								</PaymentButton>
								<PaymentButton
									primary
									size="large"
									minWidth={13.438}
									onClick={onClickPayment}
									submit
								>{`${paymentHandler.paymentPrice &&
									paymentHandler.paymentPrice.toLocaleString()}원 결제하기`}</PaymentButton>
							</Col>
						</Row>
						<Separator />
						<Row>
							<Col>{renderRecommandCourse()}</Col>
						</Row>
					</CourseContainer>
				</React.Fragment>
			)}
		</Container>
	);
};

/**
 * 카트 없고 자식 없을때 bg 일러스트 까는것 때문에 스타일 지정
 */
const Container = styled.div`
	${props =>
		(props.isChild || props.hasChild || props.hasCart) &&
		css`
			@media only screen and (max-width: 767.98px) {
				padding-bottom: 6.25rem;
			}
			@media only screen and (min-width: 768px) {
				padding-bottom: 12.5rem;
			}
		`}
`;

const CourseContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding-top: 2.5rem;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 3.75rem; //Top Menu 3.75rem + 마진 3.75rem;
	}
	background-color: transparent;
`;

const WaveImg = styled.img`
	position: absolute;
	width: 100%;
	@media only screen and (max-width: 767.98px) {
		height: 14.125rem;
	}
	@media only screen and (min-width: 768px) {
		height: 21.563rem;
	}
`;

const PaymentButton = styled(Button)`
	@media only screen and (max-width: 767.98px) {
		& + & {
			margin-top: 0.625rem;
			margin-left: 0rem;
		}
		width: 100%;
	}

	@media only screen and (min-width: 768px) {
		& + & {
			margin-left: 1.563rem;
		}
	}

	${props =>
		props.submit &&
		css`
			@media only screen and (max-width: 767.98px) {
				position: fixed;
				bottom: 0;
				background-color: #ff5100;
				left: 0;
				border-radius: 0;
				z-index: 1030;
			}
		`}
`;

const BackgroundImg = styled.img`
	width: 100%;
`;

export default Cart;
