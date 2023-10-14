import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import styled, { css } from "styled-components";
import { Row, Col } from "react-bootstrap";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import CourseCard from "@components/courseCard";
import Carousel from "@components/carousel";
import ImageFader from "./components/ImageFader";

import BackgroundImage from "@images/main/background.png";
import SecondBackgroundImage from "@images/main/background2.png";
import MarinBoyImage from "@images/main/marinBoy.gif";
import TurtleImage from "@images/main/turtle.png";
import KneeGirlImage from "@images/main/kneeGirl.gif";
import BoyThinkImage from "@images/main/boyThink.png";
import BlackWaveImage from "@images/main/blackWave.png";
import BlackWaveMobileImage from "@images/main/blackWaveMobile.png";
import LeftImage from "@images/main/leftPic.png";
import RightImage from "@images/main/rightPic.png";
import BackgroundSea from "@images/main/backgroundSea.png";
import BackgroundTeacher from "@images/main/backgroundTeacher.png";
import BackgroundTeacherMobile from "@images/main/backgroundTeacherMobile.png";
import PalmGirlImage from "@images/main/palmGirl.gif";
import PcMarinBoyImage from "@images/main/pcMarinBoy.gif";

import SliderImage1 from "@images/main/sliderImage1.png";
import SliderImage2 from "@images/main/sliderImage2.png";
import SliderImage3 from "@images/main/sliderImage3.png";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import AccountIcon from "@images/icon/account.svg";
import VideoIcon from "@images/icon/video.svg";
import RefreshOkIcon from "@images/icon/refreshOk.svg";

