import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";
import CourseType from "@constants/CourseType";
import Button from "@components/elements/Button";
import CourseCard from "@components/courseCard";
import Text from "@components/elements/Text";
import useSizeDetector from "@hooks/useSizeDetector";

import * as ctrl from "./CourseGrid.ctrl";

const CourseGrid = ({ courseIds }) => {
	const [hasRegularCourse, setHasRegularCourse] = useState(false);
	const [hasOneOnOneCourse, setHasOneOnOneCourse] = useState(false);
	const [hasPackageCourse, setHasPackageCourse] = useState(false);
	const [hasVodCourse, setHasVodCourse] = useState(false);
	const [selectedCourseType, setSelectedCourseType] = useState(CourseType.VOD);

	const [courses, setCourses] = useState([]);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		if (!courseIds || courseIds.length == 0) return;
		if (courses.length !== 0) return;
		ctrl.getCourses(courseIds, resultCourses => setCourseGrid(resultCourses));
	}, [courseIds]);

	const setCourseGrid = resultCourses => {
		let checkHasPackageCourse = resultCourses.data.some(course => course.type === CourseType.PACKAGE);
		let checkHasOneOnOneCourse = resultCourses.data.some(course => course.type === CourseType.ONEONONE);
		let checkHasRegularCourse = resultCourses.data.some(course => course.type === CourseType.REGULAR);
		let checkHasVodCourse = resultCourses.data.some(course => course.type === CourseType.VOD);

		let defaultSelectedCourseType;
		if (checkHasPackageCourse) defaultSelectedCourseType = CourseType.PACKAGE;
		if (checkHasOneOnOneCourse) defaultSelectedCourseType = CourseType.ONEONONE;
		if (checkHasRegularCourse) defaultSelectedCourseType = CourseType.REGULAR;
		if (checkHasVodCourse) defaultSelectedCourseType = CourseType.VOD;

		setHasPackageCourse(checkHasPackageCourse);
		setHasOneOnOneCourse(checkHasOneOnOneCourse);
		setHasRegularCourse(checkHasRegularCourse);
		setHasVodCourse(checkHasVodCourse);
		setSelectedCourseType(defaultSelectedCourseType);

		let sortedCourses = courseIds.map(courseId => {
			return resultCourses.data.filter(resultCourse => resultCourse.id === courseId)[0];
		});
		setCourses({ ...resultCourses, data: sortedCourses });
	};

	return (
		<React.Fragment>
			<div className="justify-content-center align-items-center d-flex">
				{hasVodCourse && (
					<CourseTypeButton
						size="large"
						primary={selectedCourseType === CourseType.VOD}
						secondary={selectedCourseType !== CourseType.VOD}
						onClick={() => setSelectedCourseType(CourseType.VOD)}
					>
						<Text
							fontSize={SizeDetector.isDesktop ? 1.125 : 0.75}
							lineHeight={SizeDetector.isDesktop ? 2 : 1.667}
							fontWeight={SizeDetector.isDesktop ? 400 : 500}
							className="justify-content-center"
						>
							VOD 클래스
						</Text>
					</CourseTypeButton>
				)}
				{hasRegularCourse && (
					<CourseTypeButton
						size="large"
						primary={selectedCourseType === CourseType.REGULAR}
						secondary={selectedCourseType !== CourseType.REGULAR}
						onClick={() => setSelectedCourseType(CourseType.REGULAR)}
					>
						<Text
							fontSize={SizeDetector.isDesktop ? 1.125 : 0.75}
							lineHeight={SizeDetector.isDesktop ? 2 : 1.667}
							fontWeight={SizeDetector.isDesktop ? 400 : 500}
							className="justify-content-center"
						>
							라이브클래스
						</Text>
					</CourseTypeButton>
				)}
				{hasPackageCourse && (
					<CourseTypeButton
						size="large"
						primary={selectedCourseType === CourseType.PACKAGE}
						secondary={selectedCourseType !== CourseType.PACKAGE}
						onClick={() => setSelectedCourseType(CourseType.PACKAGE)}
					>
						<Text
							fontSize={SizeDetector.isDesktop ? 1.125 : 0.75}
							lineHeight={SizeDetector.isDesktop ? 2 : 1.667}
							fontWeight={SizeDetector.isDesktop ? 400 : 500}
							className="justify-content-center"
						>
							1:1 패키지
						</Text>
					</CourseTypeButton>
				)}
				{hasOneOnOneCourse && (
					<CourseTypeButton
						size="large"
						primary={selectedCourseType === CourseType.ONEONONE}
						secondary={selectedCourseType !== CourseType.ONEONONE}
						onClick={() => setSelectedCourseType(CourseType.ONEONONE)}
					>
						<Text
							fontSize={SizeDetector.isDesktop ? 1.125 : 0.75}
							lineHeight={SizeDetector.isDesktop ? 2 : 1.667}
							fontWeight={SizeDetector.isDesktop ? 400 : 500}
							className="justify-content-center"
						>
							1:1 클래스
						</Text>
					</CourseTypeButton>
				)}
			</div>
			<Row xs={2} md={3} className={SizeDetector.isDesktop ? `mt-40` : null}>
				{courses &&
					courses.data &&
					courses.data
						.filter(course => course?.type === selectedCourseType)
						.map((course, idx) => {
							let paddingName = idx % 2 === 0 ? "pr-6" : "pl-6";
							let coursePrice = course.price - course.discount_price;
							return (
								<Col key={idx} className={SizeDetector.isDesktop ? `mt-36` : `${paddingName} mt-28`}>
									<CourseCard
										thumbnail={`/storage/files/${course.thumbnail.filename}`}
										title={course.name}
										type={course.type}
										id={course.id}
										price={coursePrice}
									/>
								</Col>
							);
						})}
			</Row>
		</React.Fragment>
	);
};

const CourseTypeButton = styled(Button)`
	@media only screen and (max-width: 767.98px) {
		min-width: 5.688rem;
		height: 1.75rem;
		border-radius: 0.875rem;
	}
	@media only screen and (min-width: 768px) {
		width: 11.5rem;
		border-radius: 1.5rem;
	}
	& + & {
		@media only screen and (max-width: 767.98px) {
			margin-left: 0.75rem;
		}
		@media only screen and (min-width: 768px) {
			margin-left: 1.25rem;
		}
	}
`;

export default CourseGrid;
