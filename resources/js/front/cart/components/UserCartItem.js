import React from "react";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";

import Text from "@components/elements/Text";
import ProfileImage from "@components/elements/ProfileImage";
import Checkbox from "@components/elements/Checkbox";
import useSizeDetector from "@hooks/useSizeDetector";
import CourseType from "@constants/CourseType";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import * as util from "@common/util";

const UserCartItem = ({
	userId,
	gender,
	userPhone,
	userName,
	userBirthday,
	isChild,
	cartList,
	onClickDeleteItem,
	onClickCheckItem
}) => {
	const SizeDetector = useSizeDetector();
	const renderPriceText = (price, discountPrice) => {
		return <PriceText h5>{`${(price - discountPrice).toLocaleString()}원`}</PriceText>;
	};
	const renderDeleteBtn = cartId => {
		return (
			typeof onClickDeleteItem !== "undefined" && (
				<CartCancelBtn onClick={() => onClickDeleteItem(userId, cartId)}>
					<CloseRoundedIcon style={{ fontSize: SizeDetector.isDesktop ? 36 : 24 }} />
				</CartCancelBtn>
			)
		);
	};

	let birthday = "";
	if (userBirthday) birthday = `${userBirthday.year}. ${userBirthday.month}. ${userBirthday.day}`;
	let name = isChild ? `${userName}학생` : userName;

	return (
		<UserCardContainer>
			<UserCardRowContainer xs={2}>
				<Col md={2} className={SizeDetector.isDesktop ? "align-self-start" : "align-self-start pl-0"}>
					<ProfileImageContainer>
						<ProfileImage user={userInfo} gender={gender || "f"} />
					</ProfileImageContainer>
				</Col>
				<Col md={2} className={SizeDetector.isDesktop ? "" : "pr-0"}>
					<Text fontSize={1.125} className={SizeDetector.isDesktop ? "mb-12" : "mb-8"}>
						{name}
					</Text>

					<Text p4>생일</Text>
					<Text p2 fontWeight={SizeDetector.isDesktop ? 500 : 0}>
						{birthday}
					</Text>

					<Text p4 className={SizeDetector.isDesktop ? "mt-10" : "mt-4"}>
						전화번호
					</Text>
					<Text p2 fontWeight={SizeDetector.isDesktop ? 500 : 0}>
						{userPhone}
					</Text>
				</Col>
				<CourseInfoCol xs={12} md={8}>
					{cartList &&
						cartList.map((cart, idx) => {
							let time = util.getCourseTime(cart.course, cart.course_section);

							return (
								<CartItemDiv key={idx}>
									<CartItemRow>
										<Col
											md={9}
											className={`${SizeDetector.isDesktop ? "ml-36 pl-0" : "pl-0 pr-0"}`}
										>
											<div className="d-flex justify-content-start">
												{onClickCheckItem ? (
													<Checkbox
														className="mr-10"
														onChange={value =>
															onClickCheckItem(cart.user_id, cart.id, value)
														}
														checked={cart.selected}
													>
														<Text h6 fontWeight={700}>
															{cart.course.name || "-"}
														</Text>
													</Checkbox>
												) : (
													<Text h6 fontWeight={700}>
														{cart.course.name || "-"}
													</Text>
												)}
												<SizeDetector.Mobile>{renderDeleteBtn(cart.id)}</SizeDetector.Mobile>
											</div>

											{cart.course.type !== CourseType.VOD && (
												<React.Fragment>
													<div className={SizeDetector.isDesktop ? "mt-16" : "mt-8"}>
														<Text
															p1
															primary
															className="d-inline"
															fontSize={!SizeDetector.isDesktop ? 0.75 : null}
														>
															·
														</Text>
														<Text
															p1
															className="d-inline"
															fontSize={!SizeDetector.isDesktop ? 0.75 : null}
															fontWeight={!SizeDetector.isDesktop ? 400 : null}
														>
															기간:
														</Text>
														<Text
															p1
															className="d-inline ml-4"
															fontSize={!SizeDetector.isDesktop ? 0.75 : null}
														>
															{cart.course_section.duration_period_str || ""}
														</Text>
													</div>
													<div className={"mt-4"}>
														<Text
															p1
															primary
															className="d-inline"
															fontSize={!SizeDetector.isDesktop ? 0.75 : null}
														>
															·
														</Text>
														<Text
															p1
															className="d-inline"
															fontSize={!SizeDetector.isDesktop ? 0.75 : null}
															fontWeight={!SizeDetector.isDesktop ? 400 : null}
														>
															시간:
														</Text>
														<Text
															p1
															className="d-inline ml-4"
															fontSize={!SizeDetector.isDesktop ? 0.75 : null}
														>
															{time}
														</Text>
													</div>
												</React.Fragment>
											)}
										</Col>
										<SizeDetector.Desktop>
											<Col align="right" className="">
												{renderDeleteBtn(cart.id)}
												{renderPriceText(cart.course.price, cart.course.discount_price)}
											</Col>
										</SizeDetector.Desktop>
									</CartItemRow>
									<SizeDetector.Mobile>
										<Row className="mt-12">
											<Col className="pr-0">
												{renderPriceText(cart.course.price, cart.course.discount_price)}
											</Col>
										</Row>
									</SizeDetector.Mobile>
								</CartItemDiv>
							);
						})}
				</CourseInfoCol>
			</UserCardRowContainer>
		</UserCardContainer>
	);
};

const UserCardContainer = styled.div`
	& + & {
		margin-top: 1.25rem;
	}

	background-color: white;
	border-radius: 4px;
	border: 0.063rem solid ${({ theme }) => theme.colors.gray};
	@media only screen and (max-width: 767.98px) {
		padding: 0rem 1.25rem;
	}
`;

const CourseInfoCol = styled(Col)`
	display: flex;
	justify-content: center;
	flex-direction: column;

	& + & {
		margin-top: 2.5rem;
	}

	@media only screen and (max-width: 767.98px) {
		margin-top: 1.25rem;
	}
`;

const CartItemRow = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		border-top: 0.063rem solid ${({ theme }) => `${theme.colors.gray}`};
		padding-top: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		min-height: 9.375rem;
		border-left: 0.063rem solid ${({ theme }) => `${theme.colors.gray}`};
	}
`;

const CartItemDiv = styled.div`
	& + & {
		margin-top: 2rem;
	}
`;

const UserCardRowContainer = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		margin: 1.25rem 0rem;
	}
	@media only screen and (min-width: 768px) {
		margin: 2.5rem;
	}
`;

const CartCancelBtn = styled.div`
	cursor: pointer;
`;

const PriceText = styled(Text)`
	float: right;
	bottom: 1.5rem;
	@media only screen and (max-width: 767.98px) {
		font-size: 1rem;
		font-weight: 600;
	}
	@media only screen and (min-width: 768px) {
		position: absolute;
		right: 15px;
	}
`;

const ProfileImageContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		width: 111px;
		height: 111px;
	}
	@media only screen and (min-width: 768px) {
		width: 150px;
		height: 150px;
	}
`;
export default UserCartItem;
