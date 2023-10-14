import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";
import Slider from "./components/Slider";
import CourseGrid from "./components/CourseGrid";
import Separator from "@components/elements/Separator";
import CurriculumFrontTopMenu from "@components/curriculumFrontTopMenu";
import Text from "@components/elements/Text";
import useSizeDetector from "@hooks/useSizeDetector";

import * as ctrl from "./index.ctrl";

const Curriculum = props => {
	const SizeDetector = useSizeDetector();
	const sectionMarginTop = SizeDetector.isDesktop ? "mt-20" : "mt-10";

	const [topMenu, setTopMenu] = useState([]);
	const [topMenuIndex, setTopMenuIndex] = useState(0);
	const [curriculumCategories, setCurriculumCategories] = useState([]);

	useEffect(() => {
		ctrl.getCurriculumCategories(curriculumCategories => {
			setTopMenu(
				curriculumCategories.map(curriculumCategory => {
					return { title: curriculumCategory.title, link: `#curriculum-${curriculumCategory.id}` };
				})
			);
			setCurriculumCategories(curriculumCategories);
		});
	}, []);

	useEffect(() => {
		if (topMenu.length == 0) return;

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [topMenu]);

	const handleScroll = e => {
		let firstTopMenuIndex = null;
		topMenu.forEach((menu, idx) => {
			const el = document.getElementById(menu.link.substring(1));
			if (el && isScrolledIntoView(el) && firstTopMenuIndex == null) {
				firstTopMenuIndex = idx;
			}
		});
		if (firstTopMenuIndex != null) {
			setTopMenuIndex(firstTopMenuIndex);
		}
	};

	/**
	 * 스크롤 했을 때 뷰에서 보이는지 확인함.
	 * https://stackoverflow.com/questions/487073/how-to-check-if-element-is-visible-after-scrolling
	 * @param {*} el javscript element
	 * @returns
	 */
	const isScrolledIntoView = el => {
		var rect = el.getBoundingClientRect();
		var elemTop = rect.top;
		var elemBottom = rect.bottom;

		// Only completely visible elements return true:
		var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
		// Partially visible elements return true:
		//isVisible = elemTop < window.innerHeight && elemBottom >= 0;
		return isVisible;
	};

	const renderTitle = (eng, kor) => {
		return (
			<React.Fragment>
				<SizeDetector.Desktop>
					<Text p1 font="BM">
						{eng}
					</Text>
					<MarginTopText h4>{kor}</MarginTopText>
				</SizeDetector.Desktop>
				<SizeDetector.Mobile>
					<Text h4 font="BM" className="d-inline">
						{kor}
					</Text>
					<MarginTopText p1 className="d-inline ml-8">
						{eng}
					</MarginTopText>
				</SizeDetector.Mobile>
			</React.Fragment>
		);
	};

	const renderCurriculumCategory = curriculumCategory => {
		return (
			<React.Fragment>
				<ScrollRow className="mt-100" id={`curriculum-${curriculumCategory.id}`}>
					<Col>
						{renderTitle(curriculumCategory.subtitle, curriculumCategory.title)}
						<CurriculumDescription p2 className={sectionMarginTop}>
							{curriculumCategory.description}
						</CurriculumDescription>
					</Col>
				</ScrollRow>
				<Row className="mt-60">
					<Col>
						<CourseGrid courseIds={curriculumCategory.curriculum_courses.map(course => course.course_id)} />
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<CurriculumFrontTopMenu sticky menu={topMenu} index={topMenuIndex} scrollBlock="start" />
			<Slider />
			<div className="container">
				{curriculumCategories.map((curriculumCategory, index) => {
					return (
						<React.Fragment key={index}>
							{renderCurriculumCategory(curriculumCategory)}
							{index !== curriculumCategories.length - 1 && <Separator />}
						</React.Fragment>
					);
				})}
			</div>
		</React.Fragment>
	);
};

const MarginTopText = styled(Text)`
	@media only screen and (min-width: 768px) {
		margin-top: 9px;
	}
`;

const ScrollRow = styled(Row)`
	@media only screen and (max-width: 767.98px) {
		scroll-margin-top: 7.2rem;
	}
	@media only screen and (min-width: 768px) {
		scroll-margin-top: 11.9rem;
	}
`;

const CurriculumDescription = styled(Text)`
	white-space: pre-line;
`;

export default Curriculum;
