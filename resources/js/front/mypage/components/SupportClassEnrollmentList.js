import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import EnrollmentStatus from "@constants/EnrollmentStatus";
import useSizeDetector from "@hooks/useSizeDetector";

import * as ctrl from "./SupportClassEnrollmentList.ctrl";
import * as util from "@common/util";

const SupportClassEnrollmentList = ({ user_id, closed }) => {
	const history = useHistory();
	const SizeDetector = useSizeDetector();
	const [initialized, setInitialized] = useState(false);
	const [enrollments, setEnrollments] = useState([]);

	useEffect(() => {
		let query = {
			"filter[status]": EnrollmentStatus.COMPLETE,
			support_class: true
		};
		if (user_id)
			ctrl.getUserEnrollments(user_id, query, enrollments => {
				// closed 여부에 따라 enrollments를 filter 한다.
				let enrollmentsByClosed = enrollments.enrollments.filter(
					enrollment => isVodEnrollmentEnded(enrollment) === closed
				);
				setEnrollments(enrollmentsByClosed);
				setInitialized(true);
			});
	}, []);

	const isVodEnrollmentEnded = enrollment => {
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
							{closed ? "보충수업 종료 내역 없음" : "보충수업 내역 없음"}
						</Text>
					</Col>
				</EnrollmentRow>
				<Separator />
			</EnrollmentContainer>
		);
	};

	const renderEnrollments = targetEnrollments => {
		return (
			<EnrollmentContainer>
				<Separator />
				{targetEnrollments.map((enrollment, idx) => {
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
								</Col>
								<Col align="right">{renderNavigationButton(enrollment)}</Col>
							</EnrollmentRow>
						</React.Fragment>
					);
				})}
				<Separator />
			</EnrollmentContainer>
		);
	};

	const renderNavigationButton = enrollment => {
		// 수강 종료 확인
		if (isVodEnrollmentEnded(enrollment)) {
			return (
				<NavigationButton disabled className={SizeDetector.isDesktop ? "mt-10" : "mt-10 w-100"}>
					수강 종료
				</NavigationButton>
			);
		}

		return (
			<NavigationButton
				secondary
				className={SizeDetector.isDesktop ? "mt-10" : "mt-10 w-100"}
				onClick={() => history.push({ pathname: "/support_class" })}
			>
				보충수업 클래스로 GO!
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
						님의 {closed ? "보충수업 종료 내역" : "보충수업 내역"}
					</Text>
				</Col>
			</Row>
			<Row>
				<Col>
					{initialized && enrollments.length === 0 ? (
						renderNoEnrollments()
					) : (
						<React.Fragment>{renderEnrollments(enrollments)}</React.Fragment>
					)}
				</Col>
			</Row>
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

export default SupportClassEnrollmentList;
