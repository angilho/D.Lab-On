import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Text from "@components/elements/Text";

const NavbarItem = ({ title, url, redirect }) => {
	return (
		<StyledItem>
			{redirect ? (
				<a className="nav-link" href={url ?? "#"} activeclassname="active">
					<Text p3>{title ?? ""}</Text>
				</a>
			) : (
				<NavLink className="nav-link" to={url ?? "#"} activeclassname="active">
					<Text p3>{title ?? ""}</Text>
				</NavLink>
			)}
		</StyledItem>
	);
};

const StyledItem = styled.li`
	margin-right: 2.5rem;
	.active {
		//background-color: red;
	}
`;

export default NavbarItem;
