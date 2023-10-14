import React from "react";
import styled from "styled-components";

import Text from "@components/elements/Text";

const InfoBox = ({ children }) => {
	return (
		<InfoboxContainer>
			<LabelContainer>
				<Text p4 primary className="d-inline">
					&nbsp;안내&nbsp;
				</Text>
			</LabelContainer>
			<InfoMessageContainer>{children}</InfoMessageContainer>
		</InfoboxContainer>
	);
};

const InfoboxContainer = styled.div`
	margin-top: 2.5rem;
	border: 1px solid ${({ theme }) => theme.colors.primary};
	border-radius: 0.25rem;
	padding: 0.625rem;
`;
const LabelContainer = styled.div`
	position: relative;
	display: inline;
	top: -1.5rem;
	left: 0rem;
	background-color: white;
`;

const InfoMessageContainer = styled.div`
	position: relative;
	top: -0.625rem;
`;

export default InfoBox;
