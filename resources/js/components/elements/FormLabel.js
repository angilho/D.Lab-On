import React from "react";
import styled, { css } from "styled-components";

const FormLabel = ({ children, required, ...props }) => {
	return (
		<StyledFormLabel {...props}>
			{children}
			{required && <span className="text-danger">&nbsp;*</span>}
		</StyledFormLabel>
	);
};

const StyledFormLabel = styled.label`
	display: flex;
	font-weight: 300;
	@media only screen and (max-width: 767.98px) {
		margin: 40px 0px 20px 0px;
	}
	@media only screen and (min-width: 768px) {
		font-size: ${({ theme }) => theme.fontSizes.p3};
		line-height: 1.438rem;
		margin-bottom: 0.625rem;
	}

	letter-spacing: -0.063rem;
`;

export default FormLabel;
