import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import UserEdit from "./components/UserEdit";
import PasswordEdit from "./components/PasswordEdit";
import CouponInfoTable from "./components/CouponInfoTable";
import UserDelete from "./components/UserDelete";
import ChildCreate from "./components/ChildCreate";
import ChildList from "./components/ChildList";
import Sidebar from "@components/sidebar";
import PaymentList from "./components/PaymentList";
import PaymentDetail from "./components/PaymentDetail";
import EnrollmentList from "./components/EnrollmentList";
import SupportClassEnrollmentList from "./components/SupportClassEnrollmentList";
import CertificateList from "./components/CertificateList";
import { SidebarMenu, ChildSidebarMenu } from "@constants/SidebarMenu";
import useSizeDetector from "@hooks/useSizeDetector";

const Mypage = ({ payment_id }) => {
	const location = useLocation();
	const history = useHistory();
	const SizeDetector = useSizeDetector();
	const [initialized, setInitialized] = useState(false);
	const [menuIndex, setMenuIndex] = useState(0);
	const [subMenuIndex, setSubMenuIndex] = useState(0);
	const [contentsHide, setContentsHide] = useState(false);
	const [sidebarHide, setSidebarHide] = useState(false);

	const CurrentSidebarMenu = userInfo.is_child ? ChildSidebarMenu : SidebarMenu;

	useEffect(() => {
		setInitialized(true);
	}, [menuIndex, subMenuIndex]);

	useEffect(() => {
		if (location.state && typeof location.state.contentsHide !== "undefined") {
			setContentsHide(location.state.contentsHide);
		}
		if (location.state && typeof location.state.sidebarHide !== "undefined") {
			setSidebarHide(location.state.sidebarHide);
		}
	}, [location]);

	useEffect(() => {
		//마이페이지는 로그인 한 사용자만 접근할 수 있다.
		if (!userInfo.id) history.push({ pathname: "/login" });
		CurrentSidebarMenu.forEach((menu, idx) => {
			if (!menu.subMenu) {
				if (menu.link === location.pathname || location.pathname.includes(menu.link)) {
					setMenuIndex(idx);
					setSubMenuIndex(0);
				}
			} else {
				CurrentSidebarMenu[idx].subMenu.forEach((subMenu, subMenuIdx) => {
					if (subMenu.link === location.pathname || location.pathname.includes(menu.link)) {
						setMenuIndex(idx);
						setSubMenuIndex(subMenuIdx);
					}
				});
			}
		});
	}, []);

	const renderPassword = () => {
		return (
			<Col md={4}>
				<Row>
					<Col>
						<Text h5>비밀번호 변경</Text>
					</Col>
				</Row>
				<Row className="mt-40">
					<Col>
						<PasswordEdit id={userInfo.id} />
					</Col>
				</Row>
			</Col>
		);
	};

	const renderCoupon = () => {
		return (
			<Col md={9}>
				<Row>
					<Col>
						<Text h5>쿠폰정보 확인</Text>
					</Col>
				</Row>
				<Row className="mt-40">
					<Col>
						<CouponInfoTable user_id={userInfo.id} />
					</Col>
				</Row>
			</Col>
		);
	};

	const renderEnrollmentList = closed => {
		return (
			<Col md={9}>
				<EnrollmentList user_id={userInfo.id} closed={closed} />
			</Col>
		);
	};

	const renderSupportClassEnrollmentList = closed => {
		return (
			<Col md={9}>
				<SupportClassEnrollmentList user_id={userInfo.id} closed={closed} />
			</Col>
		);
	};

	const renderCertificateList = () => {
		return (
			<Col md={9}>
				<CertificateList user_id={userInfo.id} />
			</Col>
		);
	};

	const renderUser = () => {
		return (
			<Col md={4}>
				<Row>
					<Col>
						<Text h5>가입정보 확인 및 변경</Text>
					</Col>
				</Row>
				<Row className="mt-40">
					<Col>
						<UserEdit id={userInfo.id} />
					</Col>
				</Row>
			</Col>
		);
	};

	const renderUserDelete = () => {
		return (
			<Col md={4}>
				<UserDelete id={userInfo.id} title="회원 탈퇴" />
			</Col>
		);
	};

	const renderChildList = () => {
		return (
			<Col md={9}>
				<Row>
					<Col>
						<Text h5>자녀 정보</Text>
					</Col>
				</Row>
				<Row className="mt-40">
					<Col>
						<ChildList parentId={userInfo.id} />
					</Col>
				</Row>
			</Col>
		);
	};

	const renderChildCreate = () => {
		return (
			<Col md={4}>
				<Row>
					<Col>
						<Text h5>자녀 추가</Text>
					</Col>
				</Row>
				<Row className="mt-40">
					<Col>
						<ChildCreate parentId={userInfo.id} />
					</Col>
				</Row>
			</Col>
		);
	};

	const renderPaymentList = () => {
		if (payment_id) {
			return (
				<Col md={9}>
					<PaymentDetail id={userInfo.id} title="결제 상세" payment_id={payment_id} />
				</Col>
			);
		} else {
			return (
				<Col md={9}>
					<PaymentList id={userInfo.id} title="결제 내역" />
				</Col>
			);
		}
	};

	const renderView = () => {
		return (
			<React.Fragment>
				{menuIndex === 0 && subMenuIndex === 0 && renderUser()}
				{menuIndex === 0 && subMenuIndex === 1 && renderPassword()}
				{menuIndex === 0 && subMenuIndex === 2 && renderCoupon()}
				{menuIndex === 0 && subMenuIndex === 3 && renderUserDelete()}
				{menuIndex === 1 && subMenuIndex === 0 && renderChildList()}
				{menuIndex === 1 && subMenuIndex === 1 && renderChildCreate()}
				{menuIndex === 2 && subMenuIndex === 0 && renderEnrollmentList(false)}
				{menuIndex === 2 && subMenuIndex === 1 && renderEnrollmentList(true)}
				{menuIndex === 2 && subMenuIndex === 2 && renderCertificateList(true)}
				{menuIndex === 2 && subMenuIndex === 3 && renderSupportClassEnrollmentList(false)}
				{menuIndex === 2 && subMenuIndex === 4 && renderSupportClassEnrollmentList(true)}
				{menuIndex === 3 && subMenuIndex === 0 && renderPaymentList()}
			</React.Fragment>
		);
	};

	return (
		<MypageContainer className="container" isBackgroundGray={contentsHide}>
			<Row xs={1} md={2}>
				<Col md={3} className={!SizeDetector.isDesktop ? "mb-40" : ""}>
					<Sidebar
						sidebarHide={sidebarHide}
						menu={CurrentSidebarMenu}
						menuIndex={menuIndex}
						subMenuIndex={subMenuIndex}
						user={userInfo}
						userName={userInfo.name}
						gender={userInfo.gender}
						isMobile={contentsHide} //모바일일 경우에만 컨텐츠가 숨겨진다.
						paddingStart="20px"
					/>
				</Col>
				{!contentsHide && initialized && renderView()}
			</Row>
		</MypageContainer>
	);
};

/**
 * 모바일이고, 콘텐츠가 안보일 경우에만 백그라운드를 gray 색깔로 만들어 준다.
 */
const MypageContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		${props =>
			props.isBackgroundGray &&
			css`
				background-color: ${({ theme }) => theme.colors.gray1};
			`}
		padding-bottom: 6.5rem;
	}

	/* 모바일이 아닐때 감싸주는 영역이 container가 되어야 한다. 모바일 구현 때문에 container의 속성을 미디어 쿼리로 지정함*/
	@media only screen and (min-width: 768px) {
		max-width: 1200px;
		width: 100%;
		padding-right: 15px;
		padding-left: 15px;
		margin-right: auto;
		margin-left: auto;
		padding-bottom: 12.5rem;
	}
`;

export default Mypage;
