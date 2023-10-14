import React from "react";
import { Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Text from "@components/elements/Text";
import FrontPage from "@components/pages/FrontPage";

export default [
	<Route
		key="error.404"
		render={props => (
			<FrontPage title="404 Not Found">
				<div className="container">
					<Row className="mt-40">
						<Col>
							<Text h5>Page Not Found</Text>
						</Col>
					</Row>
					<Row className="mt-40">
						<Col>
							<Text p3>페이지를 찾을 수 없습니다.</Text>
						</Col>
					</Row>
				</div>
			</FrontPage>
		)}
	/>
];
