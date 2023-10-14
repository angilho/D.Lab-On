import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const FrontPage = ({ topBtnEnable, children, marginBottom0, paddingBottom, paddingBottomMobile, title }) => {
	const history = useHistory();

	useEffect(() => {
		const unlisten = history.listen(() => {
			window.scrollTo(0, 0);
		});
		return () => {
			unlisten();
		};
	}, []);

	useEffect(() => {
		document.title = title || "";
	}, [title]);

	const scrollToTop = () => {
		window.scroll({ top: 0, left: 0, behavior: "smooth" });
	};

	return (
		<MainContainer
			topBtnEnable={topBtnEnable}
			marginBottom0={marginBottom0}
			paddingBottom={paddingBottom}
			paddingBottomMobile={paddingBottomMobile}
		>
			{children}
			{topBtnEnable && (
				<TopBtnContainer className="container">
					<Row className="justify-content-center align-items-center" align="center">
						<Col>
							<Button circle onClick={scrollToTop}>
								<ArrowUpwardIcon />
							</Button>
							<Text
								p2
								cursor
								underline
								className="justify-content-center mt-10 cursor-pointer"
								onClick={scrollToTop}
							>
								맨 위로
							</Text>
						</Col>
					</Row>
				</TopBtnContainer>
			)}
		</MainContainer>
	);
};

const MainContainer = styled.div`
	${props => {
		if (!props.marginBottom0) {
			if (!props.topBtnEnable) {
				return css`
					@media only screen and (max-width: 767.98px) {
						${props =>
							props.paddingBottomMobile &&
							css`
								padding-bottom: ${props.paddingBottomMobile}rem;
							`}
						${props =>
							!props.paddingBottomMobile &&
							css`
								padding-bottom: 6.25rem;
							`}
					}
					@media only screen and (min-width: 768px) {
						${props =>
							props.paddingBottom &&
							css`
								padding-bottom: ${props.paddingBottom}rem;
							`}
						${props =>
							!props.paddingBottom &&
							css`
								padding-bottom: 12.5rem;
							`}
					}
				`;
			}
		}
	}}}
`;

const TopBtnContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1.25rem;
		margin-bottom: 2.5rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 2.5rem;
		margin-bottom: 3.75rem;
	}
`;

export default FrontPage;
