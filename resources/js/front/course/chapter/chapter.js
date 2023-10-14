import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import ChapterContent from "./components/ChapterContent";
import NotAllow from "./components/NotAllow";
import LearningStatus from "@constants/LearningStatus";
import useSizeDetector from "@hooks/useSizeDetector";

import CheckedImage from "@images/chapter/checked.png";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import * as ctrl from "./chapter.ctrl";

const Chapter = ({ course, chapters, chapterId, courseLearnings }) => {
	const history = useHistory();
	const [currentChapter, setCurrentChapter] = useState({ vods: [], quiz: {} });
	const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
	const [courseInitialized, setCourseInitialized] = useState(false);
	const [learningInitialized, setLearningInitialized] = useState(false);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		let targetChapter, targetChapterIdx;
		chapters.forEach((chapter, chapterIdx) => {
			if (chapter.id == chapterId) {
				targetChapter = chapter;
				targetChapterIdx = chapterIdx;
			}
		});
		setCurrentChapter(targetChapter);
		setCurrentChapterIdx(targetChapterIdx);
		setCourseInitialized(true);
	}, [chapterId]);

	useEffect(() => {
		setLearningInitialized(true);
	}, [courseLearnings]);

	/**
	 * 해당 챕터에 포함된 리소스를 표시하는 UI
	 * @returns
	 */
	const renderChapter = () => {
		return (
			<React.Fragment>
				{renderChapterDescription()}
				<React.Fragment>
					{renderChapterResource()}
					{renderAllChapterVods()}
					{renderChapterQuiz()}
					{renderChapterQuizInfo()}
				</React.Fragment>
			</React.Fragment>
		);
	};

	/**
	 * 챕터의 안내문을 표시하는 UI
	 * @param {string} description
	 * @returns
	 */
	const renderChapterDescription = () => {
		return (
			<ChapterDescriptionContainer>
				<Row noGutters className="align-items-center">
					<Col className="d-flex align-items-center">
						<StyledAnnouncementIcon />
						<ChapterDescriptionText>{currentChapter.description}</ChapterDescriptionText>
					</Col>
				</Row>
			</ChapterDescriptionContainer>
		);
	};

	/**
	 * 교안 다운로드 UI
	 * @returns
	 */
	const renderChapterResource = () => {
		return (
			<ChapterItemContainer>
				<Row noGutters>
					<Col md="auto" xs="auto">
						<ChapterItemTitle>참고자료</ChapterItemTitle>
					</Col>
					<Col className="ml-20">
						<hr />
					</Col>
				</Row>
				<Row className={SizeDetector.isDesktop ? "mt-28" : "mt-20"}>
					<Col>
						<ResourceDownloadButton
							primary
							onClick={() => ctrl.navigateDownloadResource(history, course.id, currentChapter.id)}
							disabled={currentChapter.resources && currentChapter.resources.length === 0}
						>
							참고자료 다운로드
						</ResourceDownloadButton>
					</Col>
				</Row>
			</ChapterItemContainer>
		);
	};

	/**
	 * 동영상 강의목록 UI
	 * @returns
	 */
	const renderAllChapterVods = () => {
		return (
			<ChapterItemContainer>
				<Row noGutters>
					<Col md="auto" xs="auto">
						<ChapterItemTitle>동영상 강의목록</ChapterItemTitle>
					</Col>
					<Col className="ml-20">
						<hr />
					</Col>
				</Row>
				<div className={SizeDetector.isDesktop ? "mt-28" : "mt-20"}>
					{currentChapter.vods.map((vod, vodIdx) => {
						return <React.Fragment key={vodIdx}>{renderChapterVod(currentChapter, vod)}</React.Fragment>;
					})}
				</div>
			</ChapterItemContainer>
		);
	};

	/**
	 * 동영상 강의 한개의 아이템 UI
	 * @param {object} chapter
	 * @param {object} vod
	 * @returns
	 */
	const renderChapterVod = (chapter, vod) => {
		return (
			<ItemRoundContainer
				noGutters
				className="align-items-center"
				onClick={() => ctrl.navigateVod(history, course.id, chapter.id, vod.id)}
			>
				<LearnStatusCol
					status={ctrl.getVodCompleted(courseLearnings, chapter.id, vod.id) ? LearningStatus.COMPLETE : null}
				>
					<Checked src={CheckedImage} />
				</LearnStatusCol>
				<Col>
					<ItemTitleText>{vod.title}</ItemTitleText>
				</Col>
			</ItemRoundContainer>
		);
	};

	/**
	 * 퀴즈 UI
	 * @returns
	 */
	const renderChapterQuiz = () => {
		return (
			<ChapterItemContainer>
				<Row noGutters>
					<Col md="auto" xs="auto">
						<ChapterItemTitle>퀴즈</ChapterItemTitle>
					</Col>
					<Col className="ml-20">
						<hr />
					</Col>
				</Row>
				<div className={SizeDetector.isDesktop ? "mt-28" : "mt-20"}>
					<ItemRoundContainer
						noGutters
						className="align-items-center"
						onClick={() => ctrl.navigateQuiz(history, course.id, currentChapter.id)}
					>
						<LearnStatusCol
							status={
								ctrl.getQuizCompleted(courseLearnings, currentChapter.id, currentChapter.quiz.id)
									? LearningStatus.COMPLETE
									: null
							}
						>
							<Checked src={CheckedImage} />
						</LearnStatusCol>
						<Col>
							<ItemTitleText>{`${currentChapterIdx + 1}강 퀴즈 풀러가기`}</ItemTitleText>
						</Col>
					</ItemRoundContainer>
				</div>
			</ChapterItemContainer>
		);
	};

	/**
	 * 퀴즈 통과가 필수인 경우 표시
	 * @returns
	 */
	const renderChapterQuizInfo = () => {
		return (
			<QuizInfoContainer>
				{currentChapter.need_quiz_pass && (
					<Row>
						<Col className="d-flex align-items-center">
							<StyledErrorOutlineRoundedIcon />
							<QuizInfoText>
								이전 강의의 퀴즈를 통과해서 다음 강의의 콘텐츠를 확인할 수 있습니다.
							</QuizInfoText>
						</Col>
					</Row>
				)}
			</QuizInfoContainer>
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
			title={`${currentChapterIdx + 1}강 - ${currentChapter.title}`}
			renderFunction={beforeChapterQuizCompleted ? renderChapter : renderNotAllow}
		/>
	);
};

const ChapterDescriptionContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1.875rem;
		margin-left: 1rem;
		margin-right: 1rem;
		margin-bottom: 0.625rem;
		padding: 1rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 2.5rem;
		margin-left: 1.5rem;
		margin-right: 1.5rem;
		margin-bottom: 1.25rem;
		padding: 1.25rem;
	}
	border: 0.063rem solid ${({ theme }) => theme.colors.primary};
	border-radius: 0.25rem;
`;

const ChapterDescriptionText = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.25rem;
		margin-left: 0.5rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
		margin-left: 1rem;
	}
`;

const StyledAnnouncementIcon = styled(AnnouncementIcon)`
	color: ${({ theme }) => theme.colors.primary};
	@media only screen and (max-width: 767.98px) {
		font-size: 1.25rem !important;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.5rem !important;
	}
`;

const ChapterItemContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding-top: 1.875rem;
		padding-bottom: 0.625rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 2.5rem;
		padding-bottom: 1.25rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
`;

const ChapterItemTitle = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 700;
	@media only screen and (max-width: 767.98px) {
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.313rem;
		line-height: 2.125rem;
	}
`;

const ResourceDownloadButton = styled(Button)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		width: 100%;
		height: 2.25rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		height: 3rem;
		padding: 0.438rem 1.875rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

const ItemRoundContainer = styled(Row)`
	cursor: pointer;
	background: #ffffff;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
	border-radius: 1.969rem;
	@media only screen and (max-width: 767.98px) {
		height: 2.625rem;
		&:not(:last-child) {
			margin-bottom: 0.625rem;
		}
	}
	@media only screen and (min-width: 768px) {
		height: 3.5rem;
		&:not(:last-child) {
			margin-bottom: 1.25rem;
		}
	}
`;

const LearnStatusCol = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
	@media only screen and (max-width: 767.98px) {
		max-width: 1.875rem;
		height: 1.875rem;
		margin-left: 0.375rem;
	}
	@media only screen and (min-width: 768px) {
		max-width: 2.5rem;
		height: 2.5rem;
		margin-left: 0.5rem;
	}
	${props =>
		props.status === LearningStatus.COMPLETE
			? css`
					background: ${({ theme }) => theme.colors.primary};
			  `
			: css`
					background: ${({ theme }) => theme.colors.gray};
			  `}
	border-radius: 1.25rem;
`;

const Checked = styled.img`
	@media only screen and (max-width: 767.98px) {
		width: 1.25rem;
		height: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		width: 1.5rem;
		height: 1.5rem;
	}
`;

const ItemTitleText = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		margin-left: 0.625rem;
		font-size: 0.875rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		margin-left: 1.25rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

const StyledErrorOutlineRoundedIcon = styled(ErrorOutlineRoundedIcon)`
	font-size: 1rem !important;
`;

const QuizInfoContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding-top: 1.25rem;
		padding-bottom: 1.875rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 1.25rem;
		padding-bottom: 3.75rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
`;

const QuizInfoText = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		margin-left: 0.5rem;
		font-size: 0.75rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		margin-left: 0.5rem;
		font-size: 0.875rem;
		line-height: 1.313rem;
	}
`;

export default Chapter;
