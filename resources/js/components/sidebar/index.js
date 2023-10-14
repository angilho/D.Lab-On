import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import Text from "@components/elements/Text";
import ProfileImage from "@components/elements/ProfileImage";

import useSizeDetector from "@hooks/useSizeDetector";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const Sidebar = ({ menu, menuIndex, subMenuIndex, user, userName, gender, isMobile, sidebarHide, paddingStart }) => {
	const history = useHistory();
	const SizeDetector = useSizeDetector();
	return (
		<SidebarContainer>
			{userName && (
				<UserContainer>
					<Col>
						<Row
							className={
								SizeDetector.isDesktop
									? "justify-content-center align-items-center"
									: "justify-content-start align-items-center"
							}
							xs={2}
						>
							<ProfileImageCol xs="auto" md={4}>
								<ProfileImageContainer>
									<ProfileImage user={user} gender={gender} />
								</ProfileImageContainer>
							</ProfileImageCol>
							<Col xs={7} md={8}>
								<Text
									p1
									font="BM"
									fontSize={SizeDetector.isDesktop ? 1 : 1.125}
									lineHeight={SizeDetector.isDesktop ? 1.813 : 1.813}
								>
									안녕하세요,
								</Text>
								<Text
									p1
									font="BM"
									fontSize={SizeDetector.isDesktop ? 1 : 1.125}
									lineHeight={SizeDetector.isDesktop ? 1.813 : 1.813}
									primary
									className="d-inline"
								>
									{userName}
								</Text>
								<Text
									p1
									font="BM"
									fontSize={SizeDetector.isDesktop ? 1 : 1.125}
									lineHeight={SizeDetector.isDesktop ? 1.813 : 1.813}
									className="d-inline"
								>
									님!
								</Text>
							</Col>
						</Row>
						<Row>
							<Col>
								<SidebarSeparator />
							</Col>
						</Row>
					</Col>
				</UserContainer>
			)}
			{sidebarHide && <GrayMargin />}
			{!sidebarHide && (
				<SidebarRow>
					<Col>
						{menu.map((menuItem, idx) => {
							if (!menuItem.title) return null;
							let selected = idx === menuIndex;
							let link = menuItem.subMenu ? menuItem.subMenu[0]?.link : menuItem.link;
							return (
								<MenuItem className="nav-item" key={idx}>
									<Col className={SizeDetector.isDesktop ? "" : "p-0"}>
										<PrimaryMenuText
											cursor
											primary={selected}
											fontWeight={selected ? 700 : 500}
											link={link}
										>
											{menuItem.title}
										</PrimaryMenuText>
										{menuItem.subMenu && (
											<SubmenuList paddingStart={paddingStart}>
												{menuItem.subMenu.map((subMenuItem, idx) => {
													if (subMenuItem.needCampus && userInfo.campus === 0) return null;
													let subMenuSelected = selected && idx === subMenuIndex;
													return (
														<SubMenuItem
															className="nav-item"
															key={idx}
															onClick={e => {
																e.preventDefault();
																//모바일인 상태에서 클릭한 경우 사이드바를 없애주고 콘텐츠만 보여 주어야 한다.
																if (isMobile) {
																	history.push({
																		pathname: subMenuItem.link,
																		state: {
																			sidebarHide: true,
																			contentsHide: false
																		}
																	});
																} else {
																	if (subMenuItem.reload) {
																		location.href = subMenuItem.link;
																	} else {
																		history.push({
																			pathname: subMenuItem.link
																		});
																	}
																}
															}}
														>
															<SubMenuText
																cursor
																primary={subMenuSelected}
																underline={subMenuSelected}
																fontWeight={subMenuSelected ? 500 : null}
															>
																{subMenuItem.title}
															</SubMenuText>
															<RightIcon />
														</SubMenuItem>
													);
												})}
											</SubmenuList>
										)}
									</Col>
								</MenuItem>
							);
						})}
					</Col>
				</SidebarRow>
			)}
		</SidebarContainer>
	);
};

const SidebarContainer = styled.div``;

const UserContainer = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		padding-top: 18px;
		padding-bottom: 1.25rem;
	}

	background-color: white;
`;

const SidebarSeparator = styled.hr`
	@media only screen and (max-width: 767.98px) {
		display: none;
	}
	color: ${({ theme }) => theme.colors.gray};
	margin-top: 2rem;
	margin-bottom: 2rem;
`;

const SidebarRow = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1rem;
	}
`;

const MenuItem = styled(Row)`
	background-color: white;
	@media only screen and (max-width: 767.98px) {
		& + & {
			margin-top: 4px;
		}
	}

	@media only screen and (min-width: 768px) {
		& + & {
			margin-top: 32px;
		}
	}
`;

const GrayMargin = styled.div`
	@media only screen and (max-width: 767.98px) {
		background-color: ${({ theme }) => theme.colors.gray};
		height: 10px;
		margin-left: -15px;
		margin-right: -15px;
	}
`;

/**
 * 모바일일 경우에는 대분류 메뉴를 보여주지 않는다
 */
const PrimaryMenuText = styled(Text)`
	font-size: 18px;
	@media only screen and (max-width: 767.98px) {
		display: none;
	}
`;

const SubmenuList = styled.div`
	//데스크톱일때는 서브메뉴의 왼쪽 패딩을 준다.
	@media only screen and (min-width: 768px) {
		${props =>
			props.paddingStart
				? css`
						padding-inline-start: ${props.paddingStart};
				  `
				: css`
						padding-inline-start: 40px;
				  `}
	}
`;

const SubMenuItem = styled.li`
	display: flex;
	justify-content: space-between;

	@media only screen and (max-width: 767.98px) {
		& + & {
			border-top: 0.063rem solid ${({ theme }) => theme.colors.gray};
		}
	}

	@media only screen and (min-width: 768px) {
		margin-top: 12px;
		& + & {
			margin-top: 12px;
		}
	}
`;

/**
 * 모바일 글씨 스타일
 */
const SubMenuText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		margin-left: 1rem;
		margin-top: 12px;
		margin-bottom: 12px;
		color: black;
		text-decoration: none;
	}
`;

const RightIcon = styled(ChevronRightRoundedIcon)`
	@media only screen and (max-width: 767.98px) {
		float: right;
		margin-top: 12px;
		bargin-bottom: 12px;
		margin-right: 1.25rem;
		color: #e1e1e1;
	}
	@media only screen and (min-width: 768px) {
		display: none !important;
	}
`;

const ProfileImageCol = styled(Col)`
	@media only screen and (max-width: 767.98px) {
		padding-right: 5px;
	}
`;

const ProfileImageContainer = styled.div`
	width: 64px;
	height: 64px;
`;
export default Sidebar;
