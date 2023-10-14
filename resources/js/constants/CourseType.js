const CourseType = {
	REGULAR: "regular",
	ONEONONE: "oneonone",
	PACKAGE: "package",
	VOD: "vod",

	convertToString(value) {
		switch (value) {
			case this.REGULAR:
				return "라이브클래스";
			case this.ONEONONE:
				return "1:1 클래스";
			case this.PACKAGE:
				return "1:1 패키지";
			case this.VOD:
				return "VOD 클래스";
		}
		return "";
	}
};

export default CourseType;
