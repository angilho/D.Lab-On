import * as api from "@common/api";
import CourseType from "@constants/CourseType";
import CourseTargetGroup from "@constants/CourseTargetGroup";

export const getDefaultCourse = () => ({
	name: "",
	type: CourseType.REGULAR,
	thumbnail: null,
	closed: false,

	student_target: "",
	elice_course_id: "",
	enable_elice_course: false,
	price: 0,
	discount_price: 0,
	discount_text: "",

	duration_hour: 0,
	duration_minute: 0,
	duration_week: 0,

	dlab_course_code: "",

	curriculum_keyword: "",
	curriculum_target_keyword: "",
	short_description: "",

	support_class: false,
	b2b_class: false
});

export const getDefaultSection = () => ({
	target_group: CourseTargetGroup.ELEMENTRY_SCHOOL,
	target_grade: "1",
	max_student: 0,

	start_at: null,
	end_at: null,
	recruit_start_at: null,
	recruit_end_at: null,

	cycle_week: 1,

	start_hour: 0,
	start_minute: 0,
	end_hour: 0,
	end_minute: 0,
	duration_day: [],

	zoom_url: "",
	zoom_password: "",
	zoom_id: ""
});

export const getCourse = (courseId, callback) => {
	api.getCourse(courseId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleCreate = (course, sections, callback) => {
	if (!validateCourse(course, sections)) return;

	api.createCourse(course, sections)
		.then(response => {
			if (response.status !== 201) {
				alert("과목 추가에 실패하였습니다.");
				return;
			}

			alert("과목을 추가하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("과목 추가에 실패하였습니다.");
		});
};

export const handleUpdate = (courseId, course, sections, callback) => {
	if (!validateCourse(course, sections, true)) return;

	api.updateCourse(courseId, course, sections)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("과목 갱신에 실패하였습니다.");
				return;
			}

			alert("과목 정보를 갱신하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("과목 갱신에 실패하였습니다.");
		});
};

export const handleDelete = (courseId, callback) => {
	if (confirm("정말 삭제하시겠습니까?")) {
		api.deleteCourse(courseId)
			.then(response => {
				if (response.status !== 204) {
					alert("과목 삭제에 실패하였습니다.");
					return;
				}

				alert("과목을 삭제하였습니다.");
				callback();
			})
			.catch(err => {
				console.error(err);
				alert("과목 삭제에 실패하였습니다.");
			});
	}
};

export const handleCopy = (courseId, callback) => {
	if (confirm("정말 과목을 복제하시겠습니까?")) {
		api.copyCourse(courseId)
			.then(response => {
				if (response.status !== 201) {
					alert("과목 복제에 실패하였습니다.");
					return;
				}

				alert("과목을 복제하였습니다.");
				callback();
			})
			.catch(err => {
				console.error(err);
				alert("과목 복제에 실패하였습니다.");
			});
	}
};

export const validateCourse = (course, sections, edit) => {
	if (course.type !== CourseType.VOD && (!sections || sections.length == 0)) {
		alert("최소 한개 이상의 수업이 생성되어야 합니다.");
		return false;
	}

	if (!course.name) {
		alert("과목 이름이 없습니다.");
		return false;
	}

	if (!course.thumbnail) {
		alert("과목의 썸네일 정보가 없습니다.");
		return false;
	}

	if (typeof course.closed === "undefined") {
		alert("썸네일에 수강신청 공개 & 비공개 표시가 없습니다.");
		return false;
	}

	if (!course.student_target) {
		alert("대상이 없습니다.");
		return false;
	}

	if (!course.duration_hour) {
		alert("수업 진행 시간이 없습니다.");
		return false;
	}

	if (!course.duration_week) {
		alert("수업 주차가 없습니다.");
		return false;
	}

	if (!course.dlab_course_code) {
		alert("디랩 과목 코드가 없습니다.");
		return false;
	}

	return true;
};

export const validateAddCourseSection = (section, courseType) => {
	if (typeof section.target_group === "undefined") {
		alert("대상의 학부가 없습니다.");
		return false;
	}

	if (!section.max_student) {
		alert("수업 정원 정보가 없습니다.");
		return false;
	}

	if (!section.start_at || !section.end_at) {
		alert("수업 시작 / 종료일이 없습니다.");
		return false;
	}

	if (!section.recruit_start_at || !section.recruit_end_at) {
		alert("수업 모집 시작 / 종료일이 없습니다.");
		return false;
	}

	if (courseType === CourseType.REGULAR) {
		if (!section.cycle_week) {
			alert("수업 주차가 없습니다.");
			return false;
		}

		if (section.duration_day.length == 0) {
			alert("선택한 요일이 없습니다");
			return false;
		}

		if (section.duration_day.length != section.cycle_week) {
			alert("수업 주기에 맞게 요일을 다시 선택하세요.");
			return false;
		}
	}

	if (!section.zoom_url) {
		alert("Zoom의 URL 정보가 없습니다.");
		return false;
	}

	return true;
};
