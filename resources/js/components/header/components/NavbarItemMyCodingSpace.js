import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import styled, { css } from "styled-components";
import Text from "@components/elements/Text";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import EnrollmentStatus from "@constants/EnrollmentStatus";
import CourseType from "@constants/CourseType";

import * as api from "@common/api";

const NavbarItemMyCodingSpace = ({ userId, hideHandler }) => {
	const history = useHistory();
	const [courses, setCourses] = useState([]);
	const [myCodingSpaceFolded, setMyCodingSpaceFolded] = useState(true);

	useEffect(() => {
		api.getUserEnrollments(userId, { "filter[status]": EnrollmentStatus.COMPLETE })
			.then(response => {
				if (response.data) {
					let filteredCourses = response.data.enrollments
						.map(enrollment => {
							enrollment.course.folded = true;
							enrollment.course.chapterFolded = true;
							return enrollment.course;
						})
						.filter(course => course.type === CourseType.VOD);
					setCourses(filteredCourses);
				}
			})
			.catch(err => console.error(err));
	}, []);

	/**
	 * 과목 상세 페이지로 이동한다.
	 * @param {event} e
	 * @param {int} courseId
	 */
	const navigateCourse = (e, courseId) => {
		e.preventDefault();
		e.stopPropagation();
		hideHandler();
		history.push({ pathname: `/courses/${courseId}/chapters` });
	};

	/**
	 * 챕터 상세 페이지로 이동한다.
	 * @param {event} e
	 * @param {int} courseId
	 * @param {int} chapterId
	 */
	const navigateChapter = (e, courseId, chapterId) => {
		e.preventDefault();
		e.stopPropagation();
		hideHandler();
		history.push({ pathname: `/courses/${courseId}/chapters/${chapterId}` });
	};

	/**
	 * 과목의 퀴즈 통계 페이지로 이동한다.
	 * @param {event} e
	 * @param {int} courseId
	 */
	const navigateQuizStatistics = (e, courseId) => {
		e.preventDefault();
		e.stopPropagation();
		hideHandler();
		history.push({ pathname: `/courses/${courseId}/statistics/quiz` });
	};

	/**
	 * 과목의 강좌 게시판으로 이동한다.
	 * @param {event} e
	 * @param {int} courseId
	 */
	const navigateCoursePostList = (e, courseId) => {
		e.preventDefault();
		e.stopPropagation();
		hideHandler();
		history.push({ pathname: `/courses/${courseId}/posts` });
	};

	/**
	 * 나의 코딩스페이스를 접고 편다.
	 * @param {event} e
	 * @param {boolean} folded
	 */
	const foldMyCodingSpace = (e, folded) => {
		e.preventDefault();
		e.stopPropagation();
		setMyCodingSpaceFolded(folded);
	};

	/**
	 * 과목을 접고 편다
	 * @param {event} e
	 * @param {int} courseIdx
	 * @param {boolean} folded
	 */
	const foldCourse = (e, courseIdx, folded) => {
		e.preventDefault();
		e.stopPropagation();
		let targetCourse = courses[courseIdx];
		targetCourse.folded = folded;
		setCourses([...courses.slice(0, courseIdx), targetCourse, ...courses.slice(courseIdx + 1)]);
	};

	/**
	 * 챕터를 접고 편다
	 * @param {event} e
	 * @param {int} courseIdx
	 * @param {boolean} folded
	 */
	const foldChapter = (e, courseIdx, folded) => {
		e.preventDefault();
		e.stopPropagation();
		let targetCourse = courses[courseIdx];
		targetCourse.chapterFolded = folded;
		setCourses([...courses.slice(0, courseIdx), targetCourse, ...courses.slice(courseIdx + 1)]);
	};

	const renderAllCourses = () => {
		return (
			<React.Fragment>
				{courses.map((course, courseIdx) => {
					return (
						<React.Fragment key={courseIdx}>
							<MobileMenuContainer onClick={e => navigateCourse(e, course.id)}>
								<SidebarChapterDepth0>{course.name}</SidebarChapterDepth0>
								{course.folded && <RightIcon onClick={e => foldCourse(e, courseIdx, false)} />}
								{!course.folded && <DownIcon onClick={e => foldCourse(e, courseIdx, true)} />}
							</MobileMenuContainer>
							{!course.folded && (
								<React.Fragment>
									<MobileMenuContainer
										onClick={e => foldChapter(e, courseIdx, !course.chapterFolded)}
									>
										<SidebarChapterDepth1>수강목록</SidebarChapterDepth1>
										{course.chapterFolded && (
											<RightIcon onClick={e => foldChapter(e, courseIdx, false)} />
										)}
										{!course.chapterFolded && (
											<DownIcon onClick={e => foldChapter(e, courseIdx, true)} />
										)}
									</MobileMenuContainer>
									{!course.chapterFolded &&
										course.chapters.map((chapter, chapterIdx) => {
											return (
												<React.Fragment key={chapterIdx}>
													<MobileMenuContainer
														backgroundColor="#F0F0F0"
														onClick={e => navigateChapter(e, course.id, chapter.id)}
													>
														<SidebarChapterDepth2>{`${chapterIdx +
															1}강`}</SidebarChapterDepth2>
														<RightIcon />
													</MobileMenuContainer>
												</React.Fragment>
											);
										})}
									<MobileMenuContainer onClick={e => navigateQuizStatistics(e, course.id)}>
										<SidebarChapterDepth1>퀴즈</SidebarChapterDepth1>
										<RightIcon />
									</MobileMenuContainer>
									<MobileMenuContainer>
										<SidebarChapterDepth1 onClick={e => navigateCoursePostList(e, course.id)}>
											강좌게시판
										</SidebarChapterDepth1>
										<RightIcon />
									</MobileMenuContainer>
								</React.Fragment>
							)}
						</React.Fragment>
					);
				})}
			</React.Fragment>
		);
	};

	return (
		<Row>
			<Col>
				<MobileMenuContainer>
					<MobileMenuText p3 onClick={() => history.push({ pathname: "/mycodingspace" })}>
						나의 강의실
					</MobileMenuText>
					{myCodingSpaceFolded && <RightIcon onClick={e => foldMyCodingSpace(e, false)} />}
					{!myCodingSpaceFolded && <DownIcon onClick={e => foldMyCodingSpace(e, true)} />}
				</MobileMenuContainer>
				{!myCodingSpaceFolded && renderAllCourses()}
			</Col>
		</Row>
	);
};

