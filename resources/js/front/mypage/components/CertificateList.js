import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import useSizeDetector from "@hooks/useSizeDetector";

import * as ctrl from "./CertificateList.ctrl";
import * as util from "@common/util";

const CertificateList = ({ user_id }) => {
	const history = useHistory();
	const SizeDetector = useSizeDetector();
	const [initialized, setInitialized] = useState(false);
	const [certificateEnrollments, setCertificateEnrollments] = useState([]);

	useEffect(() => {
		if (user_id)
			ctrl.getUserCertificateEnrollments(user_id, certificateEnrollments => {
				setCertificateEnrollments(certificateEnrollments);
				setInitialized(true);
			});
	}, []);

	const onClickIssueCertificate = courseId => {
		window.open(`/mypage/enrollment/certificate/${courseId}/issue`);
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
							{"VOD 클래스 수강 내역 없음"}
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

	const renderEnrollments = targetEnrollments => {
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
								<Col align="right">{renderCertificateButton(enrollment)}</Col>
							</EnrollmentRow>
						</React.Fragment>
					);
				})}
				<Separator />
			</EnrollmentContainer>
		);
	};

	const renderCertificateButton = enrollment => {
		return (
			<NavigationButton
				secondary
				className={SizeDetector.isDesktop ? "mt-10" : "mt-10 w-100"}
				disabled={!enrollment.certificated}
				onClick={() => onClickIssueCertificate(enrollment.course.id)}
			>
				발급하기
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
						님의 {"수강내역"}
					</Text>
				</Col>
			</Row>
			<Row>
				<Col>
					{initialized && certificateEnrollments.length === 0 ? (
						renderNoEnrollments()
					) : (
						<React.Fragment>{renderEnrollments(certificateEnrollments)}</React.Fragment>
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

export default CertificateList;
