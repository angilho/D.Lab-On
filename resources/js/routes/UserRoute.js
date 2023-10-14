import React from "react";
import { Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import FrontPage from "@components/pages/FrontPage";
import UserFind from "../front/user/find";
import UserFindIdByPhone from "../front/user/find/id/phone";
import UserFindIdByEmail from "../front/user/find/id/email";
import UserFindPasswordByEmail from "../front/user/find/password/email";
import UserDeleteComplete from "../front/user/delete/complete";

export default [
	<Route
		exact
		path="/user/find"
		key="user.find"
		render={props => {
			const query = new URLSearchParams(props.location.search);
			const organizationPath = query.get("path");
			return (
				<FrontPage title="D.LAB ON - 아이디 / 비밀번호 찾기">
					<UserFind {...props} path={organizationPath} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/user/find/id/phone"
		key="user.find.id.phone"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 전화번호로 아이디 찾기">
					<UserFindIdByPhone {...props} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/user/find/id/email"
		key="user.find.id.email"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 이메일 인증으로 아이디 찾기">
					<UserFindIdByEmail {...props} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/user/find/password/email"
		key="user.find.password.email"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 이메일로 비밀번호 찾기">
					<UserFindPasswordByEmail {...props} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/user/delete/complete"
		key="user.delete.complete"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 사용자 탈퇴 완료" marginBottom0>
					<UserDeleteComplete {...props} />
				</FrontPage>
			);
		}}
	/>
];
