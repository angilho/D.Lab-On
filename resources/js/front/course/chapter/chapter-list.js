import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import ChapterContent from "./components/ChapterContent";
import LearningStatus from "@constants/LearningStatus";
import useSizeDetector from "@hooks/useSizeDetector";

import ArrowUpImage from "@images/chapter/arrow_up.png";
import ArrowDownImage from "@images/chapter/arrow_down.png";
import CheckedImage from "@images/chapter/checked.png";

import * as ctrl from "./chapter.ctrl";

const ChapterList = ({ course, chapters, courseLearnings }) => {
	const history = useHistory();
	const [courseChapters, setCourseChapters] = useState(chapters);
	const SizeDetector = useSizeDetector();

	/**
	 * 챕터를 접고 편다
	 * @param {int} chapterIdx
	 * @param {boolean} folded
	 */
	const foldChapter = (chapterIdx, folded) => {
		let targetChapter = courseChapters[chapterIdx];
		targetChapter.folded = folded;
		setCourseChapters([
			...courseChapters.slice(0, chapterIdx),
			targetChapter,
			...courseChapters.slice(chapterIdx + 1)
		]);
	};

	/**
	 * 챕터 전체 목록 UI
	 * @returns
	 */
	const renderChapterList = () => {
		return (
			<ChapterListContainer>
				{courseChapters.map((chapter, chapterIdx) => {
					return <React.Fragment key={chapterIdx}>{renderChapter(chapterIdx, chapter)}</React.Fragment>;
				})}
			</ChapterListContainer>
		);
	};

	/**
	 * 챕터 하나에 속한 모든 요소를 표시하는 UI
	 * @param {int} chapterIdx
	 * @param {object} chapter
	 * @returns
	 */
	const renderChapter = (chapterIdx, chapter) => {
		return (
			<React.Fragment>
				{renderChapterTitle(chapterIdx, chapter)}
				{!chapter.folded && (
					<React.Fragment>
						{renderChapterResource(chapter)}
						{renderChapterVodList(chapter)}
						{renderChapterQuiz(chapterIdx, chapter)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	};

	/**
	 * 챕터의 제목과 접기 펴기 버튼을 표시하는 UI
	 * @param {int} chapterIdx
	 * @param {object} chapter
	 * @returns
	 */
	const renderChapterTitle = (chapterIdx, chapter) => {
		return (
			<ChapterTitleContainer>
				<Row noGutters className="h-100 align-items-center">
					<Col>
						<Text
							font={"BM"}
							fontWeight={400}
							fontSize={SizeDetector.isDesktop ? 1.25 : 0.875}
							lineHeight={SizeDetector.isDesktop ? 2.625 : 1.75}
						>{`${chapterIdx + 1}강 - ${chapter.title}`}</Text>
						<ChapterFoldButton
							src={chapter.folded ? ArrowDownImage : ArrowUpImage}
							onClick={() => foldChapter(chapterIdx, !chapter.folded)}
						/>
					</Col>
				</Row>
			</ChapterTitleContainer>
		);
	};

	/**
	 * 교안 다운로드 UI
	 * @param {object} chapter
	 * @returns
	 */
	const renderChapterResource = chapter => {
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
							onClick={() => ctrl.navigateDownloadResource(history, course.id, chapter.id)}
							disabled={chapter.resources && chapter.resources.length === 0}
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
	 * @param {object} chapter
	 * @returns
	 */
	const renderChapterVodList = chapter => {
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
					{chapter.vods.map((vod, vodIdx) => {
						return <React.Fragment key={vodIdx}>{renderChapterVod(chapter, vod)}</React.Fragment>;
					})}
				</div>
			</ChapterItemContainer>
		);
	};

	/**
	 * 동영상 강의 한개의 아이템 UI
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
	 * @param {object} chapter
	 * @returns
	 */
	const renderChapterQuiz = (chapterIdx, chapter) => {
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
				<div className={SizeDetector.isDesktop ? "mt-28 mb-40" : "mt-20 mb-30"}>
					<ItemRoundContainer
						noGutters
						className="align-items-center"
						onClick={() => ctrl.navigateQuiz(history, course.id, chapter.id)}
					>
						<LearnStatusCol
							status={
								ctrl.getQuizCompleted(courseLearnings, chapter.id, chapter.quiz.id)
									? LearningStatus.COMPLETE
									: null
							}
						>
							<Checked src={CheckedImage} />
						</LearnStatusCol>
						<Col>
							<ItemTitleText>{`${chapterIdx + 1}강 퀴즈 풀러가기`}</ItemTitleText>
						</Col>
					</ItemRoundContainer>
				</div>
			</ChapterItemContainer>
		);
	};

	return <ChapterContent title="수업 전체보기" renderFunction={renderChapterList} />;
};

const ChapterListContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding: 2.5rem 1rem;
	}
	@media only screen and (min-width: 768px) {
		margin-bottom: 2rem;
		padding: 1.75rem 1.5rem;
	}
`;

const ChapterTitleContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		height: 2.75rem;
	}
	@media only screen and (min-width: 768px) {
		height: 4.125rem;
	}
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};
`;

const ChapterFoldButton = styled.img`
	position: absolute;
	right: 0;
	cursor: pointer;
	@media only screen and (max-width: 767.98px) {
		bottom: 0.125rem;
	}
	@media only screen and (min-width: 768px) {
		bottom: 0.625rem;
	}
	width: 1.5rem;
	height: 1.5rem;
`;

const ChapterItemContainer = styled.div`
	background-color: #f5f5f5;
	@media only screen and (max-width: 767.98px) {
		padding-top: 1.875rem;
		padding-bottom: 0.625rem;
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 2.5rem;
		padding-bottom: 1.25rem;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
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
	box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
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

export default ChapterList;
