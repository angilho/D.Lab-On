import React from "react";
import { Form } from "react-bootstrap";
import styled, { css } from "styled-components";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

const FormControl = ({ error, onClick, ...props }) => {
	if (props.type == "file") {
		return <StyledFileControl error={error} {...props} />;
	}
	if (onClick) {
		return <StyledControl error={error} {...props} />;
	}
	if (props.as === "select") {
		return (
			<React.Fragment>
				<div className="position-relative">
					<StyledControl className="form-control" error={error} {...props} />
					<SelectArrow>
						<ArrowIcon />
					</SelectArrow>
				</div>
			</React.Fragment>
		);
	}
	return <StyledControl error={error} {...props} />;
};

const colors = {
	default: "#E1E1E1",
	error: "#FF0000"
};

const textStyles = css`
	&::placeholder {
		color: ${colors.default};
		line-height: 28px;
	}

	&:focus {
		border: 0.063rem solid ${({ theme }) => theme.colors.black};
	}

	${props =>
		props.error &&
		css`
			border: 0.063rem solid ${colors.error};
		`}
`;

const StyledControl = styled.input`
	display: flex;
	height: 3rem;
	/*small size FormControl*/
	width: ${props => (props.smallSize ? "100px" : "23.75rem")};
	margin-bottom: 1.25rem;
	padding: 1px 2px 1px 2px;

	border: 0.063rem solid ${colors.default};
	border-radius: 0.25rem;
	text-indent: 1rem;

	${textStyles}
	
	/*TextArea로 사용될 경우 높이를 주자*/
	${props =>
		props.as === "textarea" &&
		css`
			height: 8rem;
			text-indent: 0rem;
			padding: 1rem;
		`}
	${props => props.as === "select" && css``}
`;

const StyledFileControl = styled(Form.File)`
	display: flex;
	width: 23.75rem;
	max-width: 23.75rem;
	border: 0.063rem solid ${colors.default};
	border-radius: 0.25rem;
	margin-bottom: 1.25rem;
`;

const SelectArrow = styled.span`
	position: absolute;
	top: 0.625rem;
	right: 0.75rem;
	pointer-events: none;
`;

const ArrowIcon = styled(ExpandMoreRoundedIcon)`
	fill: ${colors.default} !important;
`;

export default FormControl;
