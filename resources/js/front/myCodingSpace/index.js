import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import Day from "@constants/Day";
import CourseType from "@constants/CourseType";

import useSizeDetector from "@hooks/useSizeDetector";

import WaveImage from "@images/course/wave.png";
import TurtleImage from "@images/mycodingspace/codingspace_turtle.png";

import EnrollmentStatus from "@constants/EnrollmentStatus";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const MyCodingSpace = props => {
	const history = useHistory();
	const [enrollments, setEnrollments] = useState([]);
	const [childrenEnrollments, setChildrenEnrollments] = useState([]);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		if (!userInfo.id) history.push({ pathname: "/login" });
		let query = {
			"filter[status]": EnrollmentStatus.COMPLETE
		};
		ctrl.getEnrollments(userInfo.id, query, data => {
			setEnrollments(data.enrollments);
			setChildrenEnrollments(data.children_enrollments);
		});
	}, []);

	/**
	 * 수강 상태 종료 확인
	 * 날짜가 지났거나, closed된 section인 경우 종료로 취급한다.
	 * @param {*} enrollment
	 * @returns
	 */
	const isCourseEnded = enrollment => {
		if (enrollment.course.type === CourseType.VOD) {
			let vodEndDate = new Date(enrollment.updated_at);
			vodEndDate.setFullYear(vodEndDate.getFullYear() + 1);
			vodEndDate.setDate(vodEndDate.getDate() - 1);
			vodEndDate.setHours(23);
			vodEndDate.setMinutes(59);
			vodEndDate.setSeconds(59);
			return Date.now() > vodEndDate;
		}

		let courseSection = enrollment.course_section;
		let courseSectionEndDate = new Date(courseSection.end_at);
		courseSectionEndDate.setHours(23);
		courseSectionEndDate.setMinutes(59);
		courseSectionEndDate.setSeconds(59);
		return Date.now() > Date.parse(courseSectionEndDate) || courseSection.closed;
	};

	/**
	 * 시작 시간 10분전~마감 시간까지 Zoom 강의실 입장이 가능한지 확인한다.
	 * @param {CourseSection} courseSection
	 */
	const isCourseSectionEnabled = enrollment => {
		// 1:1 패키지, 1:1 클래스는 수업 시간 설정이 없으므로 항상 Zoom 사용이 가능하도록 한다.
		switch (enrollment.course.type) {
			case CourseType.ONEONONE:
			case CourseType.PACKAGE:
				return true;
		}

		let courseSection = enrollment.course_section;
		let now = new Date();

		// 오늘 요일이 맞는지 확인한다.
		// Sunday - Saturday : 0 - 6
		let today = now.getDay();
		if (!courseSection.duration_day.includes(Day[today])) {
			return false;
		}

		// 지금 시간이 시작 시간 10분전~마감 시간까지인지 확인한다.
		let sectionStartTime = new Date();
		sectionStartTime.setHours(courseSection.start_hour);
		sectionStartTime.setMinutes(courseSection.start_minute - 10);
		sectionStartTime.setSeconds(0);

		let sectionEndTime = new Date();
		sectionEndTime.setHours(courseSection.end_hour);
		sectionEndTime.setMinutes(courseSection.end_minute);
		sectionEndTime.setSeconds(59);

		return now >= sectionStartTime && now <= sectionEndTime;
	};

	const getVodEnrollmentDate = enrollment => {
		let vodEndDate = new Date(enrollment.updated_at);
		vodEndDate.setFullYear(vodEndDate.getFullYear() + 1);
		vodEndDate.setDate(vodEndDate.getDate() - 1);

		return `${util.getFormatDate(enrollment.updated_at)} ~ ${util.getFormatDate(vodEndDate)}`;
	};

	const onClickElice = eliceId => {
		ctrl.openEliceCourse(eliceId);
	};

	const onClickEnterCourse = zoomUrl => {
		window.open(zoomUrl);
	};

	const onClickEnterCourseVod = courseId => {
		history.push({ pathname: `/courses/${courseId}/chapters` });
	};

	const onClickGoToCurriculum = () => {
		history.push({ pathname: "/curriculum" });
	};

	const renderTodayCourse = () => {
		//0 = 일요일
		//6 = 토요일
		const today = new Date().getDay();
		let todayEnrollments = enrollments.filter(enrollment =>
			enrollment.course_section.duration_day.some(value => value === Day[today])
		);

		return (
			<CourseContainer>
				<Row>
					<Col>
						<TitleText primary h5>
							오늘의 수업
						</TitleText>
					</Col>
				</Row>
				<SizeDetector.Desktop>
					<TurtleImg src={TurtleImage} />
				</SizeDetector.Desktop>
				<Row>
					<Col>
						{todayEnrollments.length === 0 ? (
							<NoTodayCourseText p1>오늘은 디랩온 수업이 없는 날입니다.</NoTodayCourseText>
						) : (
							todayEnrollments.map((enrollment, idx) => {
								return renderCourseData(enrollment, idx, todayEnrollments.length - 1 == idx, false);
							})
						)}
					</Col>
				</Row>
			</CourseContainer>
		);
	};

	const renderGotoButtons = enrollment => {
		if (isCourseEnded(enrollment)) {
			return (
				<CodingspaceBtnContainer>
					<CodingspaceBtn disabled minWidth={SizeDetector.Desktop ? 10.625 : null}>
						수강 종료
					</CodingspaceBtn>
				</CodingspaceBtnContainer>
			);
		}

		let enableEnterCourse = isCourseSectionEnabled(enrollment);

		return (
			<CodingspaceBtnContainer>
				{enrollment.course.enable_elice_course && (
					<CodingspaceBtn
						secondary
						minWidth={SizeDetector.Desktop ? 6.563 : null}
						onClick={() => onClickElice(enrollment.course.elice_course_id)}
					>
						참고자료 보기
					</CodingspaceBtn>
				)}
				<CodingspaceBtn
					primary
					minWidth={SizeDetector.Desktop ? 10.625 : null}
					onClick={() => onClickEnterCourse(enrollment.course_section.zoom_url)}
					disabled={!enableEnterCourse}
				>
					{SizeDetector.Desktop ? "ZOOM 강의실 입장" : "ZOOM 입장"}
				</CodingspaceBtn>
			</CodingspaceBtnContainer>
		);
	};

	const renderGotoVodButtons = enrollment => {
		if (isCourseEnded(enrollment)) {
			return (
				<CodingspaceBtnContainer>
					<CodingspaceBtn disabled minWidth={SizeDetector.Desktop ? 10.625 : null}>
						수강 종료
					</CodingspaceBtn>
				</CodingspaceBtnContainer>
			);
		}

		return (
			<CodingspaceBtnContainer>
				<CodingspaceBtn
					primary
					minWidth={SizeDetector.Desktop ? 10.625 : null}
					onClick={() => onClickEnterCourseVod(enrollment.course.id)}
				>
					강의 입장
				</CodingspaceBtn>
			</CodingspaceBtnContainer>
		);
	};

	const renderChildButton = () => {
		return (
			<CodingspaceBtnContainer>
				<CodingspaceBtn disabled minWidth={SizeDetector.Desktop ? 10.625 : null}>
					자녀 계정으로 확인해주세요
				</CodingspaceBtn>
			</CodingspaceBtnContainer>
		);
	};

	const renderCourseData = (enrollment, idx, isLast, isChild) => {
		let time = util.getCourseTime(enrollment.course, enrollment.course_section);
		let courseEnded = isCourseEnded(enrollment);

		return (
			<React.Fragment key={idx}>
				<CourseDataRow>
					<Col>
						<Row>
							<Col>
								<Text h5>{enrollment.course.name || "-"}</Text>
							</Col>
						</Row>
						{!isChild && !courseEnded && enrollment.course.type !== CourseType.VOD && (
							<SizeDetector.Desktop>
								<Row>
									<Col align="right">
										<Text
											p5
											primary
											className="align-self-end justify-content-end align-items-center mb-10"
										>
											<InfoRoundedIcon style={{ fontSize: 11 }} />
											수업시간 10분 전 부터 입장 가능합니다!
										</Text>
									</Col>
								</Row>
							</SizeDetector.Desktop>
						)}
						{enrollment.course.type !== CourseType.VOD && (
							<Row className="justify-content-center">
								<Col>
									<SizeDetector.Desktop>
										<Text p1 primary className="d-inline">
											·
										</Text>
										<Text p1 className="d-inline">{`기간: ${enrollment.course_section
											.duration_period_str || "-"}`}</Text>

										<Text p1 primary className="d-inline ml-32">
											·
										</Text>
										<Text p1 className="d-inline">
											{`시간: ${time}`}{" "}
										</Text>
									</SizeDetector.Desktop>
									<SizeDetector.Mobile>
										<div>
											<Text p1 primary className="d-inline" fontSize={0.75}>
												·
											</Text>
											<Text p1 className="d-inline">{`기간: ${enrollment.course_section
												.duration_period_str || "-"}`}</Text>
										</div>
										<div>
											<Text p1 primary className="d-inline" fontSize={0.75}>
												·
											</Text>
											<Text p1 className="d-inline">
												{`시간: ${time}`}{" "}
											</Text>
										</div>
									</SizeDetector.Mobile>
									{isChild ? renderChildButton() : renderGotoButtons(enrollment)}
								</Col>
							</Row>
						)}
						{enrollment.course.type === CourseType.VOD && (
							<Row className="justify-content-center">
								<Col>
									<SizeDetector.Desktop>
										<Text p1 primary className="d-inline">
											·
										</Text>
										<Text p1 className="d-inline">{`수강기간: ${getVodEnrollmentDate(
											enrollment
										)}`}</Text>
									</SizeDetector.Desktop>
									<SizeDetector.Mobile>
										<div>
											<Text p1 primary className="d-inline" fontSize={0.75}>
												·
											</Text>
											<Text p1 className="d-inline">{`수강기간: ${getVodEnrollmentDate(
												enrollment
											)}`}</Text>
										</div>
									</SizeDetector.Mobile>
									{isChild ? renderChildButton() : renderGotoVodButtons(enrollment)}
								</Col>
							</Row>
						)}
						{!isLast && (
							<Row>
								<Col>
									<Separator />
								</Col>
							</Row>
						)}
					</Col>
				</CourseDataRow>
			</React.Fragment>
		);
	};

	const renderMyCourse = () => {
		return (
			<CourseContainer>
				<Row>
					<Col>
						<TitleText primary h5>
							수강중인 수업
						</TitleText>
					</Col>
				</Row>
				{enrollments.length === 0 && (
					<Row xs={1} md={2}>
						<Col md={8}>
							<NoTodayCourseText p1>
								신청된 수업이 없습니다.
								<br />
								디랩온의 다양한 수업들을 살펴보세요.
							</NoTodayCourseText>
						</Col>

						<SizeDetector.Desktop>
							<Col md={4} className="align-self-center" align="right">
								<Button
									primary
									size="large"
									className="mr-40"
									minWidth={12.375}
									onClick={onClickGoToCurriculum}
								>
									커리큘럼 살펴보기
								</Button>
							</Col>
						</SizeDetector.Desktop>

						<SizeDetector.Mobile>
							<Col align="right">
								<CodingspaceBtnContainer className="mt-0">
									<CodingspaceBtn
										primary
										onClick={onClickGoToCurriculum}
										className="ml-16 mr-16 mb-20 w-100"
									>
										커리큘럼 살펴보기
									</CodingspaceBtn>
								</CodingspaceBtnContainer>
							</Col>
						</SizeDetector.Mobile>
					</Row>
				)}
				{enrollments.map((enrollment, idx) => {
					return renderCourseData(enrollment, idx, enrollments.length - 1 == idx, false);
				})}
			</CourseContainer>
		);
	};

	return (
		<React.Fragment>
			<WaveImg src={WaveImage} />
			<Container className="container">
				<Row>
					<Col md={12}>
						<Text h4 className="text-white">
							나의 강의실
						</Text>
						<SizeDetector.Mobile>
							<Text p5 className="text-white align-items-center mt-10">
								<InfoRoundedIcon style={{ fontSize: 11 }} />
								수업시간 10분 전 부터 입장 가능합니다!
							</Text>
						</SizeDetector.Mobile>
					</Col>
				</Row>
				<Row className={SizeDetector.isDesktop ? "mt-60" : "mt-20"}>
					<Col>
						{renderTodayCourse()}
						{renderMyCourse()}
					</Col>
				</Row>
				{childrenEnrollments.map((childEnrollment, idx) => {
					// 자녀가 수강한 과목이 없으면 출력하지 않는다.
					if (childEnrollment.enrollment.length === 0) {
						return null;
					}

					return (
						<ChildCourseContainer key={idx}>
							<Row>
								<Col>
									<ChildTitleText primary h5>
										{childEnrollment.user_info.name}님이 수강중인 수업
									</ChildTitleText>
								</Col>
							</Row>
							{childEnrollment.enrollment.map((enrollment, idx) => {
								return renderCourseData(
									enrollment,
									idx,
									childEnrollment.enrollment.length - 1 == idx,
									true
								);
							})}
						</ChildCourseContainer>
					);
				})}
			</Container>
		</React.Fragment>
	);
};

