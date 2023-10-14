import React from "react";
import styled, { css } from "styled-components";

const Button = ({ children, size, circle, ...props }) => {
	if (circle) {
		return <CircleButton {...props}>{children}</CircleButton>;
	}

	return (
		<StyledButton size={size || "small"} {...props}>
			{children}
		</StyledButton>
	);
};

const sizeStyles = css`
	${props =>
		props.size === "large" &&
		css`
			height: 3rem;
			font-weight: 400;
			line-height: 2rem;
			font-size: 1.125rem;
		`}
	${props =>
		props.size === "small" &&
		css`
			height: 2.25rem;
			line-height: 1.75rem;
			font-size: 1rem;
		`}
	${props =>
		props.minWidth &&
		css`
			min-width: ${props.minWidth}rem !important;
		`}
`;

const colors = {
	disableBtnBackground: "#F0F0F0",
	dangerBtnBackground: "#FF2D00",
	dangerBtnHoverBackground: "#FF0800"
};

const colorStyles = css`
	${props =>
		props.primary &&
		css`
			background: ${({ theme }) => theme.colors.primary};
			color: ${({ theme }) => theme.colors.white};

			&:hover {
				background: ${({ theme }) => theme.colors.secondary};
			}

			&:active {
				background: ${({ theme }) => theme.colors.secondary};
				-webkit-box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
				-moz-box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
				box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
			}

			&:disabled {
				background: ${colors.disableBtnBackground};
				color: ${({ theme }) => theme.colors.gray};
			}
		`}
	${props =>
		props.secondary &&
		css`
			background: none;
			border: 0.063rem solid ${({ theme }) => theme.colors.primary};
			color: ${({ theme }) => theme.colors.primary};

			&:hover {
				color: ${({ theme }) => theme.colors.secondary};
				border: 0.063rem solid ${({ theme }) => theme.colors.secondary};
			}

			&:active {
				color: ${({ theme }) => theme.colors.secondary};
				border: 0.063rem solid ${({ theme }) => theme.colors.secondary};
				-webkit-box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
				-moz-box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
				box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
			}

			&:disabled {
				border: 0.063rem solid ${colors.disableBtnBackground};
				color: ${({ theme }) => theme.colors.gray};
			}
		`}
		${props =>
			props.danger &&
			css`
				background: ${colors.dangerBtnBackground};
				color: ${({ theme }) => theme.colors.white};

				&:hover {
					background: ${colors.dangerBtnHoverBackground};
				}

				&:active {
					background: ${colors.dangerBtnHoverBackground};
					-webkit-box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
					-moz-box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
					box-shadow: inset 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
				}

				&:disabled {
					background: ${colors.disableBtnBackground};
					color: ${({ theme }) => theme.colors.gray};
				}
			`}
`;

const StyledButton = styled.button`
	/* 공통 버튼 스타일 */
	outline: none;
	border: none;
	border-radius: 0.25rem;
	letter-spacing: 0;
	${sizeStyles}
	${colorStyles}
	
	& + & {
		margin-left: 0.5rem;
	}
`;

const CircleButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	-webkit-box-shadow: 0rem 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
	-moz-box-shadow: 0rem 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
	box-shadow: 0rem 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
	cursor: pointer;

	/*상자에 호버 되었을 경우*/
	${props =>
		props.hover &&
		css`
			color: ${({ theme }) => theme.colors.primary};
		`}

	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

export default Button;
