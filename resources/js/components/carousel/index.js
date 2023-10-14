import React, { useEffect, useState } from "react";

import useSizeDetector from "@hooks/useSizeDetector";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import "./index.css";
const Carousel = props => {
	const SizeDetector = useSizeDetector();
	const { children, show } = props;

	const [currentIndex, setCurrentIndex] = useState(0);
	const [length, setLength] = useState(children ? children.length : 0);

	const [touchPosition, setTouchPosition] = useState(null);

	// Set the length to match current children from props
	useEffect(() => {
		if (children && children.length > 0) setLength(children.length);
	}, [children]);

	const next = () => {
		if (currentIndex < length - show) {
			setCurrentIndex(prevState => prevState + 1);
		}
	};

	const prev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(prevState => prevState - 1);
		}
	};

	const handleTouchStart = e => {
		const touchDown = e.touches[0].clientX;
		setTouchPosition(touchDown);
	};

	const handleTouchMove = e => {
		const touchDown = touchPosition;

		if (touchDown === null) {
			return;
		}

		const currentTouch = e.touches[0].clientX;
		const diff = touchDown - currentTouch;

		if (diff > 5) {
			next();
		}

		if (diff < -5) {
			prev();
		}

		setTouchPosition(null);
	};

	return (
		<div className="carousel-container">
			<div className="container carousel-wrapper">
				<SizeDetector.Desktop>
					<ChevronLeftRoundedIcon className="left-arrow left" onClick={prev} />
				</SizeDetector.Desktop>

				<div className="carousel-content-wrapper" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
					<div
						className={`carousel-content show-${show}`}
						style={{
							transform: `translateX(-${currentIndex * (100 / show)}%) translateX(-${currentIndex *
								10}px)`
						}}
					>
						{children}
					</div>
				</div>
				<SizeDetector.Desktop>
					<ChevronRightRoundedIcon className="right-arrow right" onClick={next} />
				</SizeDetector.Desktop>
			</div>
		</div>
	);
};

export default Carousel;