const RightIcon = styled(ChevronRightRoundedIcon)`
	float: right;
	margin: 7px 20px 7px 10px;
	color: #e1e1e1;
	align-self: center;
`;

const DownIcon = styled(KeyboardArrowDownIcon)`
	float: right;
	margin: 7px 20px 7px 10px;
	color: #e1e1e1;
	align-self: center;
`;

const MobileMenuContainer = styled.div`
	display: flex;
	justify-content: space-between;
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};

	${props =>
		props.backgroundColor &&
		css`
			background-color: ${props.backgroundColor};
		`}
`;

const MobileMenuText = styled(Text)`
	margin-left: 1rem;
	margin-top: 0.625rem;
	margin-bottom: 0.625rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 400;
`;

const SidebarChapterDepth0 = styled.div`
	margin-left: 1rem;
	margin-top: 0.625rem;
	margin-bottom: 0.625rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 400;
`;

const SidebarChapterDepth1 = styled.div`
	margin-left: 2.25rem;
	margin-top: 0.625rem;
	margin-bottom: 0.625rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 400;
`;

const SidebarChapterDepth2 = styled.div`
	margin-left: 3.5rem;
	margin-top: 0.625rem;
	margin-bottom: 0.625rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 400;
`;

export default NavbarItemMyCodingSpace;
