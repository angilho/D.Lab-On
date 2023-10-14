import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import useSizeDetector from "@hooks/useSizeDetector";
import ChapterContent from "./components/ChapterContent";
import NotAllow from "./components/NotAllow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LearningStatus from "@constants/LearningStatus";

import Vimeo from "@u-wave/react-vimeo";

import * as ctrl from "./chapter.ctrl";

const ChapterVod = ({ course, chapters, chapterId, vodId, courseLearnings }) => {
	const history = useHistory();
	const [currentChapter, setCurrentChapter] = useState({ vods: [] });
	const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
	const [currentVod, setCurrentVod] = useState({});
	const [currentVodIdx, setCurrentVodIdx] = useState(0);
	const [courseInitialized, setCourseInitialized] = useState(false);
	const [learningInitialized, setLearningInitialized] = useState(false);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		let targetVod, targetVodIdx;
		chapters.forEach((chapter, chapterIdx) => {
			if (chapter.id == chapterId) {
				setCurrentChapter(chapter);
				setCurrentChapterIdx(chapterIdx);
				chapter.vods.forEach((vod, vodIdx) => {
					if (vod.id == vodId) {
						targetVod = vod;
						targetVodIdx = vodIdx;
					}
				});
			}
		});
		setCurrentVod(targetVod);
		setCurrentVodIdx(targetVodIdx);
		setCourseInitialized(true);
	}, [chapterId, vodId]);

	useEffect(() => {
		setLearningInitialized(true);
	}, [courseLearnings]);

	const onVideoEnd = () => {
		ctrl.completeVodLearing(userInfo.id, course.id, chapterId, vodId, LearningStatus.COMPLETE);
	};

	/**
	 * 이전 동영상 강의로 이동한다.
	 */
	const prevVod = () => {
		if (currentVodIdx === 0) return;
		ctrl.navigateVod(history, course.id, chapterId, currentChapter.vods[currentVodIdx - 1].id);
	};

	/**
	 * 다음 동영상 강의로 이동한다.
	 */
	const nextVod = () => {
		if (currentVodIdx === currentChapter.vods.length - 1) return;
		ctrl.navigateVod(history, course.id, chapterId, currentChapter.vods[currentVodIdx + 1].id);
	};

	const getVideoId = videoUrl => {
		return videoUrl.replace("https://player.vimeo.com/video/", "");
	};

	const vodIframeStyle = {
		position: "absolute",
		border: 0,
		top: 0,
		left: 0,
		width: "100%",
		height: "100%"
	};

	/**
	 * 동영상 강의를 표시하는 UI
	 * @returns
	 */
	const renderVod = () => {
		return (
			<VodContainer>
				<IframeWrapper>
					<Vimeo
						video={getVideoId(currentVod.vod_url)}
						loop={false}
						speed={true}
						style={vodIframeStyle}
						responsive
						onEnd={onVideoEnd}
					/>
				</IframeWrapper>
				{currentVod.description_url && (
					<VodDescriptionUrlContainer>
						<a href={currentVod.description_url} target="_blank">
							<VodDescriptionUrl>{currentVod.description_url}</VodDescriptionUrl>
						</a>
					</VodDescriptionUrlContainer>
				)}
				{currentVod.description && <VodDescription>{currentVod.description}</VodDescription>}
				<VodPageContainer>
					<Row className="justify-content-between">
						<Col
							md="auto"
							xs="auto"
							className="d-flex align-items-center"
							role="button"
							onClick={() => prevVod()}
						>
							<StyledArrowBackIcon disabled={currentVodIdx === 0 ? true : false} />
							<NavigationText
								disabled={currentVodIdx === 0 ? true : false}
								className={SizeDetector.isDesktop ? "ml-12" : "ml-6"}
							>
								이전
							</NavigationText>
						</Col>
						<Col md="auto" xs="auto" className="d-flex align-items-center">
							<NavigationText>{`${currentVodIdx + 1} / ${currentChapter.vods.length}`}</NavigationText>
						</Col>
						<Col
							md="auto"
							xs="auto"
							className="d-flex align-items-center"
							role="button"
							onClick={() => nextVod()}
						>
							<NavigationText
								disabled={currentVodIdx === currentChapter.vods.length - 1 ? true : false}
								className={SizeDetector.isDesktop ? "mr-12" : "mr-6"}
							>
								다음
							</NavigationText>
							<StyledArrowForwardIcon
								disabled={currentVodIdx === currentChapter.vods.length - 1 ? true : false}
							/>
						</Col>
					</Row>
				</VodPageContainer>
			</VodContainer>
		);
	};

	/**
	 * 이전 강의를 통과하지 못한 경우
	 * @returns
	 */
	const renderNotAllow = () => {
		return <NotAllow />;
	};

	if (!courseInitialized || !learningInitialized) return null;

	let beforeChapterQuizCompleted = ctrl.checkBeforeChapterQuizCompleted(courseLearnings, currentChapterIdx);
	return (
		<ChapterContent
			title={currentVod.title}
			renderFunction={beforeChapterQuizCompleted ? renderVod : renderNotAllow}
		/>
	);
};

const VodContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding: 1.875rem 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 2.75rem;
		padding-bottom: 2.5rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
`;

const IframeWrapper = styled.div`
	position: relative;
	padding-bottom: 56.25%;
	height: 0;
`;

const VodDescriptionUrlContainer = styled.div`
	word-break: break-all;
	@media only screen and (max-width: 767.98px) {
		margin-top: 8px;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 16px;
	}
`;

const VodDescriptionUrl = styled.span`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
	}
`;

const VodDescription = styled.div`
	font-family: "Noto Sans KR";
	font-weight: 400;
	white-space: pre-line;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.25rem;
		margin-top: 8px;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
		margin-top: 16px;
	}
`;

const VodPageContainer = styled.div`
	margin-top: 1.25rem;
	margin-bottom: 1.25rem;
`;

const NavigationText = styled.span`
	font-family: Noto Sans KR;
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 14px;
		line-height: 20px;
	}
	@media only screen and (min-width: 768px) {
		font-size: 18px;
		line-height: 32px;
	}
	${props =>
		props.disabled &&
		css`
			color: ${({ theme }) => theme.colors.gray};
		`}
`;

const StyledArrowBackIcon = styled(ArrowBackIcon)`
	@media only screen and (max-width: 767.98px) {
		font-size: 1.25rem !important;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.5rem !important;
	}
	${props =>
		props.disabled &&
		css`
			color: ${({ theme }) => theme.colors.gray};
		`}
`;

const StyledArrowForwardIcon = styled(ArrowForwardIcon)`
	@media only screen and (max-width: 767.98px) {
		font-size: 1.25rem !important;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.5rem !important;
	}
	${props =>
		props.disabled &&
		css`
			color: ${({ theme }) => theme.colors.gray};
		`}
`;

export default ChapterVod;
