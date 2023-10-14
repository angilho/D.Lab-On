import React from "react";
import styled, { css } from "styled-components";
import FooterLogo from "@images/icon/footerLogo.png";
import FooterLogoWhite from "@images/icon/footerLogoWhite.png";
import HeaderLogo from "@images/icon/headerLogo.png";
import MobileLogo from "@images/icon/mobileLogo.png";
import useSizeDetector from "@hooks/useSizeDetector";

const Logo = ({ header, white }) => {
	const SizeDetector = useSizeDetector();
	if (header) {
		return (
			<React.Fragment>
				<SizeDetector.Desktop>
					<HeaderLogoImg src={HeaderLogo} />
				</SizeDetector.Desktop>
				<SizeDetector.Mobile>
					<MobileLogoImg src={HeaderLogo} />
				</SizeDetector.Mobile>
			</React.Fragment>
		);
	}

	return <LogoImg src={white ? FooterLogoWhite : HeaderLogo} />;
};

const LogoImg = styled.img`
	@media only screen and (min-width: 768px) {
		width: 139px;
		height: 37px;
	}
	@media only screen and (max-width: 767.98px) {
		width: 86px;
		height: 23px;
	}
`;

const HeaderLogoImg = styled.img`
	@media only screen and (min-width: 768px) {
		width: 113px;
		height: 30px;
	}
`;

const MobileLogoImg = styled.img`
	@media only screen and (max-width: 767.98px) {
		width: 88px;
		height: 23px;
	}
`;

export default Logo;
