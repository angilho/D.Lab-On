import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const useSizeDetector = () => {
	const isDesktop = useMediaQuery({ minWidth: 768 });
	const isMobile = useMediaQuery({ maxWidth: 767.98 });

	const Desktop = ({ children }) => {
		return isDesktop ? children : null;
	};
	const Mobile = ({ children }) => {
		return isMobile ? children : null;
	};

	return {
		isDesktop,
		Desktop,
		Mobile
	};
};

export default useSizeDetector;
