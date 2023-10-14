import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import EnrollmentStatus from "@constants/EnrollmentStatus";
import CourseType from "@constants/CourseType";
import useSizeDetector from "@hooks/useSizeDetector";

import * as ctrl from "./EnrollmentList.ctrl";
import * as util from "@common/util";

const EnrollmentList = ({ user_id, closed }) => {
	const history = useHistory();
	const SizeDetector = useSizeDetector();
	const [initialized, setInitialized] = useState(false);
	const [enrollments, setEnrollments] = useState([]);
	const [childrenEnrollments, setChildrenEnrollments] = useState([]);

	useEffect(() => {
		let query = {
			"filter[status]": EnrollmentStatus.COMPLETE
		};
		if (user_id)
			ctrl.getUserEnrollments(user_id, query, enrollments => {
				// closed 여부에 따라 enrollments를 filter 한다.
				let enrollmentsByClosed = enrollments.enrollments.filter(
					enrollment => isEnrollmentEnded(enrollment) === closed
				);
				setEnrollments(enrollmentsByClosed);
				let childEnrollmentsByClosed = enrollments.children_enrollments.map(childEnrollment => {
					return {
						...childEnrollment,
						enrollment: childEnrollment.enrollment.filter(
							enrollment => isEnrollmentEnded(enrollment) === closed
						)
					};
				});
				setChildrenEnrollments(childEnrollmentsByClosed);
				setInitialized(true);
			});
	}, []);

	const isEnrollmentEnded = enrollment => {
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

	const getVodEnrollmentDate = enrollment => {
		let vodEndDate = new Date(enrollment.updated_at);
		vodEndDate.setFullYear(vodEndDate.getFullYear() + 1);
		vodEndDate.setDate(vodEndDate.getDate() - 1);

		return `${util.getFormatDate(enrollment.updated_at)} ~ ${util.getFormatDate(vodEndDate)}`;
	};

	const renderNoEnrollments = () => {
		return (
			<EnrollmentContainer>
				<Separator />
				<EnrollmentRow xs={1} md={1}>
					<Col>
						<Text
							p1
							fontWeight={700}
							fontSize={SizeDetector.isDesktop ? 1.5 : 1}
							lineHeight={!SizeDetector.isDesktop ? 2.625 : 1.5}
						>
							{closed ? "수강 종료 내역 없음" : "수강 내역 없음"}
						</Text>
						<div className={SizeDetector.isDesktop ? "mt-20" : "mt-8"}>
							<div className={SizeDetector.isDesktop ? "d-inline" : ""}>
								<Text
									p1
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1.0 : null}
									className="d-inline"
								>
									수강 신청 이력이 없습니다. 디랩온이 준비한 다양한 수업을 만나보시겠습니까?
								</Text>
							</div>
						</div>
					</Col>
					<Col align="right">
						<NavigationButton
							primary
							className={SizeDetector.isDesktop ? "mt-10" : "mt-10 w-100"}
							onClick={() => history.push({ pathname: "/curriculum" })}
						>
							커리큘럼 살펴보기
						</NavigationButton>
					</Col>
				</EnrollmentRow>
				<Separator />
			</EnrollmentContainer>
		);
	};

	const renderEnrollments = (targetEnrollments, isChild) => {
		return (
			<EnrollmentContainer>
				<Separator />
				{targetEnrollments.map((enrollment, idx) => {
					let time = util.getCourseTime(enrollment.course, enrollment.course_section);

					return (
						<React.Fragment key={idx}>
							<EnrollmentRow xs={1} md={1}>
								<Col>
									<Text
										p1
										fontWeight={700}
										fontSize={SizeDetector.isDesktop ? 1.5 : 1}
										lineHeight={!SizeDetector.isDesktop ? 2.625 : 1.5}
									>
										{enrollment.course.name}
									</Text>
									{enrollment.course.type !== CourseType.VOD && (
										<div className={SizeDetector.isDesktop ? "mt-20" : "mt-8"}>
											<div className={SizeDetector.isDesktop ? "d-inline" : ""}>
												<Text p1 primary className="d-inline">
													·
												</Text>
												<Text
													p1
													fontWeight={!SizeDetector.isDesktop ? 400 : null}
													fontSize={!SizeDetector.isDesktop ? 0.75 : null}
													className="d-inline"
												>
													기간:
												</Text>
												<Text p1 className="d-inline ml-10">
													{enrollment.course_section.duration_period_str}
												</Text>
											</div>
											<div className={SizeDetector.isDesktop ? "" : "mt-4"}>
												<Text p1 primary className="d-inline">
													·
												</Text>
												<Text
													p1
													fontWeight={!SizeDetector.isDesktop ? 400 : null}
													fontSize={!SizeDetector.isDesktop ? 0.75 : null}
													className="d-inline"
												>
													시간:
												</Text>
												<Text p1 className="d-inline ml-10">
													{time}
												</Text>
											</div>
										</div>
									)}
									{enrollment.course.type === CourseType.VOD && (
										<div className={SizeDetector.isDesktop ? "mt-20" : "mt-8"}>
											<div className={SizeDetector.isDesktop ? "d-inline" : ""}>
												<Text p1 primary className="d-inline">
													·
												</Text>
												<Text
													p1
													fontWeight={!SizeDetector.isDesktop ? 400 : null}
													fontSize={!SizeDetector.isDesktop ? 0.75 : null}
													className="d-inline"
												>
													수강기간:
												</Text>
												<Text p1 className="d-inline ml-10">
													{getVodEnrollmentDate(enrollment)}
												</Text>
											</div>
										</div>
									)}
								</Col>
								<Col align="right">{renderNavigationButton(isChild, enrollment)}</Col>
							</EnrollmentRow>
						</React.Fragment>
					);
				})}
				<Separator />
			</EnrollmentContainer>
		);
	};

	const renderNavigationButton = (isChild, enrollment) => {
		// 수강 종료 확인
		if (isEnrollmentEnded(enrollment)) {
			return (
				<NavigationButton disabled className={SizeDetector.isDesktop ? "mt-10" : "mt-10 w-100"}>
					수강 종료
				</NavigationButton>
			);
		}

		// 자녀의 수강 내역
		if (isChild) {
			return (
				<NavigationButton disabled className={SizeDetector.isDesktop ? "mt-10" : "mt-10 w-100"}>
					자녀계정으로 확인해 주세요
				</NavigationButton>
			);
		}

		return (
			<NavigationButton
				secondary
				className={SizeDetector.isDesktop ? "mt-10" : "mt-10 w-100"}
				onClick={() => history.push({ pathname: "/mycodingspace" })}
			>
				나의 강의실로 GO!
			</NavigationButton>
		);
	};

	return (
		<React.Fragment>
			<Row>
				<Col>
					<Text primary h5 className="d-inline">
						{userInfo.name}
					</Text>
					<Text h5 className="d-inline">
						님의 {closed ? "수강 종료 내역" : "수강내역"}
					</Text>
				</Col>
			</Row>
			<Row>
				<Col>
					{initialized && enrollments.length === 0 ? (
						renderNoEnrollments()
					) : (
						<React.Fragment>{renderEnrollments(enrollments, false)}</React.Fragment>
					)}
				</Col>
			</Row>
			{childrenEnrollments.map((childEnrollment, idx) => {
				// 자녀가 수강한 과목이 없으면 출력하지 않는다.
				if (childEnrollment.enrollment.length === 0) {
					return null;
				}

				return (
					<React.Fragment key={idx}>
						<Row className="mt-40">
							<Col>
								<Text primary h5 className="d-inline">
									{childEnrollment.user_info.name}
								</Text>
								<Text h5 className="d-inline">
									님의 {closed ? "수강 종료 내역" : "수강내역"}
								</Text>
							</Col>
						</Row>
						<Row>
							<Col>{renderEnrollments(childEnrollment.enrollment, true)}</Col>
						</Row>
					</React.Fragment>
				);
			})}
		</React.Fragment>
	);
};

const EnrollmentContainer = styled.div`
	margin-bottom: 1.25rem;
`;

const Separator = styled.hr`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	@media only screen and (min-width: 768px) {
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
	}
	background-color: 0.063rem solid ${({ theme }) => theme.colors.gray};
`;

const EnrollmentRow = styled(Row)`
	& + & {
		margin-top: 1.25rem;
	}
`;

const NavigationButton = styled(Button)`
	padding: 0 30px;

	@media only screen and (max-width: 767.98px) {
		margin-bottom: 0.75rem;
	}
`;

export default EnrollmentList;
