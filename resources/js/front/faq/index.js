import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Sidebar from "@components/sidebar";
import Text from "@components/elements/Text";
import TextAnchor from "@components/elements/TextAnchor";
import FoldItem from "@components/foldItem";
import FrontTopMenu from "@components/frontTopMenu";
import Kakaotalk from "@images/icon/faqKakaoGray2.png";
import Girl from "@images/faq/kneeGirl.png";
import useSizeDetector from "@hooks/useSizeDetector";
import AdminTablePagination from "@components/adminTablePagination";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const Faq = ({ notice, faq_category_id }) => {
	const theme = useTheme();
	const history = useHistory();
	const [desktopMenu, setDesktopMenu] = useState([]);
	const [mobileMenu, setMobileMenu] = useState([]);
	const [mobileMenuIndex, setMobileMenuIndex] = useState(0);
	const [faqCategories, setFaqCategories] = useState([]);
	const [faqCategoryMenuIndex, setFaqCategoryMenuIndex] = useState(0);
	const [notices, setNotices] = useState(null);
	const [noticeData, setNoticeData] = useState(null);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		ctrl.getNotices(notices => setNotices(notices));
		ctrl.getFaqCategories(faqCategories => setFaqCategories(faqCategories));
	}, []);

	useEffect(() => {
		setSelectedFaqMenu();
	}, [faq_category_id, desktopMenu, location]);

	useEffect(() => {
		//메뉴 설정
		setDesktopMenu([
			{
				title: "공지사항",
				link: "/notice"
			},
			{
				title: "FAQ",
				subMenu: faqCategories.map(faqCategory => {
					return {
						title: faqCategory.name,
						link: `/faq/${faqCategory.id}`
					};
				})
			}
		]);

		// FAQ에서만 사용하는 메뉴
		setMobileMenu(
			faqCategories.map(faqCategory => {
				return {
					title: faqCategory.name,
					link: `/faq/${faqCategory.id}`
				};
			})
		);
	}, [faqCategories]);

	const setSelectedFaqMenu = () => {
		if (desktopMenu.length == 0) return;

		if (location.pathname === "/faq") {
			setFaqCategoryMenuIndex(0);
		} else {
			desktopMenu[1].subMenu.forEach((value, idx) => {
				if (value.link.includes(location.pathname)) {
					setFaqCategoryMenuIndex(idx);
				}
			});
		}
	};

	const onClickNotice = noticeId => {
		ctrl.getNotice(noticeId, noticeData => {
			// 공지사항을 조회한 경우 목록에 있는 공지사항의 조회수를 1올려준다.
			// 운영자인 경우 조회수를 올리지 않는다.
			if (!(userInfo.logged_in && userInfo.is_admin)) {
				let targetNoticeIdx = notices.data.findIndex(notice => notice.id === noticeId);
				let targetNotice = notices.data[targetNoticeIdx];
				targetNotice.view_count++;
				setNotices({
					...notices,
					data: [
						...notices.data.slice(0, targetNoticeIdx),
						targetNotice,
						...notices.data.slice(targetNoticeIdx + 1)
					]
				});
			}

			setNoticeData(noticeData);
		});
	};

	const onClickNoticePageItem = url => {
		if (url) ctrl.getPaginationLink(url, setNotices);
	};

	const onClickNoticeList = () => {
		setNoticeData(null);
	};

	const onClickKakaotalk = () => {
		window.open("http://pf.kakao.com/_Zxclls");
	};

	const renderNotice = () => {
		return noticeData ? renderNoticeData() : renderNoticeList();
	};

	const renderNoticeData = () => {
		return (
			<NoticeItemContainer>
				<NoticeItem>
					<div className={SizeDetector.isDesktop ? "mb-10" : null}>
						<Text
							p1
							className="d-inline"
							fontWeight={500}
							fontSize={!SizeDetector.isDesktop ? 0.875 : null}
						>
							{noticeData.title}
						</Text>
					</div>
					<NoticeInfo>
						<NoticeCreatedAt>{util.getFormatDate(noticeData.created_at)}</NoticeCreatedAt>
					</NoticeInfo>
				</NoticeItem>
				<NoticeDescription
					dangerouslySetInnerHTML={{ __html: noticeData?.description ?? "-" }}
				></NoticeDescription>
				<NoticeBottom className="d-flex align-items-center cursor-pointer" onClick={onClickNoticeList}>
					<ArrowBackRoundedIcon style={{ fontSize: 18, color: theme.colors.primary }} />
					<NoticeListBack primary className="ml-4">
						목록으로 돌아가기
					</NoticeListBack>
				</NoticeBottom>
			</NoticeItemContainer>
		);
	};

	const renderNoticeList = () => {
		if (!notices) return null;
		return (
			<React.Fragment>
				{notices.data.map((notice, idx) => {
					return (
						<NoticeItemContainer key={idx}>
							<NoticeItem onClick={() => onClickNotice(notice.id)}>
								<div className={SizeDetector.isDesktop ? "mb-10" : null}>
									<Text
										p1
										className="d-inline"
										fontWeight={500}
										fontSize={!SizeDetector.isDesktop ? 0.875 : null}
									>
										{notice.title}
									</Text>
								</div>
								<NoticeInfo>
									<NoticeCreatedAt>{util.getFormatDate(notice.created_at)}</NoticeCreatedAt>
								</NoticeInfo>
							</NoticeItem>
						</NoticeItemContainer>
					);
				})}
				<div className="mt-30 d-flex justify-content-center">
					<AdminTablePagination
						links={notices.links}
						firstPageUrl={notices.first_page_url}
						lastPageUrl={notices.last_page_url}
						onChange={onClickNoticePageItem}
					/>
				</div>
			</React.Fragment>
		);
	};

	const renderFaq = () => {
		return (
			<React.Fragment>
				{faqCategories[faqCategoryMenuIndex] &&
					faqCategories[faqCategoryMenuIndex].faq_item.map((faqItem, idx) => {
						return (
							<FoldItem key={`${faqCategoryMenuIndex}_${idx}`} name={faqItem.name}>
								<FaqText p2 dangerouslySetInnerHTML={{ __html: faqItem?.description ?? "-" }}></FaqText>
							</FoldItem>
						);
					})}
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<SizeDetector.Mobile>
				{!notice && mobileMenu.length != 0 && (
					<FrontTopMenu
						menu={mobileMenu}
						index={mobileMenuIndex}
						sticky
						onChange={idx => {
							if (mobileMenuIndex !== idx) {
								setMobileMenuIndex(idx);
								history.push(mobileMenu[idx].link);
							}
						}}
					/>
				)}
			</SizeDetector.Mobile>
			<SizeDetector.Desktop>
				<Conatiner className="container">
					<Row className="mt-40 mb-40">
						<Col>
							<Text h4 primary className="d-inline">
								디랩온
							</Text>
							<Text h4 className="d-inline">
								에 오신 것을 환영합니다.
							</Text>
						</Col>
					</Row>
				</Conatiner>
			</SizeDetector.Desktop>
			<SizeDetector.Mobile>
				<div className="container">
					<Row className="mt-30 mb-30">
						<Col>
							<Text h4>{notice ? "공지사항" : "FAQ"}</Text>
						</Col>
					</Row>
				</div>
			</SizeDetector.Mobile>
			<Separator />
			<div className="container">
				<Row xs={1} md={2} className="mt-40">
					<Col md={3}>
						<SizeDetector.Desktop>
							<Sidebar
								menu={desktopMenu}
								menuIndex={notice ? 0 : 1}
								subMenuIndex={faqCategoryMenuIndex}
								paddingStart="20px"
							/>
						</SizeDetector.Desktop>
					</Col>
					<Col md={8}>
						{notice ? renderNotice() : renderFaq()}

						<InfoContainer>
							<Row xs={2} md={2}>
								<SizeDetector.Desktop>
									<Col>
										<Text p3 gray2 fontWeight={400} className="d-inline">
											더 궁금하신 점이 있으신가요?&nbsp;
										</Text>
										<Text p3 gray2 fontWeight={500} className="d-inline">
											디랩온으로 연락주세요!
										</Text>
									</Col>
								</SizeDetector.Desktop>
								<SizeDetector.Mobile>
									<Col xs={8}>
										<Text p3 gray2 fontSize={0.75} fontWeight={400}>
											더 궁금하신 점이 있으신가요?
										</Text>
										<Text p3 gray2 fontSize={0.75} fontWeight={500}>
											디랩온으로 연락주세요!
										</Text>
									</Col>
								</SizeDetector.Mobile>
								<Col xs={4} md={6}>
									<GirlImage src={Girl} />
								</Col>
							</Row>
							<Row className="mt-20">
								<Col md={8}>
									<Row xs={1} md={2}>
										<Col md={5}>
											<Text
												p3
												gray2
												fontSize={SizeDetector.isDesktop ? null : 0.75}
												fontWeight={SizeDetector.isDesktop ? 500 : 400}
												className="d-inline"
											>
												전화번호 :&nbsp;
											</Text>
											<TextAnchor
												p3
												gray2
												fontWeight={600}
												target="_blank"
												href="tel:031-526-9313"
												underline
												className="d-inline"
												fontSize={SizeDetector.isDesktop ? null : 0.75}
											>
												031-526-9313
											</TextAnchor>
										</Col>
										<Col md={7}>
											<Text
												p3
												gray2
												fontSize={SizeDetector.isDesktop ? null : 0.75}
												fontWeight={SizeDetector.isDesktop ? 500 : 400}
												className="d-inline"
											>
												이메일 :&nbsp;
											</Text>
											<TextAnchor
												p3
												gray2
												fontSize={SizeDetector.isDesktop ? null : 0.75}
												fontWeight={600}
												className="d-inline"
												target="_blank"
												href="mailto:dlabon@daddyslab.com"
												underline
											>
												dlabon@daddyslab.com
											</TextAnchor>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row>
								<Col>
									<SizeDetector.Desktop>
										<Text
											gray2
											fontSize={SizeDetector.isDesktop ? null : 0.75}
											fontWeight={SizeDetector.isDesktop ? 500 : 400}
											p3
											className="d-inline"
										>
											상담 :&nbsp;
										</Text>
										<Text
											gray2
											p3
											className="d-inline"
											fontSize={SizeDetector.isDesktop ? null : 0.75}
										>
											월 ~ 금요일 오전 9시 ~ 저녁 6시(점심시간 12:30~13:30)
										</Text>
									</SizeDetector.Desktop>
									<SizeDetector.Mobile>
										<div>
											<Text
												gray2
												fontSize={SizeDetector.isDesktop ? null : 0.75}
												fontWeight={400}
												p3
												className="d-inline"
											>
												상담 :&nbsp;
											</Text>
											<Text
												gray2
												p3
												fontSize={SizeDetector.isDesktop ? null : 0.75}
												fontWeight={400}
												className="d-inline"
											>
												월 ~ 금요일
											</Text>
										</div>

										<Text gray2 p3 fontSize={SizeDetector.isDesktop ? null : 0.75} fontWeight={400}>
											오전 9시 ~ 저녁 6시(점심시간 12:30~13:30)
										</Text>
									</SizeDetector.Mobile>
								</Col>
							</Row>
							<Row>
								<Col md={6} role="button" onClick={onClickKakaotalk}>
									<Text
										gray2
										p3
										fontSize={SizeDetector.isDesktop ? null : 0.75}
										fontWeight={SizeDetector.isDesktop ? 500 : 400}
										className="d-inline"
									>
										카카오 채널 바로가기
									</Text>
									<Icon src={Kakaotalk} />
								</Col>
							</Row>
						</InfoContainer>
					</Col>
				</Row>
			</div>
		</React.Fragment>
	);
};

