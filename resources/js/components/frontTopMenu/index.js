import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";

const FrontTopMenu = ({ menu, index, fixed, sticky, scrollBlock, onChange }) => {
	const [selectedIdx, setSelectedIdx] = useState(index ?? 0);

	useEffect(() => {
		if (selectedIdx != index) setSelectedIdx(index);
		if (onChange) onChange(selectedIdx);
	}, [selectedIdx, index]);

	const handleChange = (idx, link) => {
		setSelectedIdx(idx);

		const id = link.replace("#", "");
		const element = document.getElementById(id);
		if (element) element.scrollIntoView({ behavior: "smooth", block: scrollBlock ?? "center" });
	};

	return (
		<FrontTopMenuContainer fixed={fixed} sticky={sticky} className={fixed ? "fixed-top" : null}>
			{!fixed && !sticky && <ContainerBottom className="container" />}
			<div className="container">
				<Row>
					<Col>
						<MenuContainer>
							{menu.map(({ title, link }, idx) => {
								let selected = selectedIdx === idx;
								return (
									<TitleContainer
										className="align-items-center"
										onClick={() => handleChange(idx, link)}
										key={idx}
									>
										<TitleText p2 primary={selected} fontWeight={selected ? 500 : 300}>
											{title}
										</TitleText>
										{selected && <TitleBorder />}
									</TitleContainer>
								);
							})}
						</MenuContainer>
					</Col>
				</Row>
			</div>
		</FrontTopMenuContainer>
	);
};

const FrontTopMenuContainer = styled.div`
	${props =>
		props.fixed &&
		css`
			@media only screen and (max-width: 767.98px) {
				top: 3rem;
			}
			@media only screen and (min-width: 768px) {
				top: 6.5rem;
			}
			position: fixed;
		`}
	${props =>
		props.sticky &&
		css`
			@media only screen and (max-width: 767.98px) {
				top: 3rem;
			}
			@media only screen and (min-width: 768px) {
				top: 6.5rem;
			}
			position: sticky;
		`}
	z-index: 1030;
	background-color: white;
`;

const ContainerBottom = styled.div`
	position: relative;
	border-bottom: 1px solid #dcdcdc;
	@media only screen and (max-width: 767.98px) {
		top: 3rem;
	}
	@media only screen and (min-width: 768px) {
		top: 4.438rem;
	}
`;

const TitleContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		& + & {
			margin-left: auto;
		}
		margin-top: 0.813rem;
	}
	@media only screen and (min-width: 768px) {
		& + & {
			margin-left: 5rem;
		}
		margin-top: 1.25rem;
	}
	cursor: pointer;
`;

const MenuContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

const TitleText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		font-size: 13px;
		line-height: 16px;
	}
	${props =>
		props.primary &&
		css`
			color: ${({ theme }) => theme.colors.primary};
		`}
`;

const TitleBorder = styled.div`
	height: 4px;
	margin-bottom: 1px;
	@media only screen and (max-width: 767.98px) {
		margin-top: 0.475rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 1.25rem;
	}

	background-color: ${({ theme }) => theme.colors.primary};
`;

export default FrontTopMenu;
