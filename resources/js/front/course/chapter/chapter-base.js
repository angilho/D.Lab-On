import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import ChapterList from "./chapter-list";
import Chapter from "./chapter";
import ChapterVod from "./chapter-vod";
import ChapterQuiz from "./chapter-quiz";
import ChapterResource from "./chapter-resource";
import StatisticsQuiz from "./statistics-quiz";
import PostList from "./post-list";
import PostCreate from "./post-create";
import Post from "./post";

import ChapterHeader from "./components/ChapterHeader";
import ChapterSidebar from "./components/ChapterSidebar";
import useSizeDetector from "@hooks/useSizeDetector";
import ChapterViewType from "@constants/ChapterViewType";

import WaveImage from "@images/course/wave.png";

import * as ctrl from "./chapter.ctrl";

const ChapterBase = ({ view, course_id, chapter_id, vod_id, post_id }) => {
	const [courseInitialized, setCourseInitialized] = useState(false);
	const [learningInitialized, setLearningInitialized] = useState(false);
	const [course, setCourse] = useState({});
	const [chapters, setChapters] = useState([]);
	const [courseLearnings, setCourseLearnings] = useState([]);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		ctrl.getCourse(course_id, result => {
			setCourse(result);
			setChapters(result.chapters);
			setCourseInitialized(true);
		});
	}, [course_id]);

	useEffect(() => {
		ctrl.getCourseLearnings(userInfo.id, course_id, result => {
			setCourseLearnings(result);
			setLearningInitialized(true);
		});
	}, [view, course_id, chapter_id, vod_id]);

	if (!courseInitialized || !learningInitialized) return null;

	return (
		<React.Fragment>
			<WaveImg src={WaveImage} />
			<Container className="container">
				<ChapterHeader courseName={course.name} />
				<Row className={SizeDetector.isDesktop ? "mt-60" : "mt-40"}>
					{SizeDetector.isDesktop && (
						<SidebarCol>
							<ChapterSidebar
								course={course}
								chapters={chapters}
								chapterId={chapter_id}
								vodId={vod_id}
								view={view}
							/>
						</SidebarCol>
					)}
					<Col>
						{view === ChapterViewType.CHAPTER_LIST && (
							<ChapterList course={course} chapters={chapters} courseLearnings={courseLearnings} />
						)}
						{view === ChapterViewType.CHAPTER && (
							<Chapter
								course={course}
								chapters={chapters}
								chapterId={chapter_id}
								courseLearnings={courseLearnings}
							/>
						)}
						{view === ChapterViewType.CHAPTER_VOD && (
							<ChapterVod
								course={course}
								chapters={chapters}
								chapterId={chapter_id}
								vodId={vod_id}
								courseLearnings={courseLearnings}
							/>
						)}
						{view === ChapterViewType.CHAPTER_QUIZ && (
							<ChapterQuiz
								course={course}
								chapters={chapters}
								chapterId={chapter_id}
								courseLearnings={courseLearnings}
							/>
						)}
						{view === ChapterViewType.CHAPTER_RESOURCE && (
							<ChapterResource
								course={course}
								chapters={chapters}
								chapterId={chapter_id}
								courseLearnings={courseLearnings}
							/>
						)}
						{view === ChapterViewType.STATISTICS_QUIZ && (
							<StatisticsQuiz course={course} courseLearnings={courseLearnings} />
						)}
						{view === ChapterViewType.POST_LIST && <PostList course={course} />}
						{view === ChapterViewType.POST_CREATE && <PostCreate course={course} postId={post_id} />}
						{view === ChapterViewType.POST && <Post course={course} postId={post_id} />}
					</Col>
				</Row>
			</Container>
		</React.Fragment>
	);
};

const WaveImg = styled.img`
	position: absolute;
	width: 100%;
	@media only screen and (max-width: 767.98px) {
		height: 14.125rem;
	}
	@media only screen and (min-width: 768px) {
		height: 21.563rem;
	}
`;

const Container = styled.div`
	padding-top: 3.75rem; //Top Menu 3.75rem + 마진 3.75rem;
`;

const SidebarCol = styled(Col)`
	max-width: 19.125rem;
	min-width: 19.125rem;
`;

export default ChapterBase;