import useSizeDetector from "@hooks/useSizeDetector";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const FrontMainLandingPage = ({}) => {
	const SizeDetector = useSizeDetector();
	const history = useHistory();
	const sectionMarginTop = SizeDetector.isDesktop ? "mt-100" : "mt-60";
	const descriptionMarginTop = SizeDetector.isDesktop ? "mt-40" : "mt-10";
	const courseCardList = [2, 3, 4, 10, 5, 6];
	const [courses, setCourses] = useState({});

	useEffect(() => {
		if (amplitude) amplitude.getInstance().logEvent("Visit");
		ctrl.getCourses(courseCardList, setCourses);
	}, []);

	const renderSlider = () => {
		return (
			<SliderContainer>
				<Carousel show={SizeDetector.isDesktop ? 3 : 2}>
					{courses.data &&
						courses.data.map((course, idx) => {
							let coursePrice = course.price - course.discount_price;
							return (
								<CourseCard
									key={idx}
									thumbnail={`/storage/files/${course.thumbnail.filename}`}
									title={course.name}
									id={course.id}
									price={coursePrice}
								/>
							);
						})}
				</Carousel>
			</SliderContainer>
		);
	};

	const renderCourseGrid = () => {
		return (
			<div className="container mt-20 mb-40">
				<Row xs={2}>
					{courses.data &&
						courses.data.map((course, idx) => {
							let paddingName = idx % 2 === 0 ? "pr-6" : "pl-6";
							return (
								<Col key={idx} className={`${paddingName} mt-40`}>
									<CourseCard
										key={idx}
										thumbnail={`/storage/files/${course.thumbnail.filename}`}
										title={course.name}
										id={course.id}
									/>
								</Col>
							);
						})}
				</Row>
			</div>
		);
	};

	return (
		<React.Fragment>
			<FirstMainContainer backgroundImage={BackgroundImage}>
				<div className="container">
					<Row xs={1} md={2}>
						<Col md={7} className={SizeDetector.isDesktop ? "mt-100" : "mt-40"}>
							<div>
								<MainTitleText
									fontSize={SizeDetector.isDesktop ? 3.75 : 1.125}
									lineHeight={!SizeDetector.isDesktop ? 1.813 : null}
									font="BM"
								>
									언제 어디서나
								</MainTitleText>
								<MainTitleText
									fontSize={SizeDetector.isDesktop ? 3.75 : 1.125}
									lineHeight={!SizeDetector.isDesktop ? 1.813 : null}
									className="d-inline"
									font="BM"
								>
									코딩교육은&nbsp;
								</MainTitleText>
								<MainTitleText
									fontSize={SizeDetector.isDesktop ? 3.75 : 1.125}
									lineHeight={!SizeDetector.isDesktop ? 1.813 : null}
									primary
									className="d-inline"
									font="BM"
								>
									디랩온
								</MainTitleText>
								<MainTitleText
									mainHeader
									fontSize={SizeDetector.isDesktop ? 3.75 : 1.125}
									lineHeight={!SizeDetector.isDesktop ? 1.813 : null}
									className="d-inline"
									font="BM"
								>
									에서
								</MainTitleText>
							</div>

							<CurriculumButton
								size="large"
								minWidth={14.563}
								primary
								onClick={() => history.push({ pathname: "/curriculum" })}
							>
								커리큘럼 살펴보기
								<ArrowForwardRoundedIcon className="ml-20" />
							</CurriculumButton>
						</Col>
						<Col md={5}>
							<MarinBoyImg src={MarinBoyImage} />
						</Col>
					</Row>
				</div>
			</FirstMainContainer>
			<SecondMainContainer backgroundImage={SecondBackgroundImage}>
				<div className="container">
					<Row className={sectionMarginTop}>
						<Col>
							<Text mainHeader font="BM" className="text-white">
								디랩의 검증된 컨텐츠가
							</Text>
							<Text mainHeader font="BM" className="text-white">
								대한민국을 찾아갑니다.
							</Text>
						</Col>
					</Row>
					<Row xs={1} md={2} className={descriptionMarginTop}>
						<Col md={7}>
							<div>
								<DescriptionText p2 white>
									디랩의 아이들은 스스로 주인공이 되어 시행착오를 겪으며 배웁니다. 다년간 오프라인에서
									<br />
									축적해온 수업 노하우와 풍부한 강사진은 디랩의 자부심이며 강점입니다.
								</DescriptionText>
							</div>
							<div>
								<Text p2 white>
									우리 아이들의 호기심과 무한한 가능성을 키워줄 디랩을 온라인에서 만나보세요.
								</Text>
							</div>
						</Col>
					</Row>
					<Row>
						<Col></Col>
						<Col md={5}>
							<TurtleImg src={TurtleImage} />
						</Col>
					</Row>
				</div>
			</SecondMainContainer>
			<MainContainer
				backgroundColor="#F7F7F7"
				rightBackgroundImage={BoyThinkImage}
				height={59.5}
				mobileBackgroundHide
			>
				<div className="container">
					<Row className={sectionMarginTop}>
						<Col md={6} align="left">
							<Text mainHeader font="BM">
								우리 아이가
							</Text>
							<Text mainHeader font="BM">
								코딩을 배워야하는 이유,
							</Text>
							<Text mainHeader font="BM">
								학부모님은 알고 계신가요?
							</Text>
							<div className={SizeDetector.isDesktop ? "mt-20" : "mt-10"}>
								<DescriptionText p2>코딩을 통해 좋아하는 게임과 앱을 만드는 아이들.</DescriptionText>
								<DescriptionText p2>
									생각을 구체화하고 보고 만질 수 있게 표현하며 수학과 음악, 미술의 쓸모를
								</DescriptionText>
								<DescriptionText p2>
									깨닫게 되는 순간, 아이들은 세상을 보는 새로운 눈이 열립니다.
								</DescriptionText>
							</div>
							<div>
								<DescriptionText p2>교육 소비자에서 교육 생산자로!</DescriptionText>
								<DescriptionText p2>세상을 이끄는 아이로 성장시켜주세요.</DescriptionText>
							</div>
							<GirlImgContainer>
								<GirlImg src={KneeGirlImage} />
							</GirlImgContainer>
						</Col>
					</Row>
				</div>
			</MainContainer>
			<MobileImage src={BoyThinkImage} />
			<MainContainer>
				<div className={`container ${SizeDetector.isDesktop ? "mt-60" : "mt-40"}`}>
					<Text mainHeader font="BM">
						코딩이 처음이라면 망설이지 마세요.
					</Text>
					<Text mainHeader font="BM" className="d-inline">
						평소&nbsp;
					</Text>
					<Text mainHeader font="BM" primary className="d-inline">
						아이가 관심있는 분야
					</Text>
					<Text mainHeader font="BM" className="d-inline">
						로 시작하시면 됩니다.
					</Text>
					<Text p2 className={SizeDetector.isDesktop ? "mt-20" : "mt-10"}>
						블럭놀이가 즐거운 아이, 그림그리기를 좋아하는 아이, 음악을 즐기는 아이…
					</Text>
					<Text p2>우리 아이의 관심사는 무엇인가요? 아이와 이야기를 시작해보세요.</Text>
					<Text p2>
						무엇이 하고 싶은지, 어떤 것을 배워보고 싶은지 함께 생각하고 결정하는 과정부터 아이의 배움은
						시작됩니다.
					</Text>
				</div>
			</MainContainer>
			<SizeDetector.Desktop>{renderSlider()}</SizeDetector.Desktop>
			<SizeDetector.Mobile>{renderCourseGrid()}</SizeDetector.Mobile>
			<WaveContainer
				backgroundImage={BlackWaveImage}
				mobileBackgroundImage={BlackWaveMobileImage}
				height={30}
				mobileHeight={19.188}
			>
				<div className="container d-flex flex-column">
					<Row className={`align-content-end ${SizeDetector.isDesktop ? "mb-80" : "mb-32"}`}>
						<Col>
							<Text mainHeader font="BM" primary>
								어렵지만 재미있어!
							</Text>
							<SizeDetector.Desktop>
								<Text p2 className="mt-20 text-white">
									어려운데 재미있다!? 좋아하는 것을 만들며 학습하면 가능합니다.
								</Text>
							</SizeDetector.Desktop>
							<SizeDetector.Mobile>
								<Text p2 className="mt-20 text-white" fontWeight={700}>
									어려운데 재미있다!?
								</Text>
								<Text p2 className="text-white">
									좋아하는 것을 만들며 학습하면 가능합니다.
								</Text>
							</SizeDetector.Mobile>
							<Text p2 className="text-white">
								디랩은 전국에 위치한 9개의 캠퍼스에서 진행해온 다년간의 수업 노하우를 바탕으로 어렵지만
								무언가를 만들며
							</Text>
							<Text p2 className="text-white">
								재미와 성취감을 느끼는 아이들을 위해 보다 재미있고 효과적인 학습이 이루어지도록 교육
								과정을 설계하였습니다.
							</Text>
						</Col>
					</Row>
				</div>
			</WaveContainer>
			<VideoContainer>
				<video
					style={{ width: "100%" }}
					src="/images/video.mp4"
					muted
					playsInline
					autoPlay
					loop
					autostart="true"
					type="video/mp4"
				/>
			</VideoContainer>
			<MainContainer backgroundColor="black">
				<div className="container">
					<Row md={2} xs={2}>
						<Col xs={5} md={6} className="pr-0 mb-50">
							<FloatTextContainer top={-4} mobileTop={-1.2}>
								<Text
									h1
									fontSize={SizeDetector.isDesktop ? null : 1.125}
									lineHeight={SizeDetector.isDesktop ? null : 1.813}
									className="text-white"
								>
									HARD FUN!
								</Text>
								<Text
									h1
									fontSize={SizeDetector.isDesktop ? null : 1.125}
									lineHeight={SizeDetector.isDesktop ? 6.875 : 1.813}
									className="text-white"
								>
									DLAB ON
								</Text>
							</FloatTextContainer>

							<FloatDetailContainer>
								<Text
									font="BM"
									fontSize={!SizeDetector.isDesktop ? 1 : 2.25}
									lineHeight={SizeDetector.isDesktop ? 5.438 : 2.625}
									className="text-white"
								>
									Scratch
								</Text>
								<Text p1 className="text-white">
									Animation
								</Text>
								<Text p1 className="text-white">
									Interactive Art
								</Text>
								<Text p1 className="text-white">
									Advertising Planning
								</Text>
								<Text p1 className="text-white">
									x Makey Makey
								</Text>
								<Text p1 className="text-white">
									x Makey Code
								</Text>
								<Text p1 className="text-white">
									Microbit RC Car
								</Text>
							</FloatDetailContainer>
							<div className={descriptionMarginTop}>
								<Text
									font="BM"
									fontSize={!SizeDetector.isDesktop ? 1 : 2.25}
									lineHeight={SizeDetector.isDesktop ? 5.438 : 2.625}
									className="text-white"
								>
									App Inventor
								</Text>
								<Text p1 className="text-white">
									Different levels of difficulty
								</Text>
								<Text p1 className="text-white">
									Artificial Intelligence
								</Text>
							</div>
							<div className={`${descriptionMarginTop} mb-40`}>
								<Text
									font="BM"
									fontSize={!SizeDetector.isDesktop ? 1 : 2.25}
									lineHeight={SizeDetector.isDesktop ? 5.438 : 2.625}
									className="text-white"
								>
									Python
								</Text>
								<Text p1 className="text-white">
									Pygame
								</Text>
								<Text p1 className="text-white">
									Web Automation
								</Text>
								<Text p1 className="text-white">
									Web Crawling
								</Text>
							</div>
						</Col>
						<Col
							xs={7}
							md={6}
							className={
								SizeDetector.isDesktop
									? "align-self-center pl-0"
									: "pl-0 position-relative overflow-hidden"
							}
						>
							<PalmGirlImg src={PalmGirlImage} />
						</Col>
					</Row>
				</div>
			</MainContainer>
			<MainContainer>
				<ImageContainer>
					<Image src={LeftImage} />
				</ImageContainer>
				<ImageContainer>
					<Image src={RightImage} />
				</ImageContainer>
			</MainContainer>
			<BackgroundTeacherTop>
				<div className="container">
					<Row>
						<Col>
							<Text mainHeader className={`${sectionMarginTop} text-white`}>
								소프트웨어 교육을 통한 창업가 경험
							</Text>
							<Text p2 className={SizeDetector.isDesktop ? "mt-20" : "mt-10"}>
								정답이 없는 세상을 살아가야 하는 우리 자녀들.
							</Text>
							<Text p2>
								정해진 시험 문제 푸는 것을 넘어 시각 장애인에게 사물을 설명해 주는 앱을 만들고
								파이썬으로 노래를 작사해 봅니다.
							</Text>
							<Text p2 className="mb-40">
								이 과정에서 세상을 더욱 살기좋게 만드는 창의적이고 문제를 해결하는 아이들로 성장하게
								됩니다.
							</Text>
						</Col>
					</Row>
				</div>
			</BackgroundTeacherTop>
			<Image src={SizeDetector.isDesktop ? BackgroundTeacher : BackgroundTeacherMobile} />
			<MainContainer
				backgroundColor="#FF5100"
				className="d-flex"
				backgroundImage={BackgroundSea}
				mobileBackgroundImage={BackgroundSea}
				height={66.375}
			>
				<div className="container d-flex flex-column">
					<Row>
						<Col>
							<Text mainHeader className="mt-100 text-white">
								코딩 교육의 효과를 높일 수 있는
							</Text>
							<Text mainHeader className="text-white">
								환경에서 수업합니다.
							</Text>
							<Text p2 className={`${SizeDetector.isDesktop ? "mt-20" : "mt-10"} text-white`}>
								인공지능 올인원 코딩 교육 플랫폼 Elice 를 활용하여 프로그래밍 실습 뿐 아니라
							</Text>
							<Text p2 className="text-white">
								개념 이해에 효과적인 PDF 자료, 동영상 자료 등 다양한 콘텐츠를 활용합니다.
							</Text>
						</Col>
					</Row>
					<Row xs={1} md={2} className="flex-grow-1">
						<Col md={5} />
						<Col md={7}>
							<PcMarinBoyImg
								className={SizeDetector.isDesktop ? "mb-40" : "mb-60"}
								src={PcMarinBoyImage}
							/>
						</Col>
					</Row>
				</div>
			</MainContainer>
			<MainContainer className="mt-32 mb-60">
				<div className="container">
					<Row xs={1} md={3}>
						<ColWithGutter value={20}>
							<SvgIcon className="align-self-start" src={AccountIcon} />
							<DescriptionTextContainer>
								<Text p2>직접 프로그래밍 실습을 합니다.</Text>
								<Text p2>선생님은 학생들의 실습을 실시간으로 모니터링할 수 있습니다.</Text>
							</DescriptionTextContainer>
						</ColWithGutter>
						<ColWithGutter value={20}>
							<SvgIcon src={VideoIcon} />
							<DescriptionTextContainer>
								<Text p2>
									개념 이해를 돕기 위하여 흥미롭고 다양한 교육 자료와 영상을 제공합니다. 수강생이
									별도의 교재를 준비하지 않아도 됩니다.
								</Text>
							</DescriptionTextContainer>
						</ColWithGutter>
						<ColWithGutter value={20}>
							<SvgIcon src={RefreshOkIcon} />
							<DescriptionTextContainer>
								<Text p2>수강생들은 선생님과 학습 동료들의 화면을 공유하며 실시간으로 소통합니다.</Text>
							</DescriptionTextContainer>
						</ColWithGutter>
					</Row>
				</div>
			</MainContainer>
			<ImageFader images={[SliderImage1, SliderImage2, SliderImage3]} />
		</React.Fragment>
	);
};

