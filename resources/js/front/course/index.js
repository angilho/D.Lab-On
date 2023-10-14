import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import Text from "@components/elements/Text";
import FrontTopMenu from "@components/frontTopMenu";

import CoursePanel from "./components/CoursePanel";
import CourseType from "@constants/CourseType";
import RoleType from "@constants/RoleType";
import useSizeDetector from "../../hooks/useSizeDetector";

import WaveImage from "@images/course/wave.png";

import * as ctrl from "./index.ctrl";

const Course = ({ course_id }) => {
	const detailLoadingHtml = `
	<div class="container mt-60 mb-60 text-center">
		<div class="d-flex justify-content-center">
			<div class="col md-6">
				<div class="spinner-border" role="status">
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		</div>
	</div>`;

	const history = useHistory();
	const SizeDetector = useSizeDetector();
	const [user, setUser] = useState({});
	const [course, setCourse] = useState({});
	const [courseIntroDetailHtml, setCourseIntroDetailHtml] = useState(null);
	const [courseDetailHtml, setCourseDetailHtml] = useState(detailLoadingHtml);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (userInfo.id) ctrl.getChildren(userInfo.id, callbackGetUser);
		ctrl.getCourse(course_id, callbackGetCourse);
	}, []);

	useEffect(() => {
		getCourseDetail();
	}, [SizeDetector.isDesktop, course]);

	const getCourseDetail = () => {
		if (course.id) {
			if (course.has_description) {
				// intro 이미지 설정
				let introDetailHtml = "";
				if (SizeDetector.isDesktop) {
					let introImageUrl = `/storage/files/${course.course_description.desktop_intro_image.filename}`;
					let introStyle = "";
					introDetailHtml = `<img class="w-100" style="${introStyle}" src=${introImageUrl} />`;
				} else {
					let introImageUrl = `/storage/files/${course.course_description.mobile_intro_image.filename}`;
					let introStyle = "margin-bottom: 40px;";
					introDetailHtml = `<img class="w-100" style="${introStyle}" src=${introImageUrl} />`;
				}
				setCourseIntroDetailHtml(introDetailHtml);

				// 소개 설정
				let detailHtml = "";
				if (SizeDetector.isDesktop) {
					let detailStyle = "scroll-margin-top: 6.5rem";
					detailHtml = `
						<section style="margin-top: 1rem"></section>
						<section id="course" style="${detailStyle}">${course.course_description.desktop_course_description}</section>
						<section id="curriculum" style="${detailStyle}">${course.course_description.desktop_course_curriculum}</section>
						<section id="operation" style="${detailStyle}">${course.course_description.desktop_operation}</section>
						<section id="refund" style="${detailStyle}">${course.course_description.desktop_refund}</section>
					`;
				} else {
					let detailStyle = "scroll-margin-top: 2.6rem";
					detailHtml = `
						<section style="margin-top: 1rem"></section>
						<section id="course" style="${detailStyle}">${course.course_description.mobile_course_description}</section>
						<section id="curriculum" style="${detailStyle}">${course.course_description.mobile_course_curriculum}</section>
						<section id="operation" style="${detailStyle}">${course.course_description.mobile_operation}</section>
						<section id="refund" style="${detailStyle}">${course.course_description.mobile_refund}</section>
					`;
				}
				setCourseDetailHtml(detailHtml);
			} else {
				// HTML으로 작성된 과목 소개를 얻는다.
				ctrl.getCourseIntroDetail(course_id, SizeDetector.isDesktop, callbackGetCourseIntroDetail);
				ctrl.getCourseDetail(course_id, SizeDetector.isDesktop, callbackGetCourseDetail);
			}
		}
	};

	const callbackGetCourse = course => setCourse(course);

	const callbackGetUser = user => setUser(user);

	const callbackGetCourseDetail = courseDetail => setCourseDetailHtml(courseDetail);
	const callbackGetCourseIntroDetail = courseIntroDetail => setCourseIntroDetailHtml(courseIntroDetail);

	const onClickCartBtn = (userId, courseSectionId) => {
		if (userInfo.id) {
			// userId가 학부모 회원인지 판단한다. 현재 신청대상 userId가 로그인한 사용자가 아니면 항상 자녀로 취급해도 된다.
			if (user.id === userId && user.role !== RoleType.CHILD) {
				if (!confirm("학부모회원으로 수강신청 중입니다. 계속 진행하시겠습니까?")) {
					return;
				}
			}
			ctrl.createCart(userId, course.id, courseSectionId, cart => {
				if (confirm("장바구니에 과목이 추가되었습니다.\n장바구니에서 확인하시겠습니까?")) {
					history.push({ pathname: "/cart" });
				}
			});
		} else {
			history.push({ pathname: "/login" });
		}
	};

	const onClickApplicationBtn = (userId, courseSectionId) => {
		if (userInfo.id) {
			// userId가 학부모 회원인지 판단한다. 현재 신청대상 userId가 로그인한 사용자가 아니면 항상 자녀로 취급해도 된다.
			if (user.id === userId && user.role !== RoleType.CHILD) {
				if (!confirm("학부모회원으로 수강신청 중입니다. 계속 진행하시겠습니까?")) {
					return;
				}
			}
			ctrl.existsCart(userId, course.id, courseSectionId, data => {
				if (data || data.id) history.push({ pathname: "/cart" });
			});
		} else {
			history.push({ pathname: "/login" });
		}
	};

	const renderCourseThumbnail = () => {
		let coursePrice = course.price - course.discount_price;
		switch (course.type) {
			case CourseType.ONEONONE:
				return (
					<div className="position-relative">
						<ThumbnailCourseCaption>
							<ThumbnailCourseCaptionText h5 white className="justify-content-center">
								1:1 클래스
							</ThumbnailCourseCaptionText>
						</ThumbnailCourseCaption>
						{coursePrice === 0 && renderFreeCourse()}
						<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
						<ThumbnailCaption>
							<Text p3 className="d-inline" white>
								본 수업은
							</Text>
							<Text p3 className="d-inline" primary>
								&nbsp;맞춤형 1:1 강의
							</Text>
							<Text p3 className="d-inline" white>
								로 구성된 수업입니다.
							</Text>
						</ThumbnailCaption>
					</div>
				);
			case CourseType.PACKAGE:
				return (
					<div className="position-relative">
						<ThumbnailCourseCaption>
							<ThumbnailCourseCaptionText h5 white className="justify-content-center">
								1:1 패키지
							</ThumbnailCourseCaptionText>
						</ThumbnailCourseCaption>
						{coursePrice === 0 && renderFreeCourse()}
						<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
						<ThumbnailCaption>
							<Text p3 className="d-inline" white>
								본 수업은
							</Text>
							<Text p3 className="d-inline" primary>
								&nbsp;특별 패키지 강의
							</Text>
							<Text p3 className="d-inline" white>
								로 구성된 수업입니다.
							</Text>
						</ThumbnailCaption>
					</div>
				);
			case CourseType.REGULAR:
				// CUSTOM: 글로벌 커리어 특강 59번 과목 대응
				if (course.id === 59) {
					return renderCustomGlobalCourseThumbnail();
				}
				// CUSTOM: 글로벌 기업가정신 특강 337번 과목 대응
				if (course.id === 337) {
					return renderCustomCourse337Thumbnail();
				}
				// CUSTOM: 글로벌 기업가정신 특강 339번 과목 대응
				if (course.id === 339) {
					return renderCustomCourse339Thumbnail();
				}

				return (
					<div className="position-relative">
						{coursePrice === 0 && renderFreeCourse()}
						<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
						<ThumbnailCaption>
							<Text p3 className="d-inline" white>
								본 수업은
							</Text>
							<Text p3 className="d-inline" primary>
								&nbsp;소규모 실시간 강의
							</Text>
							<Text p3 className="d-inline" white>
								로 구성된 수업입니다.
							</Text>
						</ThumbnailCaption>
					</div>
				);
			case CourseType.VOD:
				// CUSTOM: GGF 46번 과목 대응
				if (course.id === 46) {
					return renderCustomGGFCourseThumbnail();
				}

				return (
					<div className="position-relative">
						{coursePrice === 0 && renderFreeCourse()}
						<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
						<ThumbnailCaption>
							<Text p3 className="d-inline" white>
								본 수업은
							</Text>
							<Text p3 className="d-inline" primary>
								&nbsp;온라인 동영상(VOD)과 퀴즈
							</Text>
							<Text p3 className="d-inline" white>
								로 구성된 수업입니다.
							</Text>
						</ThumbnailCaption>
					</div>
				);
			default:
				return <img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />;
		}
	};

	const renderFreeCourse = () => {
		return (
			<ThumbnailFreeCourseCaption>
				<ThumbnailFreeCourseCaptionText h5 white className="justify-content-center">
					무료강의
				</ThumbnailFreeCourseCaptionText>
			</ThumbnailFreeCourseCaption>
		);
	};

	const renderCourse = () => {
		return (
			<React.Fragment>
				<WaveImg src={WaveImage} />
				<div className="container">
					<Row>
						<CourseCol md={8}>
							{course && course.thumbnail && course.thumbnail.filename && renderCourseThumbnail()}
							<SizeDetector.Mobile>
								<Row className="mt-20">
									<Col>
										<CoursePanel
											courseId={course.id}
											user={user}
											title={course.name || ""}
											type={course.type}
											studentTarget={course.student_target || ""}
											durationHour={course.duration_hour || 0}
											durationMinute={course.duration_minute || 0}
											durationWeek={course.duration_week || ""}
											price={course.price || 0}
											discountPrice={course.discount_price || 0}
											discountText={course.discount_text}
											courseSections={course.sections || []}
											handleCartBtn={onClickCartBtn}
											handleApplicationBtn={onClickApplicationBtn}
										/>
									</Col>
								</Row>
							</SizeDetector.Mobile>
							<CourseHtmlContainer>
								<div dangerouslySetInnerHTML={{ __html: courseIntroDetailHtml }} />
							</CourseHtmlContainer>
							{/* CUSTOM: GGF 과목, 글로벌커 리어특강 과목에서는 FrontTopMenu 표시안함 */}
							{course.id !== 46 && course.id !== 59 && (
								<FrontTopMenu
									scrollBlock="start"
									index={index}
									menu={[
										{ title: "과목소개", link: "#course" },
										{ title: "커리큘럼", link: "#curriculum" },
										{ title: "운영방법", link: "#operation" },
										{ title: "환불방법", link: "#refund" }
									]}
								/>
							)}
							<CourseHtmlContainer>
								<div className={SizeDetector.isDesktop ? "" : "p-0"}>
									<div dangerouslySetInnerHTML={{ __html: courseDetailHtml }} />
								</div>
							</CourseHtmlContainer>
						</CourseCol>
						<Col md={4}>
							<SizeDetector.Desktop>
								<CourseCardContainer>
									<CoursePanel
										courseId={course.id}
										user={user}
										title={course.name || ""}
										type={course.type}
										studentTarget={course.student_target || ""}
										durationHour={course.duration_hour || 0}
										durationMinute={course.duration_minute || 0}
										durationWeek={course.duration_week || ""}
										price={course.price || 0}
										discountPrice={course.discount_price || 0}
										discountText={course.discount_text}
										courseSections={course.sections || []}
										handleCartBtn={onClickCartBtn}
										handleApplicationBtn={onClickApplicationBtn}
									/>
								</CourseCardContainer>
							</SizeDetector.Desktop>
						</Col>
					</Row>
				</div>
			</React.Fragment>
		);
	};

	/**
	 * CUSTOM: GGF VOD 과목 썸네일 문구 대응
	 */
	const renderCustomGGFCourseThumbnail = () => {
		let coursePrice = course.price - course.discount_price;
		return (
			<div className="position-relative">
				{coursePrice === 0 && renderFreeCourse()}
				<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
				<ThumbnailCaption>
					<Text p3 className="d-inline" white>
						GGF 2021는
					</Text>
					<Text p3 className="d-inline" primary>
						&nbsp;Youtube와 GGF Metaverse Zone
					</Text>
					<Text p3 className="d-inline" white>
						에서 진행됩니다.
					</Text>
				</ThumbnailCaption>
			</div>
		);
	};

	/**
	 * CUSTOM: 글로벌 커리어특강 과목 썸네일 문구 대응
	 */
	const renderCustomGlobalCourseThumbnail = () => {
		let coursePrice = course.price - course.discount_price;
		return (
			<div className="position-relative">
				{coursePrice === 0 && renderFreeCourse()}
				<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
				<ThumbnailCaption>
					<Text p3 className="d-inline" white>
						본 수업은
					</Text>
					<Text p3 className="d-inline" primary>
						&nbsp;온라인(ZOOM)
					</Text>
					<Text p3 className="d-inline" white>
						으로 실시간 진행됩니다.
					</Text>
				</ThumbnailCaption>
			</div>
		);
	};

	/**
	 * CUSTOM: 글로벌 기업가정신 특강 과목 썸네일 문구 대응
	 */
	const renderCustomCourse337Thumbnail = () => {
		let coursePrice = course.price - course.discount_price;
		return (
			<div className="position-relative">
				{coursePrice === 0 && renderFreeCourse()}
				<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
				<ThumbnailCaption>
					<Text p3 className="d-inline" white>
						본 특강은
					</Text>
					<Text p3 className="d-inline" primary>
						&nbsp;온라인(Zoom/Youtube)
					</Text>
					<Text p3 className="d-inline" white>
						으로 실시간 진행됩니다.
					</Text>
				</ThumbnailCaption>
			</div>
		);
	};

	/**
	 * CUSTOM: 글로벌 기업가정신 특강 과목 썸네일 문구 대응
	 */
	const renderCustomCourse339Thumbnail = () => {
		let coursePrice = course.price - course.discount_price;
		return (
			<div className="position-relative">
				{coursePrice === 0 && renderFreeCourse()}
				<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
				<ThumbnailCaption>
					<Text p3 className="d-inline" white>
						본 특강은
					</Text>
					<Text p3 className="d-inline" primary>
						&nbsp;온라인(ZOOM)
					</Text>
					<Text p3 className="d-inline" white>
						으로 실시간 진행됩니다.
					</Text>
				</ThumbnailCaption>
			</div>
		);
	};

	return <div className="course">{renderCourse()}</div>;
};

