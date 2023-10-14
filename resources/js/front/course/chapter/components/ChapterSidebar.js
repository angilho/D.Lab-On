import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import ChapterViewType from "@constants/ChapterViewType";

import ArrowRightImage from "@images/chapter/arrow_right.png";
import ArrowDownImage from "@images/chapter/arrow_down.png";

import * as ctrl from "../chapter.ctrl";

const ChapterSidebar = ({ course, chapters, chapterId, vodId, view }) => {
	const history = useHistory();
	const [allChapterFolded, setAllChapterFolded] = useState(typeof chapterId === "undefined");
	const [chapterFolded, setChapterFolded] = useState([]);

	useEffect(() => {
		setChapterFolded(getInitChapterFolded());
	}, [chapterId]);

	/**
	 * 초기에 접혀 있는 챕터 목록을 구한다.
	 * @returns
	 */
	const getInitChapterFolded = () => {
		// 선택된 챕터가 있는 경우 해당 챕터는 펼친다.
		let chapterFolded = chapters.map(chapter => {
			return chapter.id != chapterId;
		});
		return chapterFolded;
	};

	/**
	 * 사이드바에서 챕터 아래의 내용을 접고 편다.
	 * @param {int} chapterIdx
	 */
	const foldChapter = chapterIdx => {
		let newChapterFolded = [...chapterFolded];
		newChapterFolded[chapterIdx] = !newChapterFolded[chapterIdx];
		setChapterFolded(newChapterFolded);
	};

	/**
	 * 한 챕터를 그리는 UI
	 * @param {object} chapter
	 * @param {int} chapterIdx
	 * @returns
	 */
	const renderChapter = (chapter, chapterIdx) => {
		return (
			<React.Fragment>
				<SidebarRow noGutters selected={chapter.id == chapterId && view === ChapterViewType.CHAPTER}>
					<Col>
						<SidebarDepth2>
							<SidebarItemFoldButton
								src={chapterFolded[chapterIdx] ? ArrowRightImage : ArrowDownImage}
								onClick={() => foldChapter(chapterIdx)}
							/>
							<SidebarItemText
								onClick={() => ctrl.navigateChapter(history, course.id, chapter.id)}
							>{`${chapterIdx + 1}강`}</SidebarItemText>
						</SidebarDepth2>
					</Col>
				</SidebarRow>
				{!chapterFolded[chapterIdx] && (
					<React.Fragment>
						<SidebarRow
							noGutters
							selected={chapter.id == chapterId && view === ChapterViewType.CHAPTER_RESOURCE}
						>
							<Col>
								<SidebarDepth3>
									<SidebarItemText
										onClick={() => {
											if (chapter.resources && chapter.resources.length === 0) return;
											ctrl.navigateDownloadResource(history, course.id, chapter.id);
										}}
										disabled={chapter.resources && chapter.resources.length === 0}
									>
										참고자료 다운로드
									</SidebarItemText>
								</SidebarDepth3>
							</Col>
						</SidebarRow>
						{chapter.vods.map((vod, vodIdx) => {
							return <React.Fragment key={vodIdx}>{renderVod(chapter, vod)}</React.Fragment>;
						})}
						<SidebarRow
							noGutters
							selected={chapter.id == chapterId && view === ChapterViewType.CHAPTER_QUIZ}
						>
							<Col>
								<SidebarDepth3>
									<SidebarItemText
										onClick={() => ctrl.navigateQuiz(history, course.id, chapter.id)}
									>{`${chapterIdx + 1}강 퀴즈`}</SidebarItemText>
								</SidebarDepth3>
							</Col>
						</SidebarRow>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	};

	/**
	 * 동영상 강의 하나를 그리는 UI
	 * @param {object} chapter
	 * @param {object} vod
	 * @returns
	 */
	const renderVod = (chapter, vod) => {
		return (
			<React.Fragment>
				<SidebarRow
					noGutters
					selected={chapter.id == chapterId && vod.id == vodId && view === ChapterViewType.CHAPTER_VOD}
				>
					<Col>
						<SidebarDepth3>
							<SidebarItemText onClick={() => ctrl.navigateVod(history, course.id, chapter.id, vod.id)}>
								{vod.title}
							</SidebarItemText>
						</SidebarDepth3>
					</Col>
				</SidebarRow>
			</React.Fragment>
		);
	};

	return (
		<SidebarContainer>
			<Row>
				<Col>
					<TitleText primary h5>
						{course.name}
					</TitleText>
				</Col>
			</Row>
			<SidebarRow noGutters className="mt-20" selected={view === ChapterViewType.CHAPTER_LIST}>
				<Col>
					<SidebarDepth1>
						<SidebarItemFoldButton
							src={allChapterFolded ? ArrowRightImage : ArrowDownImage}
							onClick={() => setAllChapterFolded(!allChapterFolded)}
						/>
						<SidebarItemText
							onClick={() => {
								setAllChapterFolded(false);
								ctrl.navigateChapterList(history, course.id);
							}}
						>
							수업 목록
						</SidebarItemText>
					</SidebarDepth1>
				</Col>
			</SidebarRow>
			{!allChapterFolded &&
				chapters.map((chapter, chapterIdx) => {
					return <React.Fragment key={chapterIdx}>{renderChapter(chapter, chapterIdx)}</React.Fragment>;
				})}
			<SidebarRow noGutters selected={view === ChapterViewType.STATISTICS_QUIZ}>
				<Col>
					<SidebarDepth1>
						<SidebarItemFoldButton src={ArrowRightImage} />
						<SidebarItemText onClick={() => ctrl.navigateQuizStatistics(history, course.id)}>
							퀴즈
						</SidebarItemText>
					</SidebarDepth1>
				</Col>
			</SidebarRow>
			<SidebarRow
				noGutters
				className="mb-20"
				selected={
					view === ChapterViewType.POST_LIST ||
					view === ChapterViewType.POST_CREATE ||
					view === ChapterViewType.POST
				}
			>
				<Col>
					<SidebarDepth1>
						<SidebarItemFoldButton src={ArrowRightImage} />
						<SidebarItemText onClick={() => ctrl.navigatePostList(history, course.id)}>
							강좌게시판
						</SidebarItemText>
					</SidebarDepth1>
				</Col>
			</SidebarRow>
		</SidebarContainer>
	);
};

const SidebarContainer = styled.div`
	display: flex;
	flex-direction: column;
	border: 0.063rem solid ${({ theme }) => theme.colors.gray};
	background-color: ${({ theme }) => theme.colors.white};
	& + & {
		@media only screen and (max-width: 767.98px) {
			margin-top: 1.25rem;
		}
		@media only screen and (min-width: 768px) {
			margin-top: 1.25rem;
		}
	}
`;

const TitleText = styled(Text)`
	background-color: ${({ theme }) => `${theme.colors.primary}20`};
	font-weight: 700;
	@media only screen and (max-width: 767.98px) {
		padding-left: 1rem;
		padding-top: 0.625rem;
		padding-bottom: 0.625rem;
	}
	@media only screen and (min-width: 768px) {
		padding-left: 1.5rem;
		padding-top: 1.25rem;
		padding-bottom: 1.25rem;
	}
`;

const SidebarRow = styled(Row)`
	margin-top: 5px;
	height: 2.75rem;
	align-items: center;

	${props =>
		props.selected &&
		css`
			background-color: ${({ theme }) => `${theme.colors.primary}0D`};
			color: ${({ theme }) => `${theme.colors.primary}`};
		`}
`;

const SidebarDepth1 = styled.div`
	padding-left: 1rem;
`;

const SidebarDepth2 = styled.div`
	padding-left: 2rem;
`;

const SidebarDepth3 = styled.div`
	padding-left: 5.375rem;
`;

const SidebarItemText = styled(Text)`
	display: inline-block;
	cursor: pointer;
	margin-left: 0.25rem;
	font-family: "Noto Sans KR";
	font-weight: 400;
	font-size: 1.125rem;
	line-height: 2rem;

	${props =>
		props.disabled &&
		css`
			color: ${({ theme }) => theme.colors.gray};
		`}
`;

const SidebarItemFoldButton = styled.img`
	display: inline-block;
	cursor: pointer;
	width: 1.5rem;
	height: 1.5rem;
`;

export default ChapterSidebar;