const FirstMainContainer = styled.div`
	@media only screen and (min-width: 768px) {
		height: calc(100vh - 104px);
	}
	width: 100%;

	${props =>
		props.backgroundImage &&
		css`
			background-image: url(${props.backgroundImage});
			background-repeat: no-repeat;
			overflow-y: hidden;
			overflow-x: hidden;

			@media only screen and (max-width: 767.98px) {
				background-position: calc(((100vw - 120rem) / 2) - 16rem) bottom;
				background-size: 120rem;
			}

			@media only screen and (min-width: 768px) {
				background-position: calc((100vw - 160rem) / 2) bottom;
				background-size: 160rem calc(100vh - 104px);
			}
		`}
`;

const SecondMainContainer = styled.div`
	@media only screen and (min-width: 768px) {
		height: 57.063rem;
	}
	width: 100%;

	${props =>
		props.backgroundImage &&
		css`
			background-image: url(${props.backgroundImage});
			background-repeat: no-repeat;

			overflow-y: hidden;
			overflow-x: hidden;

			@media only screen and (max-width: 767.98px) {
				background-size: 767.98px 100vh;
				background-position: center;
			}

			@media only screen and (min-width: 768px) {
				background-size: 2560px 57.063rem;
				background-position: center;
			}
		`};
`;

