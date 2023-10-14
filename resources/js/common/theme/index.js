const calcRem = size => `${size / 16}rem`;

const fontSizes = {
	h1: calcRem(72),
	h1_m_headline: calcRem(18),
	mainHeader: calcRem(36),
	h2: calcRem(60),
	h3: calcRem(48),
	h4: calcRem(36),
	h5: calcRem(24),
	h5_mobile: calcRem(21),
	h6: calcRem(21),
	p1: calcRem(18),
	p2: calcRem(16),
	p3: calcRem(14),
	p4: calcRem(12),
	p5: calcRem(11)
};

const lineHeights = {
	h1: calcRem(126),
	h1_m_headline: calcRem(27),
	mainHeader: calcRem(87),
	h2: calcRem(105),
	h3: calcRem(84),
	h4: calcRem(63),
	h5: calcRem(42),
	h5_mobile: calcRem(34),
	h6: calcRem(37),
	p1: calcRem(32),
	p2: calcRem(28),
	p3: calcRem(25),
	p4: calcRem(21),
	p5: calcRem(19)
};

const colors = {
	primary: "#FF5100",
	secondary: "#FC6119",
	white: "#FFFFFF",
	black: "#000000",
	gray: "#DCDCDC",
	gray1: "#EAEBEC",
	gray2: "#A9ADAF",
	gray3: "#697073",
	gray4: "#263238"
};

const common = {
	flexCenter: `
		display: flex;
		justify-contents: center;
		align-items: center;
	`,
	flexCenterColumn: `
		display: flex;
		flex-direction: column;
		justify-contents: center;
		align-items: center;
	`
};

const theme = {
	fontSizes,
	lineHeights,
	common,
	colors
};

export default theme;
