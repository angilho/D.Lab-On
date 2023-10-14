import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Row, Col } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";

import Logo from "@components/elements/Logo";
import Text from "@components/elements/Text";
import TextAnchor from "@components/elements/TextAnchor";

import useSizeDetector from "@hooks/useSizeDetector";

import Instagram from "@images/icon/instagram.svg";
import Facebook from "@images/icon/facebook.svg";
import Blog from "@images/icon/blog.svg";
import Kakaotalk from "@images/icon/kakaotalk.svg";

import InstagramWhite from "@images/icon/instagramWhite.png";
import FacebookWhite from "@images/icon/facebookWhite.png";
import BlogWhite from "@images/icon/blogWhite.png";
import KakaotalkWhite from "@images/icon/kakaotalkWhite.png";

import FooterKakaotalk from "@images/icon/footerKakao.png";
import WelcomeWave from "@images/register/welcomeWave.png";

const Footer = () => {
	const SizeDetector = useSizeDetector();
	const history = useHistory();
	const location = useLocation();
	const [isWave, setIsWave] = useState(false);

	useEffect(() => {
		//wave를 보여줄 라우터를 지정한다.
		if (
			(location.pathname.includes("/user/delete/complete") || location.pathname.includes("/register/welcome")) &&
			SizeDetector.isDesktop
		)
			setIsWave(true);
		else if (isWave !== false) setIsWave(false);
	}, [location, SizeDetector.isDesktop]);

	const onClickInstagram = () => {
		window.open("https://www.instagram.com/dlab_code_academy/");
	};

	const onClickBlog = () => {
		window.open("https://blog.naver.com/daddyslab");
	};

	const onClickFacebook = () => {
		window.open("https://www.facebook.com/daddyslab");
	};

	const onClickKakaotalk = () => {
		window.open("http://pf.kakao.com/_Zxclls");
	};

	const renderFooterRight = () => {
		return (
			<Col>
				<SizeDetector.Desktop>
					<Row>
						<Col>
							<Text p4 white={isWave} className="d-inline">
								(주)디랩
							</Text>
							<Text p4 white={isWave} className="d-inline ml-10 mr-10">
								|
							</Text>
							<Text p4 white={isWave} className="d-inline">
								대표 송영광
							</Text>
							<Text p4 white={isWave} className="d-inline ml-10 mr-10">
								|
							</Text>
							<Text p4 white={isWave} className="d-inline">
								고객센터: 031-526-9313
							</Text>
							<Text p4 white={isWave} className="d-inline ml-10 mr-10">
								|
							</Text>
							<div className="d-inline cursor-pointer" onClick={onClickKakaotalk}>
								<Text p4 white={isWave} className="d-inline">
									카카오 채널 바로가기
								</Text>
								<FooterKakaoImg src={isWave ? KakaotalkWhite : FooterKakaotalk} />
							</div>
							<Text p4 white={isWave} className="d-inline ml-10 mr-10">
								|
							</Text>
							<Text p4 white={isWave} className="d-inline">
								이메일:&nbsp;
							</Text>
							<TextAnchor
								p4
								white={isWave}
								className="d-inline"
								target="_blank"
								href="mailto:dlabon@daddyslab.com"
							>
								dlabon@daddyslab.com
							</TextAnchor>
						</Col>
					</Row>
					<Row>
						<Col>
							<Text p4 white={isWave} className="d-inline">
								주소: 경기도 성남시 분당구 운중로 138번길 7, KT빌딩 3층
							</Text>
							<Text p4 white={isWave} className="d-inline ml-10 mr-10">
								|
							</Text>
							<Text p4 white={isWave} className="d-inline">
								상담: 월~금요일 오전 9시 ~ 저녁 6시(점심시간: 12:30~13:30)
							</Text>
						</Col>
					</Row>
					<Row>
						<Col>
							<LineChangeText p4 white={isWave}>
								사업자번호 : 847-81-00387
							</LineChangeText>
							<MobileHideText p4 white={isWave} className="d-inline ml-10 mr-10">
								|
							</MobileHideText>
							<Text p4 white={isWave} className="d-inline">
								통신판매업 신고번호 2016-성남분당-0097
							</Text>
							<MobileHideText p4 white={isWave} className="d-inline ml-10 mr-10">
								|
							</MobileHideText>
							<Text p4 white={isWave} className="d-inline">
								학원등록번호 : 제6320호
							</Text>
						</Col>
					</Row>
				</SizeDetector.Desktop>
				<SizeDetector.Mobile>
					<Row className="mt-12">
						<Col>
							<Text p4 white={isWave} className="d-inline">
								(주)디랩 | 대표 송영광 |
							</Text>
						</Col>
					</Row>
					<Row>
						<Col>
							<Text p4 white={isWave} className="d-inline">
								고객센터: 031-526-9313 | 이메일:&nbsp;
							</Text>
							<TextAnchor
								p4
								white={isWave}
								className="d-inline"
								target="_blank"
								href="mailto:dlabon@daddyslab.com"
							>
								dlabon@daddyslab.com
							</TextAnchor>
							<Text p4 white={isWave} className="d-inline">
								&nbsp;|
							</Text>
						</Col>
					</Row>
					<Row>
						<Col>
							<Text p4 white={isWave}>
								주소: 경기도 성남시 분당구 운중로 138번길 7, KT빌딩 3층 |
							</Text>
							<Text p4 white={isWave}>
								상담: 월~금요일 오전 9시 ~ 저녁 6시(점심시간: 12:30~13:30)
							</Text>
						</Col>
					</Row>

					<Row className="mt-12">
						<Col>
							<LineChangeText p4 white={isWave}>
								사업자번호 : 847-81-00387
							</LineChangeText>
							<LineChangeText p4 white={isWave}>
								통신판매업 신고번호 2016-성남분당-0097
							</LineChangeText>
							<LineChangeText p4 white={isWave}>
								학원등록번호 : 제6320호
							</LineChangeText>
						</Col>
					</Row>
				</SizeDetector.Mobile>
			</Col>
		);
	};

	return (
		<footer>
			<FooterContainer wave={isWave} src={WelcomeWave}>
				<FooterWrapper
					wave={isWave}
					className={`container ${SizeDetector.isDesktop ? "mt-54 mb-36" : "mt-32 mb-32"}`}
				>
					<Row>
						<Col md={5}>
							<Text p2 className="mb-4 w-100" white={isWave}>
								go to&nbsp;
								<TextAnchor target="_blank" href="https://daddyslab.com" underline white={isWave}>
									daddyslab.com
								</TextAnchor>
							</Text>
						</Col>
					</Row>
					<Row>
						<Col md={5} className="d-flex flex-column justify-content-between">
							<Row xs={1} md={2}>
								<Col>
									<Logo white={isWave} className="d-inline" />
								</Col>
								<SizeDetector.Desktop>
									<Col className="align-self-center">
										<Icon
											wave={isWave}
											waveSvg={InstagramWhite}
											svg={Instagram}
											onClick={onClickInstagram}
										/>
										<Icon
											wave={isWave}
											waveSvg={FacebookWhite}
											svg={Facebook}
											onClick={onClickFacebook}
										/>
										<Icon
											wave={isWave}
											waveSvg={KakaotalkWhite}
											svg={Kakaotalk}
											onClick={onClickKakaotalk}
										/>
										<Icon wave={isWave} waveSvg={BlogWhite} svg={Blog} onClick={onClickBlog} />
									</Col>
								</SizeDetector.Desktop>
							</Row>
							<Row>
								<Col>
									<TextAnchor
										p3
										white={isWave}
										gray3
										className="d-inline"
										target="_blank"
										href={`/static/policy/terms_of_service.html?v=${appVersion}`}
									>
										이용약관
									</TextAnchor>
									<TextAnchor
										p3
										white={isWave}
										gray3
										className="d-inline ml-16"
										target="_blank"
										href={`/static/policy/privacy_statement.html?v=${appVersion}`}
									>
										개인정보처리방침
									</TextAnchor>
									<TextAnchor
										p3
										white={isWave}
										gray3
										className="d-inline ml-16 mr-16"
										target="_blank"
										href={`/static/policy/refund_policy.html?v=${appVersion}`}
									>
										환불정책
									</TextAnchor>
									<LineChangeTextAnchor
										p3
										white={isWave}
										gray3
										target="_blank"
										href={`/static/policy/school_certification.html?v=${appVersion}`}
									>
										학원설립 운영등록 증명서
									</LineChangeTextAnchor>
								</Col>
							</Row>
						</Col>
						{renderFooterRight()}
					</Row>
					<SizeDetector.Mobile>
						<Row>
							<Col className="mt-12 align-self-center">
								<Icon
									wave={isWave}
									svg={Instagram}
									waveSvg={InstagramWhite}
									onClick={onClickInstagram}
								/>
								<Icon wave={isWave} svg={Facebook} waveSvg={FacebookWhite} onClick={onClickFacebook} />
								<Icon
									wave={isWave}
									svg={Kakaotalk}
									waveSvg={KakaotalkWhite}
									onClick={onClickKakaotalk}
								/>
								<Icon wave={isWave} svg={Blog} waveSvg={BlogWhite} onClick={onClickBlog} />
							</Col>
						</Row>
					</SizeDetector.Mobile>
					<Row>
						<Col>
							<Text p3 wave={isWave} gray3={!isWave} white={isWave}>
								© 2021 D.LAB Inc. All rights reserved
							</Text>
						</Col>
					</Row>
				</FooterWrapper>
			</FooterContainer>
		</footer>
	);
};

