import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { Row, Col } from "react-bootstrap";
import useSizeDetector from "@hooks/useSizeDetector";

import SearchIcon from "@mui/icons-material/Search";

import * as ctrl from "./index.ctrl";

const DetailCurriculum = () => {
	const history = useHistory();
	const SizeDetector = useSizeDetector();
	const [selectedCurriculumCategoryId, setSelectedCurriculumCategoryId] = useState(null);
	const [detailCurriculumCategories, setDetailCurriculumCategories] = useState([]);
	const [hoverCourseId, setHoverCourseId] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [searchResultKeyword, setSearchResultKeyword] = useState("");
	const [searchInputFocus, setSearchInputFocus] = useState(false);
	const [showCourseSearch, setShowCourseSearch] = useState(false);
	const [searchCourseList, setSearchCourseList] = useState(null);
	const noResultTextList = ["∠(･`_´･)", "(￣ㅁ￣；)", "(￣ー￣)", "(  ¯~¯)", "(・＿・;) /", "(;´・`)>"];
	const [noResultTextIndex, setNoResultTextIndex] = useState(0);

	useEffect(() => {
		ctrl.getDetailCurriculumCategories(result => {
			setDetailCurriculumCategories(result);
		});
	}, []);

	const onClickCurriculumMenu = curriculumCategoryId => {
		setSelectedCurriculumCategoryId(curriculumCategoryId);
		setShowCourseSearch(false);
		setSearchKeyword("");
		setSearchResultKeyword("");
		setSearchCourseList(null);
	};

	const onCourseMouseOver = courseId => {
		if (SizeDetector.isDesktop) {
			setHoverCourseId(courseId);
		}
	};

	const onCourseMouseOut = () => {
		if (SizeDetector.isDesktop) {
			setHoverCourseId(null);
		}
	};

	const onCourseClick = courseId => {
		if (SizeDetector.isDesktop) {
			history.push({
				pathname: `/courses/${courseId}`
			});
		} else {
			if (hoverCourseId === courseId) {
				history.push({
					pathname: `/courses/${courseId}`
				});
			} else {
				setHoverCourseId(courseId);
			}
		}
	};

	const onSearchCourse = keyword => {
		if (!keyword) return;

		let searchedCourse = [];
		detailCurriculumCategories.forEach(category => {
			category.curriculum_courses.forEach(categoryCourse => {
				let { name, short_description, curriculum_keyword } = categoryCourse.course;
				if (
					name.includes(keyword) ||
					(short_description && short_description.includes(keyword)) ||
					(curriculum_keyword && curriculum_keyword.includes(keyword))
				) {
					searchedCourse.push(categoryCourse.course);
				}
			});
		});
		setSearchResultKeyword(keyword);
		setSearchCourseList(
			searchedCourse.filter((course, index) => searchedCourse.findIndex(t => t.id === course.id) === index)
		);
		setShowCourseSearch(true);
		if (searchedCourse.length === 0) {
			setNoResultTextIndex(noResultTextIndex + 1);
		}
	};

	const renderCurriculumKeyword = curriculumKeyword => {
		return (
			<CourseKeywordContainer>
				{curriculumKeyword.split(",").map((keyword, idx) => {
					return <CourseKeyword key={idx}>{keyword}</CourseKeyword>;
				})}
			</CourseKeywordContainer>
		);
	};

	const renderCurriculumTargetKeyword = curriculumTargetKeyword => {
		return (
			<CourseTargetKeywordContainer>
				{curriculumTargetKeyword.split(",").map((keyword, idx) => {
					return <CourseTargetKeyword key={idx}>{keyword}</CourseTargetKeyword>;
				})}
			</CourseTargetKeywordContainer>
		);
	};

	const renderDetailCurriculum = detailCurriculumCategory => {
		return (
			<React.Fragment>
				<CurriculumTitle>{detailCurriculumCategory.title}</CurriculumTitle>
				<CurriculumDescription>{detailCurriculumCategory.description}</CurriculumDescription>
				<CurriculumTagContainer>
					{detailCurriculumCategory.tag &&
						detailCurriculumCategory.tag.split(",").map((tag, idx) => {
							return (
								<CurriculumTag
									key={idx}
									onClick={() => {
										setSearchKeyword(tag);
										onSearchCourse(tag);
									}}
								>
									{tag}
								</CurriculumTag>
							);
						})}
				</CurriculumTagContainer>
				<CurriculumCourseCardContainer md={3} xs={2} noGutters>
					{detailCurriculumCategory.curriculum_courses.map((curriculumCourse, idx) => {
						return (
							<CurriculumCourseCard
								key={idx}
								onMouseOver={() => onCourseMouseOver(curriculumCourse.course.id)}
								onMouseOut={() => onCourseMouseOut()}
								onClick={() => onCourseClick(curriculumCourse.course.id)}
							>
								<CourseCardThumbnail
									src={`/storage/files/${curriculumCourse.course.thumbnail.filename}`}
								/>
								{curriculumCourse.course.id === hoverCourseId && (
									<CourseInfo>
										<CourseTitle>{curriculumCourse.course.name}</CourseTitle>
										{curriculumCourse.course.curriculum_keyword &&
											renderCurriculumKeyword(curriculumCourse.course.curriculum_keyword)}
										<SizeDetector.Desktop>
											<CourseShortDescription>
												{curriculumCourse.course.short_description ?? ""}
											</CourseShortDescription>
										</SizeDetector.Desktop>
										{curriculumCourse.course.curriculum_target_keyword &&
											renderCurriculumTargetKeyword(
												curriculumCourse.course.curriculum_target_keyword
											)}
									</CourseInfo>
								)}
							</CurriculumCourseCard>
						);
					})}
				</CurriculumCourseCardContainer>
			</React.Fragment>
		);
	};

	const renderCourseSearch = () => {
		if (searchCourseList === null) return;

		if (searchCourseList.length === 0) {
			return renderNoCourse();
		}
		return (
			<>
				<SearchResultTitle>{`"${searchResultKeyword}"에 관한 검색 내용입니다.`}</SearchResultTitle>
				<CurriculumCourseCardContainer md={3} noGutters>
					{searchCourseList.map((course, idx) => {
						return (
							<CurriculumCourseCard
								key={idx}
								onMouseOver={() => onCourseMouseOver(course.id)}
								onMouseOut={() => onCourseMouseOut()}
								onClick={() => onCourseClick(course.id)}
							>
								<CourseCardThumbnail src={`/storage/files/${course.thumbnail.filename}`} />
								{course.id === hoverCourseId && (
									<CourseInfo>
										<CourseTitle>{course.name}</CourseTitle>
										{course.curriculum_keyword &&
											renderCurriculumKeyword(course.curriculum_keyword)}
										<SizeDetector.Desktop>
											<CourseShortDescription>
												{course.short_description ?? ""}
											</CourseShortDescription>
										</SizeDetector.Desktop>
										{course.curriculum_target_keyword &&
											renderCurriculumTargetKeyword(course.curriculum_target_keyword)}
									</CourseInfo>
								)}
							</CurriculumCourseCard>
						);
					})}
				</CurriculumCourseCardContainer>
			</>
		);
	};

	const renderNoCourse = () => {
		return (
			<>
				<SearchResultTitle>{`"${searchResultKeyword}"에 관한 검색 내용이 없습니다.`}</SearchResultTitle>
				<NoCourse>{noResultTextList[noResultTextIndex % noResultTextList.length]}</NoCourse>
			</>
		);
	};

	const renderDetailCurriculumCategories = () => {
		return (
			<>
				{detailCurriculumCategories
					.filter(
						detailCurriculumCategory =>
							detailCurriculumCategory.id === selectedCurriculumCategoryId ||
							selectedCurriculumCategoryId === null
					)
					.map((detailCurriculumCategory, index) => {
						return (
							<CurriculumCourseContainer key={index}>
								{renderDetailCurriculum(detailCurriculumCategory)}
							</CurriculumCourseContainer>
						);
					})}
			</>
		);
	};

	return (
		<React.Fragment>
			<CurriculumContainer className="container">
				<CurriculumRow noGutters>
					<CurriculumMenuScroll>
						<CurriculumMenuList>
							<CurriculumMenuItem
								selected={selectedCurriculumCategoryId === null}
								onClick={() => onClickCurriculumMenu(null)}
							>
								전체 강좌
							</CurriculumMenuItem>
							{detailCurriculumCategories.map((detailCurriculumCategory, index) => {
								return (
									<CurriculumMenuItem
										key={index}
										selected={selectedCurriculumCategoryId === detailCurriculumCategory.id}
										onClick={() => onClickCurriculumMenu(detailCurriculumCategory.id)}
									>
										{detailCurriculumCategory.title}
									</CurriculumMenuItem>
								);
							})}
						</CurriculumMenuList>
					</CurriculumMenuScroll>
					<CourseList>
						<SearchContainer>
							<SearchInput
								value={searchKeyword}
								onChange={event => setSearchKeyword(event.currentTarget.value)}
								type="text"
								placeholder="검색으로 클래스 찾기"
								onFocus={() => setSearchInputFocus(true)}
								onBlur={() => setSearchInputFocus(false)}
								onKeyDown={event => {
									if (event.key == "Enter") {
										onSearchCourse(searchKeyword);
									}
								}}
							/>
							<StyledSearchIcon
								onClick={() => onSearchCourse(searchKeyword)}
								inputfocus={searchInputFocus.toString()}
							/>
						</SearchContainer>
						{showCourseSearch ? renderCourseSearch() : renderDetailCurriculumCategories()}
					</CourseList>
				</CurriculumRow>
			</CurriculumContainer>
		</React.Fragment>
	);
};