const CourseCol = styled(Col)`
	padding-top: 3.75rem; //Top Menu 3.75rem + 마진 3.75rem;
	background-color: transparent;
`;

const CourseCardContainer = styled.div`
	position: sticky;
	top: 10.25rem;
`;

const ThumbnailCaption = styled.div`
	width: 100%;
	background-color: #000000;
	text-align: center;
	padding-top: 0.625rem;
	padding-bottom: 0.625rem;
`;

const ThumbnailCourseCaption = styled.div`
	position: absolute;
	width: 10.188rem;
	height: 4.25rem;
	border-radius: 0 0 2.438rem 0;
	background-color: ${({ theme }) => theme.colors.primary};
`;

const ThumbnailCourseCaptionText = styled(Text)`
	position: absolute;
	top: 1rem;
	left: 1.5rem;
`;

const ThumbnailFreeCourseCaption = styled.div`
	position: absolute;
	right: 0;
	@media only screen and (max-width: 767.98px) {
		width: 90px;
		height: 35px;
	}
	@media only screen and (min-width: 768px) {
		width: 10.188rem;
		height: 4.25rem;
	}
	border-radius: 0 0 0 2.438rem;
	background-color: ${({ theme }) => theme.colors.primary};
`;

const ThumbnailFreeCourseCaptionText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		position: absolute;
		font-size: 14px;
		line-height: 14px;
		top: 0.5rem;
		right: 1rem;
	}
	@media only screen and (min-width: 768px) {
		position: absolute;
		top: 1rem;
		right: 2rem;
	}
`;

const WaveImg = styled.img`
	position: absolute;
	width: 100%;
	@media only screen and (max-width: 767.98px) {
		height: 13.125rem;
	}
	@media only screen and (min-width: 768px) {
		height: 27.287rem;
	}
`;

const CourseHtmlContainer = styled.div`
	width: 100%;
	overflow-x: scroll;
`;

export default Course;
