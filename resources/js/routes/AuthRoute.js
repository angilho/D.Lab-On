import React from "react";
import { Route } from "react-router-dom";

import FrontPage from "@components/pages/FrontPage";

import Login from "../auth/login";
import Agreement from "../auth/register/agreement";
import UserTypeConfirm from "../auth/register/userTypeConfirm";
import RegisterUser from "../auth/register/user";
import RegisterChild from "../auth/register/child";
import Welcome from "../auth/register/welcome";
import ChildConfirm from "../auth/register/childConfirm";

export default [
	<Route
		exact
		path="/login"
		key="login"
		render={props => (
			<FrontPage title="D.LAB ON - 로그인">
				<Login {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/register"
		key="register"
		render={props => (
			<FrontPage title="D.LAB ON - 회원 선택">
				<UserTypeConfirm {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/register/agreement"
		key="register.agreement"
		render={props => (
			<FrontPage title="D.LAB ON - 약관 동의">
				<Agreement {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/register/user"
		key="register.user"
		render={props => (
			<FrontPage title="D.LAB ON - 회원 가입">
				<RegisterUser {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/register/child"
		key="register.child.user"
		render={props => (
			<FrontPage title="D.LAB ON - 학생 회원 가입">
				<RegisterUser {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/register/child/confirm"
		key="register.child.confirm"
		render={props => (
			<FrontPage title="D.LAB ON - 자녀 등록 선택">
				<ChildConfirm {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/register/user/:id/child"
		key="register.user.child"
		render={props => (
			<FrontPage title="D.LAB ON - 자녀 등록">
				<RegisterChild {...props} parent_id={props.match.params.id} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/register/welcome"
		key="register.welcome"
		render={props => (
			<FrontPage title="D.LAB ON - 회원 가입 완료" marginBottom0>
				<Welcome {...props} />
			</FrontPage>
		)}
	/>
];
