import React from "react";
import styled from "styled-components";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const Breadcrumb = ({ title }) => {
	return (
		<nav aria-label="breadcrumb" className="d-md-inline-block align-items-center">
			<StyledContainer className="breadcrumb breadcrumb-links">
				<StyledLi key="home" className="breadcrumb-item">
					<a href="/admin">
						<StyledIcon />
					</a>
				</StyledLi>
				{/*현재 active인 menu 출력*/}
				{adminSideMenus.map((sideMenu, _) => {
					if (!sideMenu.active) return null;
					return (
						<StyledLi key={_} className="breadcrumb-item">
							<a href={sideMenu.url}>{sideMenu.title}</a>
						</StyledLi>
					);
				})}
				<StyledLi className="breadcrumb-item">{title}</StyledLi>
			</StyledContainer>
		</nav>
	);
};

const StyledContainer = styled.ol`
	border: 0.063rem solid ${({ theme }) => theme.colors.primary};
	background-color: ${({ theme }) => theme.colors.white};
	color: ${({ theme }) => theme.colors.primary};
`;

const StyledIcon = styled(HomeRoundedIcon)`
	color: ${({ theme }) => theme.colors.primary};
`;

const StyledLi = styled.li`
	& + & {
		&::before {
			color: ${({ theme }) => theme.colors.primary};
		}
	}
`;

export default Breadcrumb;