const MainContainer = styled.div`
	${props =>
		props.height &&
		css`
			@media only screen and (min-width: 768px) {
				height: ${props.height}rem;
			}
		`}
	${props =>
		props.mobileHeight &&
		css`
			@media only screen and (max-width: 767.98px) {
				height: ${props.mobileHeight}rem;
			}
		`}
	${props =>
		props.backgroundColor &&
		css`
			background-color: ${props.backgroundColor};
		`}
	${props =>
		props.backgroundImage &&
		css`
			background-image: url(${props.backgroundImage});
			background-repeat: no-repeat;
			background-position: calc((100vw - 160rem) / 2) center;
			@media only screen and (min-width: 768px) {
				background-size: 160rem ${props.height}rem;
			}
		`}
	${props =>
		props.rightBackgroundImage &&
		css`
			left: 50%;
			background-image: url(${props.rightBackgroundImage});
			background-position: calc(100vw / 2) center;
			background-size: 80rem ${props.height}rem;
			background-repeat: no-repeat;
			overflow-y: hidden;
			overflow-x: hidden;
		`}
	${props =>
		props.mobileBackgroundImage &&
		css`
			@media only screen and (max-width: 767.98px) {
				background-image: url(${props.mobileBackgroundImage});
				background-repeat: no-repeat;
				background-position: calc((100vw - 40rem) / 2) bottom;
				background-size: 40rem;
			}
		`}
	${props =>
		props.mobileBackgroundHide &&
		css`
			@media only screen and (max-width: 767.98px) {
				background-size: 0 0;
				background-color: white;
			}
		`}
`;

