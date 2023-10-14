import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ThemeProvider } from "styled-components";
import palette from "@common/theme";

import Header from "@components/header";
import Footer from "@components/footer";
import Popup from "@components/popup";

import FrontRoute from "./routes/FrontRoute";
import AuthRoute from "./routes/AuthRoute";
import MypageRoute from "./routes/MypageRoute";
import UserRoute from "./routes/UserRoute";
import EventPageRoute from "./routes/EventPageRoute";
import AdminRoute from "./routes/AdminRoute";
import OrganizationRoute from "./routes/OrganizationRoute";
import ErrorRoute from "./routes/ErrorRoute";

class App extends Component {
	componentDidMount() {
		const firebaseConfig = {
			apiKey: "AIzaSyCOCH7zy9cOUmvd5yT7ZuuYpFr32bmCtfY",
			authDomain: "dlabon-d268d.firebaseapp.com",
			projectId: "dlabon-d268d",
			storageBucket: "dlabon-d268d.appspot.com",
			messagingSenderId: "314668190416",
			appId: "1:314668190416:web:d550d223491d4888f4acd5",
			measurementId: "G-7PE8RQPHN0"
		};
		firebase.initializeApp(firebaseConfig);
		firebase.auth().languageCode = "ko";
	}

	render() {
		return (
			<ThemeProvider theme={palette}>
				<BrowserRouter>
					<Popup />
					<div className="contents-wrapper">
						<Header />
						<Switch>
							{FrontRoute}
							{AuthRoute}
							{MypageRoute}
							{UserRoute}
							{EventPageRoute}
							{AdminRoute}
							{OrganizationRoute}
							{ErrorRoute}
						</Switch>
					</div>
					<Footer />
				</BrowserRouter>
			</ThemeProvider>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
