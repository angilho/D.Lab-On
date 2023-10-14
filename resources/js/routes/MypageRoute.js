import React from "react";
import { Route } from "react-router-dom";

import FrontPage from "@components/pages/FrontPage";
import Mypage from "../front/mypage";

export default [
	<Route
		exact
		path="/mypage"
		key="mypage"
		render={props => (
			<FrontPage title="마이페이지" marginBottom0>
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/password/edit"
		key="mypage.password.edit"
		render={props => (
			<FrontPage title="마이페이지 - 비밀번호 변경">
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/coupon"
		key="mypage.coupon"
		render={props => (
			<FrontPage title="마이페이지 - 쿠폰정보">
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/user/delete"
		key="mypage.user.delete"
		render={props => (
			<FrontPage title="마이페이지 - 회원 탈퇴">
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/children"
		key="mypage.children"
		render={props => (
			<FrontPage title="마이페이지 - 자녀 정보">
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/child/create"
		key="mypage.child.create"
		render={props => (
			<FrontPage title="마이페이지 - 자녀 추가">
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/payment"
		key="mypage.payment"
		render={props => (
			<FrontPage title="마이페이지 - 결제 내역" marginBottom0>
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/payment/:id"
		key="mypage.payment.id"
		render={props => (
			<FrontPage title="마이페이지 - 결제 내역" marginBottom0>
				<Mypage {...props} payment_id={props.match.params.id} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/enrollment"
		key="mypage.enrollment"
		render={props => (
			<FrontPage title="마이페이지 - 수강 내역" marginBottom0>
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/enrollment/closed"
		key="mypage.enrollment.closed"
		render={props => (
			<FrontPage title="마이페이지 - 수강종료 내역" marginBottom0>
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/support_class_enrollment"
		key="mypage.support_csupport_class_enrollmentlass"
		render={props => (
			<FrontPage title="마이페이지 - 보충수업 내역" marginBottom0>
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/support_class_enrollment/closed"
		key="mypage.support_class_enrollment.closed"
		render={props => (
			<FrontPage title="마이페이지 - 보충수업 종료 내역" marginBottom0>
				<Mypage {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mypage/enrollment/certificate"
		key="mypage.enrollment.certificate"
		render={props => (
			<FrontPage title="마이페이지 - 수료증발급" marginBottom0>
				<Mypage {...props} />
			</FrontPage>
		)}
	/>
];
