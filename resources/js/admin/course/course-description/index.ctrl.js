import * as api from "@common/api";

export const getCourse = (courseId, callback) => {
	api.getCourse(courseId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const createCourseDescription = (courseId, description, callback) => {
	api.createCourseDescription(courseId, description)
		.then(response => {
			alert("과목상세 정보를 저장하였습니다.");
			callback(response.data);
		})
		.catch(err => {
			alert("과목상세 정보 저장에 실패하였습니다.");
			console.error(err);
		});
};
