import React from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

const Separator = () => {
	return (
		<StyledRow>
			<Col>
				<StyledSeparator />
			</Col>
		</StyledRow>
	);
};

const StyledRow = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		margin-top: 3.75rem;
		margin-bottom: 2.5rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 6.25rem;
		margin-bottom: 3.75rem;
	}
`;

const StyledSeparator = styled.hr`
	margin-top: 0;
	margin-bottom: 0;
	background-color: ${({ theme }) => theme.colors.gray};
`;

export default Separator;