const BackgroundTeacherTop = styled.div`
	background-color: #dac2af;
`;

const MainTitleText = styled(Text)`
	line-height: 5.438rem;
`;

const MarinBoyImg = styled.img`
	max-width: 100%;
	max-height: calc(100vh - 104px);
	@media only screen and (max-width: 767.98px) {
		position: relative;
		top: -3.125rem;
		margin-left: 2.5rem;
	}
`;

const MobileImage = styled.img`
	width: 100%;
	@media only screen and (min-width: 768px) {
		display: none;
	}
`;

const WaveContainer = styled.div`
	display: flex;
	align-items: flex-end;
	${props =>
		props.height &&
		css`
			@media only screen and (min-width: 768px) {
				height: ${props.height}rem;
			}
		`}
	${props =>
		props.mobileHeight &&
		css`
			@media only screen and (max-width: 767.98px) {
				height: ${props.mobileHeight}rem;
			}
		`}
	${props =>
		props.backgroundImage &&
		css`
			@media only screen and (min-width: 768px) {
				background-image: url(${props.backgroundImage});
				background-repeat: no-repeat;
				background-position: calc((100vw - 160rem) / 2) center;

				background-size: 160rem ${props.height}rem;
			}
		`}
		${props =>
			props.mobileBackgroundImage &&
			css`
				@media only screen and (max-width: 767.98px) {
					background-image: url(${props.mobileBackgroundImage});
					background-repeat: no-repeat;
					background-size: 100%;
				}
			`}
`;

