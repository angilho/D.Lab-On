const CourseTargetGroup = {
	ELEMENTRY_SCHOOL: 0,
	MIDDLE_SCHOOL: 1,
	HIGH_SCHOOL: 2,
	GENERAL: 3,
	MIDDLE_AND_HIGH_SCHOOL: 4,
	convertToString(value) {
		switch (parseInt(value)) {
			case this.ELEMENTRY_SCHOOL:
				return "초등부";
			case this.MIDDLE_SCHOOL:
				return "중등부";
			case this.HIGH_SCHOOL:
				return "고등부";
			case this.GENERAL:
				return "일반";
			case this.MIDDLE_AND_HIGH_SCHOOL:
				return "중고등부";
		}
	}
};

export default CourseTargetGroup;
