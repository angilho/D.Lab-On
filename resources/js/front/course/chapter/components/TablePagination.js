import React from "react";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const TablePagination = ({ links, firstPageUrl, lastPageUrl, onChange }) => {
	if (!links || links.length === 0) return null;
	return links.map((pageLink, idx) => {
		if (idx === 0)
			return (
				<React.Fragment key={idx}>
					<PageContainer>
						<StyledChevronLeftIcon onClick={() => onChange(links[0].url)} />
					</PageContainer>
				</React.Fragment>
			);

		if (idx === links.length - 1) {
			return (
				<React.Fragment key={idx}>
					<PageContainer>
						<StyledChevronRightIcon onClick={() => onChange(links[links.length - 1].url)} />
					</PageContainer>
				</React.Fragment>
			);
		}

		return (
			<PageContainer key={idx} active={pageLink.active}>
				<PageText onClick={() => onChange(pageLink.url)}>{pageLink.label}</PageText>
			</PageContainer>
		);
	});
};

const PageContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	@media only screen and (max-width: 767.98px) {
		width: 1.875rem;
		height: 1.875rem;
	}
	@media only screen and (min-width: 768px) {
		width: 1.875rem;
		height: 1.875rem;
		margin: 0 0.625rem;
	}
	${props =>
		props.active &&
		css`
			background-color: ${({ theme }) => theme.colors.primary};
			border-radius: 1.25rem;
			color: white;
		`}
`;

const StyledChevronLeftIcon = styled(ChevronLeftIcon)`
	cursor: pointer;
	@media only screen and (max-width: 767.98px) {
		font-size: 1.125rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.5rem;
	}
`;

const StyledChevronRightIcon = styled(ChevronRightIcon)`
	cursor: pointer;
	@media only screen and (max-width: 767.98px) {
		font-size: 1.125rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.5rem;
	}
`;

const PageText = styled(Text)`
	cursor: pointer;
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 2rem;
	}
`;

export default TablePagination;