const VideoContainer = styled.div`
	background-color: black;
`;

const FloatTextContainer = styled.div`
	position: absolute;
	${props =>
		props.top &&
		css`
			@media only screen and (min-width: 768px) {
				top: ${props.top}rem;
			}
		`}
	${props =>
		props.mobileTop &&
		css`
			@media only screen and (max-width: 767.98px) {
				top: ${props.mobileTop}rem;
			}
		`}
`;

const FloatDetailContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-top: calc(1.563rem + 1.25rem);
	}

	@media only screen and (min-width: 768px) {
		margin-top: 12.5rem;
	}
`;

const CurriculumButton = styled(Button)`
	margin-top: 1.25rem;
	@media only screen and (max-width: 767.98px) {
		display: none;
	}
`;

const TurtleImg = styled.img`
	@media only screen and (max-width: 767.98px) {
		max-height: 13.75rem;
		float: right;
	}
	@media only screen and (min-width: 768px) {
		max-width: 100%;
		height: auto;
	}
`;

const GirlImgContainer = styled.div`
	display: flex;
	@media only screen and (max-width: 767.98px) {
		justify-content: center;
		padding-bottom: 2.5rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: -1.875rem;
	}
	@media only screen and (min-width: 940px) {
		margin-top: 5rem;
	}
`;

const GirlImg = styled.img`
	@media only screen and (max-width: 767.98px) {
		max-width: 50vw;
		max-height: 60.68vw;
		min-width: 13.508rem;
		min-height: 15.125rem;
	}
	@media only screen and (min-width: 768px) {
		max-width: 21.938rem;
		max-height: 24.565rem;
	}
`;

const PalmGirlImg = styled.img`
	@media only screen and (max-width: 767.98px) {
		position: absolute;
		height: 25rem;
	}
	@media only screen and (min-width: 768px) {
		max-width: 100%;
		height: auto;
	}
`;

const PcMarinBoyImg = styled.img`
	max-width: 100%;
	height: auto;
`;

const DescriptionText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		display: inline;
		& + & {
			margin-left: 0.188rem;
		}
	}
`;

const SliderContainer = styled.div`
	margin-left: auto;
	margin-right: auto;

	@media only screen and (max-width: 767.98px) {
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 6.25rem;
		margin-bottom: 6.25rem;
	}
`;

const ImageContainer = styled.div`
	display: inline-block;
	width: 50%;
`;

const Image = styled.img`
	width: 100%;
`;

const SvgIcon = styled.img`
	@media only screen and (max-width: 767.98px) {
		align-self: flex-start;
		width: 1.5rem;
		height: 1.5rem;
	}
	@media only screen and (min-width: 768px) {
		width: 3rem;
		height: 3rem;
	}
`;

const DescriptionTextContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-left: 1.125rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 1.25rem;
	}
`;

const ColWithGutter = styled(Col)`
	padding-left: ${props => props.value}px;
	padding-right: ${props => props.value}px;
	@media only screen and (max-width: 767.98px) {
		display: flex;
		align-items: center;
		& + & {
			margin-top: 1.25rem;
		}
	}
`;

export default FrontMainLandingPage;
