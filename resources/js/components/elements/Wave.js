import React from "react";
import styled, { css } from "styled-components";

const Wave = props => {
	let height = props.fixedTop ? 241 : 437;
	return (
		<WaveContainer top={props.top || 0}>
			<svg
				width="100%"
				height={`${height}px`}
				viewBox={`0 0 2560 ${height}`}
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xlink="http://www.w3.org/1999/xlink"
			>
				<g id="수업소개#" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
					<g id="note/course/web" fill="#FF5100">
						<path
							d="M2560.00457,5.68434189e-14 L0.00457293242,5.68434189e-14 L0.00457293242,426.908488 C509.7562,449.891273 937.546611,431.975426 1283.37581,373.160946 C1802.1196,284.939226 2438.23343,318.633171 2560.00457,356.414986 L2560.00457,5.68434189e-14 Z"
							id="Path-2"
						></path>
					</g>
				</g>
			</svg>
		</WaveContainer>
	);
};

const WaveContainer = styled.div`
	width: 100%;
	z-index: -1030;
	background-color: white;

	${props =>
		props.fixedTop
			? css`
					position: fixed;
			  `
			: css`
					position: absolute;
			  `}

	${props =>
		props.top &&
		css`
			top: ${props.top}rem;
		`}
`;

export default Wave;
