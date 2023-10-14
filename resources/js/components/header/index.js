import React, { useEffect, useState } from "react";
import { Navbar, Nav, Row, Col } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import Logo from "@components/elements/Logo";
import NavbarItemMyCodingSpace from "./components/NavbarItemMyCodingSpace";

import useSizeDetector from "@hooks/useSizeDetector";

import LoginIcon from "@images/icon/login.png";
import LogoutIcon from "@images/icon/logout.png";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({}) => {
	const history = useHistory();
	const location = useLocation();
	const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
	const [current, setCurrent] = useState("");
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		setCurrent(location.pathname);
	}, [location]);

	const getSelectedFontWeight = link => {
		if (isSelectedMenu(link)) return 600;

		return 0;
	};

	const isSelectedMenu = link => {
		if (current === "/" && link === "/curriculum") return true;
		if (link === "/curriculum") return current.includes(link) && !current.includes("admin");
		return current.includes(link);
	};

	const onClickLogo = () => {
		if (userInfo && userInfo.organization_id) {
			history.push({ pathname: "/mycodingspace" });
		} else {
			history.push({ pathname: "/" });
		}
	};

	const onClickMobileMenu = (e, handleClick) => {
		e.preventDefault();
		e.stopPropagation();
		handleClick();
		setMobileMenuVisible(false);
	};

	const onHideNavbar = () => {
		setMobileMenuVisible(false);
	};

	const renderMobileMenuRow = (text, onClick) => {
		return (
			<Row
				onClick={e => {
					onClickMobileMenu(e, onClick);
				}}
			>
				<Col>
					<MobileMenuContainer>
						<MobileMenuText p3>{text}</MobileMenuText>
						<RightIcon />
					</MobileMenuContainer>
				</Col>
			</Row>
		);
	};

	const renderMobileBottomMenuRow = (text, icon, onClick) => {
		return (
			<Row onClick={onClick}>
				<Col>
					<MobileBottomMenuContainer>
						<MobileBottomMenuText p3 primary>
							{text}
						</MobileBottomMenuText>
						<BottomMenuIcon src={icon} />
					</MobileBottomMenuContainer>
				</Col>
			</Row>
		);
	};

	const renderMobileMenu = () => {
		if (userInfo.logged_in && userInfo.organization_id !== 0) {
			return renderB2BMobileMenu();
		}
		return renderDefaultMobileMenu();
	};

	const renderDefaultMobileMenu = () => {
		return (
			<MobileMenuConatiner
				onClick={e => {
					e.preventDefault();
					e.stopPropagation();
					setMobileMenuVisible(!mobileMenuVisible);
				}}
			>
				<MobileMenu>
					<Row
						onClick={e => {
							onClickMobileMenu(e, () => {
								history.push({ pathname: "/cart" });
							});
						}}
					>
						<Col align="right">
							<CartIcon />
						</Col>
					</Row>
					{userInfo.logged_in
						? renderMobileMenuRow("마이페이지", () =>
								history.push({ pathname: "/mypage", state: { sidebarHide: false, contentsHide: true } })
						  )
						: null}
					<MobileSeparator />
					{renderMobileMenuRow("커리큘럼", () => history.push({ pathname: "/detail_curriculum" }))}
					{renderMobileMenuRow("공지사항", () => history.push({ pathname: "/notice" }))}
					{renderMobileMenuRow("FAQ", () => history.push({ pathname: "/faq" }))}
					{userInfo.logged_in ? (
						<NavbarItemMyCodingSpace userId={userInfo.id} hideHandler={onHideNavbar} />
					) : null}
					{userInfo.logged_in && userInfo.is_admin
						? renderMobileMenuRow("관리자 메뉴", () => history.push({ pathname: "/admin/dashboard" }))
						: null}
					{userInfo.logged_in && userInfo.is_instructor
						? renderMobileMenuRow("관리자 메뉴", () => history.push({ pathname: "/admin/attendances" }))
						: null}
					{renderMobileMenuRow("회사소개", () => history.push({ pathname: "/about" }))}
				</MobileMenu>
				{userInfo.logged_in ? (
					<MobileBottomMenu>
						{renderMobileBottomMenuRow("로그아웃", LogoutIcon, () =>
							document.getElementById("logout-form").submit()
						)}
					</MobileBottomMenu>
				) : (
					<MobileBottomMenu>
						{renderMobileBottomMenuRow("로그인", LoginIcon, () => history.push({ pathname: "/login" }))}
					</MobileBottomMenu>
				)}
			</MobileMenuConatiner>
		);
	};

	const renderB2BMobileMenu = () => {
		return (
			<MobileMenuConatiner
				onClick={e => {
					e.preventDefault();
					e.stopPropagation();
					setMobileMenuVisible(!mobileMenuVisible);
				}}
			>
				<MobileMenu>
					<div className="mt-20"></div>
					{renderMobileMenuRow("게시판", () =>
						history.push({ pathname: `/organizations/${userInfo.organization_id}/posts` })
					)}
					<NavbarItemMyCodingSpace userId={userInfo.id} hideHandler={onHideNavbar} />
				</MobileMenu>
				<MobileBottomMenu>
					{renderMobileBottomMenuRow("로그아웃", LogoutIcon, () =>
						document.getElementById("logout-form").submit()
					)}
				</MobileBottomMenu>
			</MobileMenuConatiner>
		);
	};

	return (
		<React.Fragment>
			{mobileMenuVisible && renderMobileMenu()}
			{/** PC Header */}
			<StyledNavbar bg="white" expand="md" sticky="top" expanded={false}>
				<div className="container">
					<NavbarBrand className="mr-72">
						<LogoContainer onClick={onClickLogo}>
							<Logo header></Logo>
						</LogoContainer>
					</NavbarBrand>
					<NavToggle
						aria-controls="basic-navbar-nav"
						onClick={() => {
							setMobileMenuVisible(true);
						}}
					>
						<NavToggleIcon />
					</NavToggle>
					<NavbarCollapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							{menus.map((menu, _) => {
								if (menu.needAuth && !userInfo.logged_in) return null;
								if (userInfo.organization_id !== 0 && !menu.needOrganization) return null;
								if (userInfo.organization_id === 0 && menu.needOrganization) return null;
								if (menu.needOrganization) {
									menu.url = menu.url.replace("[ORG_ID]", userInfo.organization_id);
								}
								if (userInfo.campus === 0 && menu.needCampus) return null;

								let activated = isSelectedMenu(menu.url);
								return (
									<Text
										p3
										key={_}
										link={menu.url}
										fontWeight={getSelectedFontWeight(menu.url)}
										primary={activated}
										className="mr-20"
									>
										{menu.title}
									</Text>
								);
							})}
							{userInfo.logged_in && userInfo.is_admin ? (
								<Text
									p3
									link="/admin/dashboard"
									primary={isSelectedMenu("/admin")}
									fontWeight={getSelectedFontWeight("/admin")}
								>
									관리자 메뉴
								</Text>
							) : null}
							{userInfo.logged_in && userInfo.is_instructor ? (
								<Text
									p3
									link="/admin/attendances"
									primary={isSelectedMenu("/attendances")}
									fontWeight={getSelectedFontWeight("/attendances")}
								>
									관리자 메뉴
								</Text>
							) : null}
						</Nav>
						<Nav className="float-right">
							{userInfo.organization_id === 0 && (
								<Text
									p3
									link="/cart"
									primary={isSelectedMenu("/cart")}
									fontWeight={getSelectedFontWeight("/cart")}
									className="mr-20"
								>
									장바구니
								</Text>
							)}
							{userInfo.logged_in ? (
								<React.Fragment>
									{userInfo.organization_id === 0 && (
										<Text
											p3
											link="/mypage"
											primary={isSelectedMenu("/mypage")}
											fontWeight={getSelectedFontWeight("/mypage")}
											className="mr-20"
										>
											마이페이지
										</Text>
									)}
									<Text
										p3
										primary
										cursor
										fontWeight={600}
										onClick={event => {
											event.preventDefault();
											document.getElementById("logout-form").submit();
										}}
									>
										로그아웃
									</Text>
								</React.Fragment>
							) : (
								<React.Fragment>
									<Text
										p3
										link="/login"
										primary={isSelectedMenu("/login")}
										fontWeight={getSelectedFontWeight("/login")}
										className="mr-20"
									>
										로그인
									</Text>
									<Text p3 primary fontWeight={600} link="/register">
										회원가입
									</Text>
								</React.Fragment>
							)}
						</Nav>
					</NavbarCollapse>
				</div>
			</StyledNavbar>
		</React.Fragment>
	);
};

