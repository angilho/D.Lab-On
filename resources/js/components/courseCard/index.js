import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import Text from "@components/elements/Text";
import CourseType from "@constants/CourseType";

const CourseCard = ({ thumbnail, id, title, type, price }) => {
	const history = useHistory();

	const renderThumbnail = () => {
		switch (type) {
			case CourseType.ONEONONE:
				return (
					<div className="position-relative">
						<ThumbnailCourseCaption>
							<ThumbnailCourseCaptionText p2 white className="justify-content-center">
								1:1 클래스
							</ThumbnailCourseCaptionText>
						</ThumbnailCourseCaption>
						{price === 0 && renderFreeCourse()}
						<CourseCardThumbnail src={thumbnail} />
					</div>
				);
			case CourseType.PACKAGE:
				return (
					<div className="position-relative">
						<ThumbnailCourseCaption>
							<ThumbnailCourseCaptionText p2 white className="justify-content-center">
								1:1 패키지
							</ThumbnailCourseCaptionText>
						</ThumbnailCourseCaption>
						{price === 0 && renderFreeCourse()}
						<CourseCardThumbnail src={thumbnail} />
					</div>
				);
			case CourseType.REGULAR:
			case CourseType.VOD:
			default:
				return (
					<div className="position-relative">
						{price === 0 && renderFreeCourse()}
						<CourseCardThumbnail src={thumbnail} />
					</div>
				);
		}
	};

	const renderFreeCourse = () => {
		return (
			<ThumbnailFreeCourseCaption>
				<ThumbnailFreeCourseCaptionText p2 white className="justify-content-center">
					무료강의
				</ThumbnailFreeCourseCaptionText>
			</ThumbnailFreeCourseCaption>
		);
	};

	return (
		<CourseCardContainer
			onClick={() =>
				history.push({
					pathname: `/courses/${id}`
				})
			}
		>
			{renderThumbnail()}
			<Text h6 lineHeight={1.429} fontWeight={700}>
				{title || ""}
			</Text>
			{/* <div>
				{keyword.map((text, idx) => {
					return (
						<KeywordText key={idx} p5 primary fontWeight={400}>
							{text}
						</KeywordText>
					);
				})}
			</div> */}
		</CourseCardContainer>
	);
};

const CourseCardContainer = styled.div`
	display: flex;
	flex-direction: column;
	cursor: pointer;
	& + & {
		margin-left: 30px;
	}
`;

const CourseCardThumbnail = styled.img`
	width: 100%;
	height: 100%;

	@media only screen and (max-width: 767.98px) {
		margin-bottom: 0.5rem;
	}
	@media only screen and (min-width: 768px) {
		margin-bottom: 1rem;
	}
`;

const ThumbnailCourseCaption = styled.div`
	position: absolute;
	@media only screen and (max-width: 767.98px) {
		width: 52px;
		height: 20px;
	}
	@media only screen and (min-width: 768px) {
		width: 106px;
		height: 47px;
	}
	border-radius: 0 0 2.438rem 0;
	background-color: ${({ theme }) => theme.colors.primary};
`;

const ThumbnailCourseCaptionText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		position: absolute;
		font-size: 0.563rem;
		margin-left: 0.188rem;
	}
	@media only screen and (min-width: 768px) {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
	}
`;

const ThumbnailFreeCourseCaption = styled.div`
	position: absolute;
	right: 0;
	@media only screen and (max-width: 767.98px) {
		width: 52px;
		height: 20px;
	}
	@media only screen and (min-width: 768px) {
		width: 106px;
		height: 47px;
	}
	border-radius: 0 0 0 2.438rem;
	background-color: ${({ theme }) => theme.colors.primary};
`;

const ThumbnailFreeCourseCaptionText = styled(Text)`
	@media only screen and (max-width: 767.98px) {
		position: absolute;
		font-size: 0.563rem;
		margin-left: 0.188rem;
		top: -2px;
		right: 5px;
	}
	@media only screen and (min-width: 768px) {
		position: absolute;
		top: 0.5rem;
		right: 1rem;
	}
`;

const KeywordText = styled(Text)`
	display: inline !important;
	& + & {
		margin-left: 0.25rem;
	}
`;

export default CourseCard;
