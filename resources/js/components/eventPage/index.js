import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";

const EventPage = ({ name }) => {
	const iframeEl = useRef(null);
	const [iframeHeight, setIframeHeight] = useState(0);
	const history = useHistory();
	const changeIframeSize = () => {
		setIframeHeight(iframeEl.current.contentWindow.document.body.scrollHeight + "px");
	};
	const iframeLoaded = () => {
		changeIframeSize();
		window.addEventListener("resize", changeIframeSize);
		return () => window.removeEventListener("resize", changeIframeSize);
	};

	useEffect(() => {
		const unlisten = history.listen(location => {
			const elements = document.getElementsByClassName("floating_button");
			while (elements.length > 0) {
				elements[0].parentNode.removeChild(elements[0]);
			}
		});
		return function cleanup() {
			unlisten();
		};
	}, []);

	return (
		<div className="container">
			<EventPageIframe
				ref={iframeEl}
				height={iframeHeight}
				src={`/static/event/${name}/index.html?v=${appVersion}`}
				onLoad={iframeLoaded}
				frameBorder={0}
				scrolling={"no"}
			/>
		</div>
	);
};

const EventPageIframe = styled.iframe`
	width: 100%;
`;

export default EventPage;
