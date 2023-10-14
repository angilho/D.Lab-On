import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import Cookies from "js-cookie";
import * as api from "@common/api";

const Popup = ({}) => {
	const location = useLocation();
	const [popupHtml, setPopupHtml] = useState("");

	window.noMoreToday = function(key) {
		Cookies.set(`popup_no_more_today_${key}`, "true", { expires: 1 });
		setPopupHtml(null);
	};

	window.popupClose = function() {
		setPopupHtml(null);
	};

	useEffect(() => {
		if (Cookies.get("popup_no_more_today_popup1") !== "true") {
			api.getPopup("index").then(res => {
				setPopupHtml(res.data);
			});
		}
	}, []);

	if (location.pathname !== "/") return null;
	if (!popupHtml) return null;
	if (Cookies.get("popup_no_more_today_popup1") === "true") return null;

	return <Container dangerouslySetInnerHTML={{ __html: popupHtml }} />;
};

const Container = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: 100000;
	background: rgba(0, 0, 0, 0.5);
`;
export default Popup;
