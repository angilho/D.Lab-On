import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import styled, { useTheme } from "styled-components";

import Text from "@components/elements/Text";
import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";

import CourseType from "@constants/CourseType";
import RoleType from "@constants/RoleType";
import CourseTargetGroup from "@constants/CourseTargetGroup";

import * as util from "@common/util";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import QueryBuilderRoundedIcon from "@mui/icons-material/QueryBuilderRounded";

const CoursePanel = ({
	courseId,
	user,
	title,
	type,
	studentTarget,
	durationHour,
	durationMinute,
	durationWeek,
	price,
	discountPrice,
	discountText,
	courseSections,
	handleCartBtn,
	handleApplicationBtn
}) => {
	const theme = useTheme();
	const [userId, setUserId] = useState(0);
	const [courseSectionId, setCourseSectionId] = useState(0);

	useEffect(() => {
		setUserId(user.id);
		// VOD 클래스는 생성된 section의 첫번째를 항상 사용한다.
		if (type === CourseType.VOD) {
			setCourseSectionId(courseSections[0].id);
		}
	}, [user]);

	const validate = () => {
		if (userId === 0) {
			alert("수강할 사용자를 선택해 주세요.");
			return;
		}

		if (courseSectionId === 0) {
			alert("올바른 요일 / 날짜 / 시간을 선택해 주세요.");
			return;
		}

		return true;
	};

	const durationTotalTime = (durationHour * 60 + durationMinute) * durationWeek;
	const durationTotalHour = Math.floor(durationTotalTime / 60);
	const durationTotalMinute = durationTotalTime % 60;

	const getMonthlyPayment = () => {
		if (durationWeek >= 5 && durationWeek <= 8) {
			return 2;
		}
		if (durationWeek >= 9 && durationWeek <= 15) {
			return 3;
		}
		if (durationWeek >= 16 && durationWeek <= 19) {
			return 4;
		}
		if (durationWeek >= 20 && durationWeek <= 23) {
			return 5;
		}
		if (durationWeek >= 24 && durationWeek <= 27) {
			return 6;
		}
		if (durationWeek >= 28) {
			return 7;
		}
		return 1;
	};

	const renderFreePrice = () => {
		return (
			<Col md={12}>
				<Text h5 className="d-inline">
					0원
				</Text>
			</Col>
		);
	};

	const renderPrice = () => {
		return (
			<React.Fragment>
				{discountPrice ? (
					<Col>
						<Text p3 lineThrough gray3 className="d-inline">
							{`총 수강료 ${util.addNumberComma(price)}원`}
						</Text>
						<ArrowForwardIcon
							className="d-inline mr-1 ml-1"
							style={{ fontSize: 16, color: theme.colors.gray3 }}
						/>
						<Text p3 gray3 className="d-inline ml-1">
							{`${util.addNumberComma(price - discountPrice)}원`}
						</Text>
					</Col>
				) : (
					<Col>
						<Text p3 gray3 className="d-inline">
							{`총 수강료 ${price.toLocaleString()}원`}
						</Text>
					</Col>
				)}
				<Col md={12}>
					<Text p3 gray2 className="d-inline mr-2">
						{getMonthlyPayment() === 1 ? "(할부 적용 없음)" : `(${getMonthlyPayment()}개월 할부 시)`}
					</Text>
					<Text h5 className="d-inline">
						{getMonthlyPayment() === 1 ? "" : "월"}
						{`${util.addNumberComma(Math.floor((price - discountPrice) / getMonthlyPayment()))}원`}
					</Text>
				</Col>
			</React.Fragment>
		);
	};

	const getDurationWeekString = () => {
		// CUSTOM: GGF VOD 과목 문구 대응
		if (courseId === 46) {
			return "Geeks Hero's Program";
		}
		return type === CourseType.VOD ? "VOD 클래스 1년간 무제한 수강 가능" : `총 ${durationWeek}회 수업` || "-";
	};

	const getDurationString = () => {
		// CUSTOM: GGF VOD 과목 문구 대응
		if (courseId === 46) {
			return "메타버스 공간에서 펼쳐지는 축제의 장";
		}
		return type === CourseType.VOD
			? "성장 쑥쑥! 이해 쏙쏙! QUIZ 와 함께 하는 강의"
			: `총 ${durationTotalHour}시간 ${durationTotalMinute}분 (회당 ${durationHour}시간 ${durationMinute}분 x ${durationWeek}회)` ||
					"-";
	};

	const filterCourseSectionRecruitDate = courseSection => {
		if (!(courseSection.recruit_start_at !== null && courseSection.recruit_end_at !== null)) {
			return true;
		}

		let recruitStartDate = new Date(courseSection.recruit_start_at);
		let recruitEndDate = new Date(courseSection.recruit_end_at);
		recruitEndDate.setHours(23);
		recruitEndDate.setMinutes(59);
		recruitEndDate.setSeconds(59);

		let now = new Date();
		return recruitStartDate <= now && now < recruitEndDate;
	};

	return (
		<React.Fragment>
			<CourseCardContainer>
				<Row>
					<Col md={12}>
						<Text h6 className="w-100">
							{title}
						</Text>
					</Col>
				</Row>
				<CourseCardSeparator />
				<Row className="justify-contents-center align-items-center">
					<Col>
						<Text p3 className="align-items-center">
							<PermIdentityRoundedIcon className="mr-10" style={{ fontSize: 16 }} />
							{studentTarget || "-"}
						</Text>
						<Text p3 className="align-items-center">
							<DateRangeRoundedIcon className="mr-10" style={{ fontSize: 16 }} />
							{getDurationWeekString()}
						</Text>
						<Text p3 className="align-items-center">
							<QueryBuilderRoundedIcon className="mr-10" style={{ fontSize: 16 }} />
							{getDurationString()}
						</Text>
					</Col>
				</Row>
				<CourseCardSeparator />
				<Row className="justify-contents-center" align="right">
					{discountText && (
						<Col md={12} className="mb-10">
							<DiscountText p3 className="d-inline">
								{discountText}
							</DiscountText>
						</Col>
					)}
					{price === 0 ? renderFreePrice() : renderPrice()}
				</Row>
				<CourseCardSeparator />
				<Row>
					<Col>
						<FormControl
							className="w-100"
							as="select"
							name="userId"
							value={userId}
							onChange={event => setUserId(parseInt(event.currentTarget.value))}
						>
							{user.id ? (
								<option value={user.id}>
									{user.name || ""}
									{user.role !== RoleType.CHILD ? "(학부모회원)" : ""}의 수업
								</option>
							) : (
								<option value={0}>로그인이 필요합니다.</option>
							)}
							{user.children &&
								user.children.map((child, idx) => {
									return (
										<option key={idx} value={child.child_id}>
											{child.user_info.name || ""}(학생회원)의 수업
										</option>
									);
								})}
						</FormControl>
						{type && type !== CourseType.VOD && (
							<FormControl
								className="w-100"
								as="select"
								name="sectionId"
								value={courseSectionId}
								onChange={event => setCourseSectionId(parseInt(event.currentTarget.value))}
							>
								{<option value={0}>요일, 시간, 날짜 선택</option>}
								{courseSections
									.filter(courseSection => courseSection.closed === false)
									.filter(filterCourseSectionRecruitDate)
									.sort((currentSection, nextSection) => {
										return nextSection.id - currentSection.id;
									})
									.map((section, idx) => {
										let targetGroup = CourseTargetGroup.convertToString(section.target_group);
										let targetGrade =
											section.target_group === CourseTargetGroup.GENERAL
												? ""
												: ` ${section.target_grade}학년`;
										let optionText =
											type === CourseType.REGULAR
												? `${targetGroup || "-"}${targetGrade}, ${section.duration_day_str ||
														"-"}, ${section.duration_start_time_str ||
														"-"} (${section.duration_period_wo_year_str || "-"})`
												: `${targetGroup} ${targetGrade} | 요일 협의 | 시간 협의 | 날짜 협의`;

										let courseSectionEndDate = new Date(section.end_at);
										courseSectionEndDate.setHours(23);
										courseSectionEndDate.setMinutes(59);
										courseSectionEndDate.setSeconds(59);
										let sectionEnded = Date.now() > courseSectionEndDate;
										if (sectionEnded) {
											optionText += " - 마감";
										}

										return (
											<option key={idx} value={section.id} disabled={sectionEnded}>
												{optionText}
											</option>
										);
									})}
							</FormControl>
						)}
					</Col>
				</Row>
				<Row>
					<Col xs={4} md={4} className="pr-6">
						<Button
							secondary
							size="large"
							className="w-100"
							disabled={courseId === 46}
							onClick={() => {
								if (validate()) handleCartBtn(userId, courseSectionId);
							}}
						>
							<ShoppingCartRoundedIcon />
						</Button>
					</Col>
					<Col xs={8} md={8} className="pl-6">
						<Button
							primary
							size="large"
							className="w-100"
							disabled={courseId === 46}
							onClick={() => {
								if (validate()) handleApplicationBtn(userId, courseSectionId);
							}}
						>
							{courseId === 337 ? "신청하고 알림받기" : "신청하기"}
						</Button>
					</Col>
				</Row>
			</CourseCardContainer>
		</React.Fragment>
	);
};

const CourseCardContainer = styled.div`
	position: sticky;
	top: 0rem;
	padding: 1.25rem;
	background-color: white;
	border-radius: 0.25rem;
	-webkit-box-shadow: 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
	-moz-box-shadow: 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
	box-shadow: 0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
`;

const CourseCardSeparator = styled.hr`
	margin-bottom: 1.25rem;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const DiscountText = styled(Text)`
	padding: 0.25rem 0.5rem 0.25rem 0.5rem;
	color: ${({ theme }) => theme.colors.white};
	border-radius: 0.125rem;
	background-color: ${({ theme }) => theme.colors.primary};
`;

export default CoursePanel;
