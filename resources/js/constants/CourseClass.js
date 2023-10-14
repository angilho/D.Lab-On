const CourseClass = {
	SUPPORT: "support_class",
	B2B: "b2b_class",
	DEFAULT: "default",

	convertToString(value) {
		switch (value) {
			case this.SUPPORT:
				return "보충수업";
			case this.B2B:
				return "B2B수업";
		}
		return "";
	}
};

export default CourseClass;
