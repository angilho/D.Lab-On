import React from "react";
import { Route } from "react-router-dom";

import FrontPage from "@components/pages/FrontPage";
import OrganizationLogin from "../auth/organizationLogin";
import OrganizationPostList from "../front/organization/post/post-list";
import OrganizationPostCreate from "../front/organization/post/post-create";
import OrganizationPost from "../front/organization/post/post";

export default [
	<Route
		exact
		path="/organizations/:id/posts"
		key="organizations.posts"
		render={({ match }) => (
			<FrontPage title="D.LAB ON - B2B 게시판">
				<OrganizationPostList organization_id={match.params.id} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/organizations/:id/posts/create"
		key="organizations.id.posts.create"
		render={({ match }) => {
			return (
				<FrontPage title="D.LAB ON - B2B 게시판">
					<OrganizationPostCreate organization_id={match.params.id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/organizations/:id/posts/:post_id"
		key="organizations.id.posts.id.show"
		render={({ match }) => {
			return (
				<FrontPage title="D.LAB ON - B2B 게시판">
					<OrganizationPost organization_id={match.params.id} post_id={match.params.post_id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/organizations/:id/posts/:post_id/edit"
		key="organizations.id.posts.id.edit"
		render={({ match }) => {
			return (
				<FrontPage title="D.LAB ON - B2B 게시판">
					<OrganizationPostCreate organization_id={match.params.id} post_id={match.params.post_id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/:organization_path"
		key="organization.login"
		render={({ match }) => (
			<FrontPage title="D.LAB ON - B2B 로그인">
				<OrganizationLogin path={match.params.organization_path} />
			</FrontPage>
		)}
	/>
];