const Container = styled.div`
	padding-top: 3.75rem; //Top Menu 3.75rem + 마진 3.75rem;
`;

const CourseContainer = styled.div`
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

const ChildCourseContainer = styled(CourseContainer)`
	@media only screen and (max-width: 767.98px) {
		margin-top: 2.5rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 2.625rem;
	}
`;

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

const TitleText = styled(Text)`
	background-color: ${({ theme }) => `${theme.colors.primary}20`};
	font-weight: 700;
	@media only screen and (max-width: 767.98px) {
		padding-left: 1rem;
		padding-top: 0.625rem;
		padding-bottom: 0.625rem;
	}
	@media only screen and (min-width: 768px) {
		padding-left: 2.5rem;
		padding-top: 1.25rem;
		padding-bottom: 1.25rem;
	}
`;

const ChildTitleText = styled(TitleText)`
	background-color: ${({ theme }) => `${theme.colors.primary}05`};
`;

const NoTodayCourseText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		padding-left: 1rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding-left: 2.5rem;
		padding-top: 2.5rem;
		padding-bottom: 2.5rem;
	}
`;

const CourseDataRow = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 1rem;
		& + & {
			padding-top: 0.25rem;
			padding-bottom: 1rem;
		}
		margin-bottom: 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding-left: 2.5rem;
		padding-right: 2.5rem;
		padding-top: 1.25rem;
		& + & {
			padding-bottom: 1.25rem;
		}
		margin-bottom: 1.25rem;
	}
`;

const Separator = styled.hr`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1.25rem;
	}

	@media only screen and (min-width: 768px) {
		margin-top: 2.5rem;
	}
	background-color: ${({ theme }) => theme.colors.gray};
`;

const TurtleImg = styled.img`
	position: absolute;
	right: 1.25rem;
	margin-top: -15rem;
	width: 27.5rem;
	height: 23.577rem;
`;

const CodingspaceBtn = styled(Button)`
	@media only screen and (max-width: 767.98px) {
		width: 100%;
	}
	@media only screen and (min-width: 768px) {
		& + & {
			margin-left: 1.25rem;
		}
	}
`;

const CodingspaceBtnContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		display: flex;
		justify-content: space-between;
		margin-top: 0.75rem;
	}
	@media only screen and (min-width: 768px) {
		display: inline;
		float: right;
	}
`;

export default MyCodingSpace;