const CurriculumContainer = styled.div`
	min-width: 1200px;
	margin-top: 60px;

	@media (max-width: 767.98px) {
		min-width: 320px;
		margin-top: 0;
	}
`;

const CurriculumRow = styled(Row)`
	@media (max-width: 767.98px) {
		flex-direction: column;
	}
`;

const CurriculumMenuScroll = styled.div`
	@media (max-width: 767.98px) {
		width: 100%;
		overflow-x: scroll;
		-ms-overflow-style: none;
		scrollbar-width: none;
		::-webkit-scrollbar {
			display: none;
		}
	}
`;

const CurriculumMenuList = styled.div`
	width: 250px;

	@media (max-width: 767.98px) {
		display: flex;
		align-items: center;

		width: max-content;
		height: 52px;
	}
`;

const CurriculumMenuItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;

	padding-left: 28px;
	width: 250px;
	height: 48px;
	& + & {
		margin-top: 14px;
	}

	font-family: Noto Sans KR;
	font-size: 18px;
	font-weight: 400;
	line-height: 28.8px;

	cursor: pointer;

	${props =>
		props.selected &&
		css`
			font-weight: 700;
			color: #ff5100;
			background-color: #fffbef;
			border-radius: 28px;
		`}

	@media (max-width: 767.98px) {
		justify-content: center;
		padding: 0 12px;
		width: fit-content;
		height: 36px;

		& + & {
			margin-top: 0;
			margin-left: 12px;
		}

		font-size: 14px;
		line-height: 19.6px;
	}