const Conatiner = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding-top: 56px;
	}
`;

const Separator = styled.hr`
	@media only screen and (max-width: 767.98px) {
		display: none;
	}

	margin-top: 0px;
	margin-bottom: 2.5rem;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const InfoContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-top: 6.25rem;
		padding: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 10rem;
		padding: 1.875rem;
	}

	border: 0.125rem solid ${({ theme }) => theme.colors.gray};
`;

const FaqText = styled(Text)`
	display: block;
	white-space: pre-line;
	font-family: Noto Sans KR;
	color: #555555;

	p {
		margin-bottom: 0;
	}

	@media only screen and (max-width: 767.98px) {
		padding-top: 6px;
		padding-bottom: 12px;
		font-weight: 400;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 14px;
		padding-bottom: 8px;
		font-weight: 300;
	}
`;

const Icon = styled.img`
	margin-left: 0.625rem;
	width: 1.563rem;
	height: 1.5rem;
	vertical-align: middle;
	display: inline-block;
`;

const GirlImage = styled.img`
	@media only screen and (max-width: 767.98px) {
		position: absolute;
		margin-top: -5rem;
		margin-left: -1.75rem;
		width: 100%;
		max-height: auto;
	}

	@media only screen and (min-width: 768px) {
		position: absolute;
		margin-top: -7.434rem;
		right: 1.563rem;

		width: 12.5rem;
		height: 13.997rem;
	}
