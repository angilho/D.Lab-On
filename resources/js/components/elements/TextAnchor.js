import React from "react";
import styled, { css } from "styled-components";

const TextAnchor = ({ children, ...props }) => {
	return (
		<StyledTextAnchor
			onClick={event => {
				event.stopPropagation();
			}}
			{...props}
		>
			{children}
		</StyledTextAnchor>
	);
};

const sizeStyles = css`
	${props =>
		props.mainHeader &&
		css`
			font-family: BMDOHYEON;
			@media only screen and (max-width: 767.98px) {
				font-size: ${({ theme }) => theme.fontSizes.h5};
				line-height: ${({ theme }) => theme.lineHeights.h5};
			}

			@media only screen and (min-width: 768px) {
				font-size: ${({ theme }) => theme.fontSizes.mainHeader};
			}
		`}
	${props =>
		props.h1 &&
		css`
			font-family: BMDOHYEON;
			@media only screen and (max-width: 767.98px) {
				font-size: ${({ theme }) => theme.fontSizes.h1_m_headline};
				line-height: ${({ theme }) => theme.lineHeights.h1_m_headline};
			}

			@media only screen and (min-width: 768px) {
				font-size: ${({ theme }) => theme.fontSizes.h1};
				line-height: ${({ theme }) => theme.lineHeights.h1};
			}
		`}
	${props =>
		props.h2 &&
		css`
			font-family: BMDOHYEON;
			@media only screen and (max-width: 767.98px) {
				font-size: ${({ theme }) => theme.fontSizes.h5};
				line-height: ${({ theme }) => theme.lineHeights.h5};
			}

			@media only screen and (min-width: 768px) {
				font-size: ${({ theme }) => theme.fontSizes.h2};
				line-height: ${({ theme }) => theme.lineHeights.h2};
			}
		`}
	${props =>
		props.h3 &&
		css`
			font-family: BMDOHYEON;
			@media only screen and (max-width: 767.98px) {
				font-size: ${({ theme }) => theme.fontSizes.p1};
				line-height: ${({ theme }) => theme.lineHeights.p1};
			}

			@media only screen and (min-width: 768px) {
				font-size: ${({ theme }) => theme.fontSizes.h3};
				line-height: ${({ theme }) => theme.lineHeights.h3};
			}
		`}
	${props =>
		props.h4 &&
		css`
			font-family: BMDOHYEON;
			@media only screen and (max-width: 767.98px) {
				font-size: ${({ theme }) => theme.fontSizes.h1_m_headline};
				line-height: ${({ theme }) => theme.lineHeights.h1_m_headline};
			}

			@media only screen and (min-width: 768px) {
				font-size: ${({ theme }) => theme.fontSizes.h4};
				line-height: ${({ theme }) => theme.lineHeights.h4};
			}
		`}
	${props =>
		props.h5 &&
		css`
			font-family: Noto Sans KR;
			@media only screen and (max-width: 767.98px) {
				font-weight: 700;
				font-size: ${({ theme }) => theme.fontSizes.h5_mobile};
				line-height: ${({ theme }) => theme.lineHeights.h5_mobile};
			}

			@media only screen and (min-width: 768px) {
				font-weight: 700;
				font-size: ${({ theme }) => theme.fontSizes.h5};
				line-height: ${({ theme }) => theme.lineHeights.h5};
			}
		`}
	${props =>
		props.h6 &&
		css`
			font-family: Noto Sans KR;
			@media only screen and (max-width: 767.98px) {
				font-weight: 300;
				font-size: ${({ theme }) => theme.fontSizes.p2};
				line-height: ${({ theme }) => theme.lineHeights.p2};
			}
			@media only screen and (min-width: 768px) {
				font-weight: 400;
				font-size: ${({ theme }) => theme.fontSizes.h6};
				line-height: ${({ theme }) => theme.lineHeights.h6};
			}
		`}
	${props =>
		props.p1 &&
		css`
			font-family: Noto Sans KR;
			@media only screen and (max-width: 767.98px) {
				font-weight: 300;
				font-size: ${({ theme }) => theme.fontSizes.p5};
				line-height: ${({ theme }) => theme.lineHeights.p5};
			}
			@media only screen and (min-width: 768px) {
				font-weight: 400;
				font-size: ${({ theme }) => theme.fontSizes.p1};
				line-height: ${({ theme }) => theme.lineHeights.p1};
			}
		`}
	${props =>
		props.p2 &&
		css`
			font-family: Noto Sans KR;
			@media only screen and (max-width: 767.98px) {
				font-weight: 300;
				font-size: ${({ theme }) => theme.fontSizes.p3};
				line-height: ${({ theme }) => theme.lineHeights.p3};
			}
			@media only screen and (min-width: 768px) {
				font-weight: 400;
				font-size: ${({ theme }) => theme.fontSizes.p2};
				line-height: ${({ theme }) => theme.lineHeights.p2};
			}
		`}
	${props =>
		props.p3 &&
		css`
			font-family: Noto Sans KR;
			@media only screen and (max-width: 767.98px) {
				font-weight: 300;
				font-size: ${({ theme }) => theme.fontSizes.p4};
				line-height: ${({ theme }) => theme.lineHeights.p4};
			}
			@media only screen and (min-width: 768px) {
				font-weight: 400;
				font-size: ${({ theme }) => theme.fontSizes.p3};
				line-height: ${({ theme }) => theme.lineHeights.p3};
			}
		`}
	${props =>
		props.p4 &&
		css`
			font-family: Noto Sans KR;
			@media only screen and (max-width: 767.98px) {
				font-weight: 300;
				font-size: ${({ theme }) => theme.fontSizes.p5};
				line-height: ${({ theme }) => theme.lineHeights.p5};
			}
			@media only screen and (min-width: 768px) {
				font-weight: 300;
				font-size: ${({ theme }) => theme.fontSizes.p4};
				line-height: ${({ theme }) => theme.lineHeights.p4};
			}
		`}
	${props =>
		props.p5 &&
		css`
			font-family: Noto Sans KR;
			font-weight: 300;
			font-size: ${({ theme }) => theme.fontSizes.p5};
			line-height: ${({ theme }) => theme.lineHeights.p5};
		`}
`;

const StyledTextAnchor = styled.a`
	display: flex;
	font-family: Noto Sans KR;
	color: black;
	${sizeStyles}

	${props =>
		props.underline &&
		css`
			text-decoration: underline;
		`}
	${props =>
		props.gray2 &&
		css`
			color: ${({ theme }) => theme.colors.gray2};
		`}
	${props =>
		props.gray3 &&
		css`
			color: ${({ theme }) => theme.colors.gray3};
		`}
	${props =>
		props.gray4 &&
		css`
			color: ${({ theme }) => theme.colors.gray4};
		`}
	${props =>
		props.white &&
		css`
			color: #ffffff;
		`}
	${props =>
		props.fontWeight &&
		css`
			font-weight: ${props.fontWeight} !important;
		`}
	
`;

export default TextAnchor;