`;

const CourseList = styled.div`
	width: 888px;
	margin-left: 30px;

	@media (max-width: 767.98px) {
		width: 100%;
		margin-left: 0;
	}
`;

const SearchContainer = styled.div`
	@media (max-width: 767.98px) {
		padding: 0 17px;
	}
`;

const SearchInput = styled.input`
	width: 378px;
	height: 48px;
	color: #000000;
	font-family: Noto Sans KR;
	font-size: 21px;
	font-weight: 700;
	line-height: 33.6px;

	border-style: none;
	border-bottom: 1px solid #cccccc;

	&::placeholder {
		color: #cccccc;
	}

	&:focus {
		outline: none !important;
		border-bottom: 1px solid #ff5100;
	}

	@media (max-width: 767.98px) {
		width: 100%;
		margin-top: 16px;
		font-size: 16px;
		line-height: 22.4px;
	}
`;

const StyledSearchIcon = styled(SearchIcon)`
	margin-left: -24px;
	color: #cccccc;
	cursor: pointer;

	${props =>
		props.inputfocus === "true" &&
		css`
			color: #ff5100;
		`}
`;

const CurriculumCourseContainer = styled.div`
	margin-top: 60px;
	& + & {
		margin-top: 100px;
	}

	@media (max-width: 767.98px) {
		margin-top: 64px;
		& + & {
			margin-top: 64px;
		}
	}
`;

const CurriculumTitle = styled.div`
	font-family: Noto Sans KR;
	font-size: 24px;
	font-weight: 700;
	line-height: 38.4px;

	@media (max-width: 767.98px) {
		font-size: 20px;
		line-height: 32px;
	}
`;

const CurriculumDescription = styled.div`
	margin-top: 16px;
	font-family: Noto Sans KR;
	font-size: 17px;
	font-weight: 400;
	line-height: 27.2px;
	white-space: pre-line;

	@media (max-width: 767.98px) {
		font-size: 14px;
		line-height: 22.4px;
	}
