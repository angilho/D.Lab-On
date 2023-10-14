import React from "react";
import { Route } from "react-router-dom";

import FrontPage from "@components/pages/FrontPage";
import EventPage from "@components/eventPage";

export default [
	<Route
		exact
		path="/event/:name"
		key="event.name"
		render={({ match }) => {
			return (
				<FrontPage title="D.LAB ON" paddingBottom={0}>
					<EventPage name={match.params.name} />
				</FrontPage>
			);
		}}
	/>
];
