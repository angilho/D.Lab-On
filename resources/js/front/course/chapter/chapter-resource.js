import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import useSizeDetector from "@hooks/useSizeDetector";
import ChapterContent from "./components/ChapterContent";
import NotAllow from "./components/NotAllow";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import AttachmentIcon from "@mui/icons-material/Attachment";

import * as ctrl from "./chapter.ctrl";

const ChapterResource = ({ course, chapters, chapterId, courseLearnings }) => {
	const [currentChapter, setCurrentChapter] = useState({ resources: [] });
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
	 * 교안 목록을 표시하는 UI
	 * @returns
	 */
	const renderResources = () => {
		return (
			<ResourcesContainer>
				<Row>
					<Col>
						<Text p2 fontWeight={400}>
							{`${currentChapterIdx +
								1}강의 참고자료입니다. 아래 파일을 클릭하여 참고자료를 다운로드 받으세요.`}
						</Text>
					</Col>
				</Row>
				{currentChapter.resources.map((resource, resourceIdx) => {
					return (
						<React.Fragment key={resourceIdx}>
							<Row>
								<Col>{renderResourceFile(resource)}</Col>
							</Row>
							{resource.resource_password && (
								<Row className="mt-6">
									<Col>
										<Text p3>{`참고자료 비밀번호 : ${resource.resource_password}`}</Text>
									</Col>
								</Row>
							)}
						</React.Fragment>
					);
				})}
			</ResourcesContainer>
		);
	};

	/**
	 * 교안 파일 하나를 표시하는 UI
	 * @param {object} resource
	 * @returns
	 */
	const renderResourceFile = resource => {
		return (
			<ResourceFile>
				<StyledAttachmentIcon />
				<ResourceFilenameText p3>{resource.file.org_filename}</ResourceFilenameText>
				<a href={`/storage/files/${resource.file.filename}`} download={resource.file.org_filename}>
					<ResourceFileDownloadButton primary>
						{SizeDetector.isDesktop ? "참고자료 다운로드" : "다운로드"}
					</ResourceFileDownloadButton>
				</a>
			</ResourceFile>
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
			title="참고자료 다운로드"
			renderFunction={beforeChapterQuizCompleted ? renderResources : renderNotAllow}
		/>
	);
};

const ResourcesContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding: 1.875rem 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding: 2.5rem 1.5rem;
	}
`;

const StyledAttachmentIcon = styled(AttachmentIcon)`
	display: inline-block;
	font-size: 1.5rem !important;
	@media only screen and (max-width: 767.98px) {
		margin-left: 0.5rem;
	}
	@media only screen and (min-width: 768px) {
		margin-left: 0.75rem;
	}
`;

const ResourceFile = styled.div`
	display: flex;
	align-items: center;
	border: 0.063rem solid #dcdcdc;
	border-radius: 0 0.25rem 0.25rem 0;
	margin-top: 1.75rem;
	@media only screen and (max-width: 767.98px) {
		min-height: 2.25rem;
	}
	@media only screen and (min-width: 768px) {
		margin-right: 11.25rem;
		min-height: 3rem;
	}
`;

const ResourceFilenameText = styled(Text)`
	display: inline-block;
	text-overflow: ellipsis;
	overflow: hidden;
	@media only screen and (max-width: 767.98px) {
		width: calc(100% - 7.313rem);
		margin-left: 0.5rem;
		padding-right: 0.5rem;
	}
	@media only screen and (min-width: 768px) {
		width: calc(100% - 15.375rem);
		margin-left: 0.75rem;
		padding-right: 0.75rem;
	}
`;

const ResourceFileDownloadButton = styled(Button)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		width: 6.313rem;
		height: 2.25rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		width: 12.375rem;
		height: 3rem;
		padding: 0.438rem 1.875rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

export default ChapterResource;