`;

const CurriculumTagContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-top: 8px;

	@media (max-width: 767.98px) {
		margin-top: 12px;
	}
`;

const CurriculumTag = styled.div`
	color: #ff5100;
	font-family: Noto Sans KR;
	font-size: 14px;
	font-weight: 400;
	line-height: 22.4px;
	cursor: pointer;

	& + & {
		margin-left: 10px;
	}

	@media (max-width: 767.98px) {
		font-size: 12px;
		line-height: 16.8px;

		& + & {
			margin-left: 0px;
		}
		margin-right: 8px;
		margin-top: 4px;
	}
`;

const CurriculumCourseCardContainer = styled(Row)`
	margin-top: 8px;

	@media (max-width: 767.98px) {
		margin-top: 12px;
	}
`;

const CurriculumCourseCard = styled.div`
	position: relative;
	width: 280px;
	height: 210px;
	max-width: 280px;
	max-height: 210px;
	border-radius: 4px;
	margin-top: 32px;
	cursor: pointer;

	&:nth-child(3n + 2),
	&:nth-child(3n) {
		margin-left: 24px;
	}

	@media (max-width: 767.98px) {
		max-width: calc(50% - 8px);
		height: auto;
		margin-top: 20px;

		&:nth-child(3n + 2),
		&:nth-child(3n) {
			margin-left: 0;
		}
		&:nth-child(2n) {
			margin-left: 16px;
		}
	}
`;

const CourseCardThumbnail = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 4px;
`;

const CourseInfo = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	width: 280px;
	height: 210px;
	border-radius: 4px;
	padding: 24px 20px 20px 20px;
	background-color: rgba(0, 0, 0, 0.8);
	pointer-events: none;

	@media (max-width: 767.98px) {
		width: 100%;
		height: 100%;
		padding: 10px;
	}
`;

const CourseTitle = styled.div`
	width: 240px;
	max-height: 50px;
	font-family: Noto Sans KR;
	font-size: 18px;
	font-weight: 700;
	line-height: 25.2px;
	color: #ffffff;

	@media (max-width: 767.98px) {
		width: 100%;
		max-height: 34px;
		font-size: 13px;
		line-height: 16.9px;
		overflow: hidden;
	}
`;

const CourseKeywordContainer = styled.div`
	display: flex;
	margin-top: 12px;

	@media (max-width: 767.98px) {
		margin-top: 8px;
	}
`;

const CourseKeyword = styled.div`
	display: flex;
	height: 20px;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	padding: 0 8px;

	font-family: Noto Sans KR;
	font-size: 10px;
	font-weight: 700;
	line-height: 14px;
	color: #ffffff;

	border: 1px solid #ffffff;

	& + & {
		margin-left: 8px;
	}

	@media (max-width: 767.98px) {
		height: 18px;
		font-size: 10px;
		line-height: 14px;
		padding: 0 4px;
	}
`;

const CourseShortDescription = styled.div`
	width: 240px;
	margin-top: 10px;

	font-family: Noto Sans KR;
	font-size: 14px;
	font-weight: 400;
	line-height: 19.6px;
	color: #bbbbbb;
	white-space: pre-line;
`;

const CourseTargetKeywordContainer = styled.div`
	display: flex;
	position: absolute;
	right: 20px;
	bottom: 20px;

	@media (max-width: 767.98px) {
		left: 10px;
		bottom: 10px;
	}
`;

const CourseTargetKeyword = styled.div`
	font-family: Noto Sans KR;
	font-size: 12px;
	font-weight: 400;
	line-height: 16.8px;
	color: #ff5100;

	& + & {
		margin-left: 8px;
	}

	@media (max-width: 767.98px) {
		font-size: 11px;
		line-height: 15.4px;
	}
`;

const SearchResultTitle = styled.div`
	margin-top: 60px;
	font-family: Noto Sans KR;
	font-size: 24px;
	font-weight: 700;
	line-height: 38.4px;
	color: #000000;

	@media (max-width: 767.98px) {
		font-size: 20px;
		line-height: 32px;
	}
`;

const NoCourse = styled.div`
	margin-top: 40px;
	font-family: Noto Sans KR;
	font-size: 80px;
	font-weight: 700;
	line-height: 120px;
	color: #dddddd;

	@media (max-width: 767.98px) {
		font-size: 56px;
		line-height: 84px;
	}
`;

export default DetailCurriculum;
