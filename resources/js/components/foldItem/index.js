import React, { useState } from "react";
import styled from "styled-components";
import Text from "@components/elements/Text";
import useSizeDetector from "@hooks/useSizeDetector";

import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

const FoldItem = ({ name, children }) => {
	const [isShow, setIsShow] = useState(false);
	const SizeDetector = useSizeDetector();
	return (
		<FoldItemContainer>
			<TitleContainer onClick={() => setIsShow(!isShow)}>
				<div className="mb-10">
					<Text p1 className="d-inline" fontWeight={500} fontSize={!SizeDetector.isDesktop ? 0.875 : null}>
						{name}
					</Text>
					{isShow ? <ExpandIcon /> : <FoldIcon />}
				</div>
			</TitleContainer>
			{isShow && <DescriptionContainer>{children}</DescriptionContainer>}
		</FoldItemContainer>
	);
};

const FoldItemContainer = styled.div`
	& + & {
		@media only screen and (max-width: 767.98px) {
			margin-top: 1.25rem;
		}
		@media only screen and (min-width: 768px) {
			margin-top: 2.5rem;
		}
	}
`;

const TitleContainer = styled.div`
	margin-bottom: 0.625rem;
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};
	cursor: pointer;
`;

const DescriptionContainer = styled.div``;

const ExpandIcon = styled(ExpandLessRoundedIcon)`
	display: inline;
	float: right;
	color: ${({ theme }) => theme.colors.gray};
`;

const FoldIcon = styled(ExpandMoreRoundedIcon)`
	display: inline;
	float: right;
	color: ${({ theme }) => theme.colors.gray};
`;

export default FoldItem;