const FooterContainer = styled.div`
	${props =>
		!props.wave &&
		css`
			border-top: 0.063rem solid ${({ theme }) => theme.colors.gray};
		`}

	${props =>
		props.wave &&
		css`
			display: flex;
			height: 351px;
			background-image: url(${props.src});
			background-repeat: no-repeat;
			margin-top: 64px;
		`}
`;

const FooterWrapper = styled.div`
	${props =>
		props.wave &&
		css`
			display: flex;
			flex-direction: column;
			align-self: flex-end;
		`}
`;

const Icon = styled.div`
	display: inline-block;
	width: 25px;
	height: 24px;
	cursor: pointer;
	fill: ${({ theme }) => theme.colors.gray3};
	${props =>
		props.wave &&
		css`
			fill: ${({ theme }) => theme.colors.white} !important;
			background-image: url(${props.waveSvg});
		`}
	${props =>
		!props.wave &&
		css`
			background-image: url(${props.svg});
		`}
	& + & {
		margin-left: 1rem;
	}
`;

const MobileHideText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		display: none !important;
	}
`;

const LineChangeText = styled(Text)`
	@media only screen and (min-width: 768px) {
		display: inline;
	}
`;

const LineChangeTextAnchor = styled(TextAnchor)`
	@media only screen and (min-width: 768px) {
		display: inline;
	}
`;

const FooterKakaoImg = styled.img`
	width: 1rem;
	height: 1rem;
	margin-left: 0.25rem;
	cursor: pointer;
`;

const WaveImg = styled.img`
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: -1000;
`;

export default Footer;
