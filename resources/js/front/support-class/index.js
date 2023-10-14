import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import useSizeDetector from "@hooks/useSizeDetector";
import WaveImage from "@images/course/wave.png";
import TurtleImage from "@images/mycodingspace/codingspace_turtle.png";
import EnrollmentStatus from "@constants/EnrollmentStatus";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const SupportClass = props => {
	const history = useHistory();
	const [enrollments, setEnrollments] = useState([]);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		if (!userInfo.id) history.push({ pathname: "/login" });
		let query = {
			"filter[status]": EnrollmentStatus.COMPLETE,
			support_class: true
		};
		ctrl.getSupportClassEnrollments(userInfo.id, query, data => {
			setEnrollments(data.enrollments);
		});
	}, []);

	/**
	 * 수강 상태 종료 확인
	 * 날짜가 지났거나, closed된 section인 경우 종료로 취급한다.
	 * @param {*} enrollment
	 * @returns
	 */
	const isVodCourseEnded = enrollment => {
		let nowDate = new Date();
		if (enrollment.support_class_enrollment != null) {
			let hasDeadlineVodEndDate = new Date(enrollment.support_class_enrollment.class_end_at);
			return nowDate > hasDeadlineVodEndDate;
		}
		let vodEndDate = new Date(enrollment.updated_at);
		vodEndDate.setFullYear(vodEndDate.getFullYear() + 1);
		vodEndDate.setDate(vodEndDate.getDate() - 1);
		vodEndDate.setHours(23);
		vodEndDate.setMinutes(59);
		vodEndDate.setSeconds(59);
		return nowDate > vodEndDate;
	};

	const getVodEnrollmentDate = enrollment => {
		if (enrollment.support_class_enrollment != null) {
			let hasDeadlineVodEndDate = new Date(enrollment.support_class_enrollment.class_end_at);
			return `${util.getFormatDate(enrollment.updated_at)} ~ ${util.getFormatDate(hasDeadlineVodEndDate)}`;
		}
		let vodEndDate = new Date(enrollment.updated_at);
		vodEndDate.setFullYear(vodEndDate.getFullYear() + 1);
		vodEndDate.setDate(vodEndDate.getDate() - 1);

		return `${util.getFormatDate(enrollment.updated_at)} ~ ${util.getFormatDate(vodEndDate)}`;
	};

	const onClickEnterCourseVod = courseId => {
		history.push({ pathname: `/courses/${courseId}/chapters` });
	};

	const renderGotoVodButtons = enrollment => {
		if (isVodCourseEnded(enrollment)) {
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

	const renderCourseData = (enrollment, idx, isLast) => {
		return (
			<React.Fragment key={idx}>
				<CourseDataRow>
					<Col>
						<Row>
							<Col>
								<Text h5>{enrollment.course.name || "-"}</Text>
							</Col>
						</Row>
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
								{renderGotoVodButtons(enrollment)}
							</Col>
						</Row>
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

	const renderSupportCourse = () => {
		return (
			<CourseContainer>
				<Row>
					<Col>
						<TitleText primary h5>
							보충수업
						</TitleText>
					</Col>
				</Row>
				<SizeDetector.Desktop>
					<TurtleImg src={TurtleImage} />
				</SizeDetector.Desktop>
				{enrollments.length === 0 && (
					<Row xs={1} md={2}>
						<Col md={8}>
							<NoTodayCourseText p1>보충수업이 없습니다.</NoTodayCourseText>
						</Col>
					</Row>
				)}
				{enrollments.map((enrollment, idx) => {
					return renderCourseData(enrollment, idx, enrollments.length - 1 == idx);
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
							보충수업 클래스
						</Text>
					</Col>
				</Row>
				<Row className={SizeDetector.isDesktop ? "mt-60" : "mt-20"}>
					<Col>{renderSupportCourse()}</Col>
				</Row>
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

export default SupportClass;