const LogoContainer = styled.div`
	cursor: pointer;
`;

const StyledNavbar = styled(Navbar)`
	@media only screen and (max-width: 767.98px) {
		padding: 4px 16px 4px 16px;
		height: 3rem;
	}
	@media only screen and (min-width: 768px) {
		padding: 0;
		height: 6.5rem;
	}
`;

const NavToggle = styled(Navbar.Toggle)`
	border: none;
	padding: 4px 0px 4px 12px;
`;

const NavbarBrand = styled(Navbar.Brand)`
	@media only screen and (max-width: 767.98px) {
		padding: 3px 0px 7px 0px;
	}
`;

const NavToggleIcon = styled(MenuIcon)`
	width: 1.5rem;
	height: 1.5rem;
	color: #000000;
`;

const NavbarCollapse = styled(Navbar.Collapse)`
	@media only screen and (max-width: 767.98px) {
		${props => props.show} {
			position: absolute;
			background-color: white;
			right: 0;
			top: 0;
			height: 100%;
			width: 75%;
		}
	}
`;

const MobileMenuConatiner = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 30000;
`;

const MobileMenu = styled.div`
	background-color: white;
	fliter: none;
	width: 13.813rem;
	height: 100%;
	right: 0;
	position: absolute;
	z-index: 40000;
`;

const MobileMenuContainer = styled.div`
	display: flex;
	justify-content: space-between;
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};
`;

const MobileMenuText = styled(Text)`
	margin-left: 1rem;
	margin-top: 0.625rem;
	margin-bottom: 0.625rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 400;
`;

const MobileBottomMenuText = styled(Text)`
	font-size: 0.875rem;
	line-height: 1.563rem;
	font-weight: 500;
`;

const CartIcon = styled(ShoppingCartRoundedIcon)`
	margin: 1.25rem;
`;

const RightIcon = styled(ChevronRightRoundedIcon)`
	float: right;
	margin: 7px 20px 7px 10px;
	color: #e1e1e1;
	align-self: center;
`;

const MobileSeparator = styled.div`
	height: 1.25rem;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const MobileBottomMenu = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	margin-bottom: 1.125rem;
	position: absolute;
	bottom: 0;
	right: 0;
	z-index: 40000;
	height: 3.375rem;
	width: 13.813rem;
`;

const MobileBottomMenuContainer = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const BottomMenuIcon = styled.img`
	margin-left: 1rem;
	margin-right: 1rem;
`;

export default Header;