`;

const NoticeItemContainer = styled.div`
	& + & {
		@media only screen and (max-width: 767.98px) {
			margin-top: 1.25rem;
		}
		@media only screen and (min-width: 768px) {
			margin-top: 2.5rem;
		}
	}
`;

const NoticeItem = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.625rem;
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};
	cursor: pointer;
	@media only screen and (max-width: 767.98px) {
		flex-direction: column;
	}
`;

const NoticeInfo = styled.div`
	display: flex;
	align-items: center;
`;

const NoticeDescription = styled.div`
	white-space: pre-line;
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};
	font-family: Noto Sans KR;
	color: #555555;

	p {
		margin-bottom: 0;
	}

	@media only screen and (max-width: 767.98px) {
		margin-top: 16px;
		padding-bottom: 32px;
		font-size: 14px;
		font-weight: 400;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 24px;
		padding-bottom: 48px;
		font-size: 1rem;
		font-weight: 300;
	}
`;

const NoticeListBack = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		font-size: 14px;
		line-height: 25px;
	}
	@media only screen and (min-width: 768px) {
	}
	font-family: Noto Sans KR;
`;

const NoticeViewCount = styled.div`
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.25rem;
		margin-right: 8px;
	}
	@media only screen and (min-width: 768px) {
		font-size: 0.875rem;
		line-height: 1.25rem;
		display: flex;
		align-self: center;
		margin-right: 16px;
	}

	font-weight: 400;
	color: #999999;
	height: 30px;
`;

const NoticeCreatedAt = styled.div`
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 0.875rem;
		line-height: 1.25rem;
		display: flex;
		align-self: center;
	}

	font-weight: 400;
	color: #999999;
	height: 30px;
`;

const NoticeBottom = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-top: 16px;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 24px;
	}
`;

export default Faq;
