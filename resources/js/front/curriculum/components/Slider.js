import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import styled, { css } from "styled-components";

import useSizeDetector from "@hooks/useSizeDetector";

import PrevIcon from "@images/curriculum/prevIcon.png";
import NextIcon from "@images/curriculum/nextIcon.png";

import * as ctrl from "./Slider.ctrl";

const Slider = () => {
	const SizeDetector = useSizeDetector();
	const [carousels, setCarousels] = useState([]);
	const [selectedIdx, setSelectedIdx] = useState(0);

	useEffect(() => {
		ctrl.getCarousels(setCarousels);
	}, []);

	const handleSelect = (selectedIndex, e) => {
		setSelectedIdx(selectedIndex);
	};

	const prev = () => {
		if (selectedIdx == 0) {
			setSelectedIdx(carousels.length - 1);
		} else {
			setSelectedIdx(selectedIdx - 1);
		}
	};

	const next = () => {
		if (selectedIdx == carousels.length - 1) {
			setSelectedIdx(0);
		} else {
			setSelectedIdx(selectedIdx + 1);
		}
	};

	const renderDots = idx => {
		return (
			<DotContainer bottom={SizeDetector.isDesktop ? "1.875rem" : "1rem"}>
				{carousels.map((carousel, carouselIdx) => {
					return (
						<Dot
							key={carouselIdx}
							selected={idx === carouselIdx}
							onClick={() => {
								setSelectedIdx(carouselIdx);
							}}
						/>
					);
				})}
			</DotContainer>
		);
	};

	const renderCarouselItem = (idx, carousel) => {
		return (
			<CarouselItemContainer backgroundColor={carousel.background_color}>
				<div className="container">
					{SizeDetector.isDesktop && <PrevIconImg src={PrevIcon} onClick={() => prev()} />}
					<BannerImg
						src={`/storage/files/${
							SizeDetector.isDesktop ? carousel.desktop_image.filename : carousel.mobile_image.filename
						}`}
						onClick={() => {
							if (carousel.new_tab) {
								window.open(carousel.url);
							} else {
								window.open(carousel.url, "_self");
							}
						}}
					/>
					{SizeDetector.isDesktop && <NextIconImg src={NextIcon} onClick={() => next()} />}
					{renderDots(idx)}
				</div>
			</CarouselItemContainer>
		);
	};

	return (
		<Carousel
			activeIndex={selectedIdx}
			onSelect={handleSelect}
			indicators={false}
			controls={false}
			fade
			interval={3000}
		>
			{carousels.map((carousel, idx) => {
				return <Carousel.Item key={idx}>{renderCarouselItem(idx, carousel)}</Carousel.Item>;
			})}
		</Carousel>
	);
};

const CarouselItemContainer = styled.div`
	width: 100%;
	background-color: ${props => props.backgroundColor};
`;

const BannerImg = styled.img`
	width: 100%;
	height: auto;
	cursor: pointer;
`;

const DotContainer = styled.div`
	position: absolute;
	bottom: ${props => props.bottom};
	width: 9.25rem;
	text-align: center;
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
`;

const Dot = styled.div`
	display: inline-block;
	border: 0.063rem solid white;
	border-radius: 50%;
	cursor: pointer;
	width: 0.75rem;
	height: 0.75rem;
	${props =>
		props.selected
			? css`
					background-color: white;
			  `
			: css`
					bakcground-color: transparent;
			  `}

	& + & {
		margin-left: 1.25rem;
	}
`;

const PrevIconImg = styled.img`
	position: absolute;
	width: 2.25rem;
	height: 2.25rem;
	margin-left: -76px;
	top: 0;
	bottom: 0;
	margin-top: auto;
	margin-bottom: auto;
	cursor: pointer;
`;

const NextIconImg = styled.img`
	position: absolute;
	width: 2.25rem;
	height: 2.25rem;
	margin-left: 40px;
	top: 0;
	bottom: 0;
	margin-top: auto;
	margin-bottom: auto;
	cursor: pointer;
`;

export default Slider;
