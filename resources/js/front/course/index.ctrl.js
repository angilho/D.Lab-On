import * as api from "@common/api";

export const getCourse = (courseId, callback) => {
	api.getCourse(courseId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getUser = (userId, callback) => {
	api.getUser(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getCourseIntroDetail = (courseId, isDesktop, callback) => {
	api.getCourseIntroDetail(courseId, isDesktop)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getCourseDetail = (courseId, isDesktop, callback) => {
	api.getCourseDetail(courseId, isDesktop)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getChildren = (userId, callback) => {
	api.getChildren(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const createCart = (userId, courseId, courseSectionId, callback) => {
	let form = new FormData();
	form.append("course_id", courseId);
	form.append("course_section_id", courseSectionId);

	api.createCart(userId, form)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const existsCart = (userId, courseId, courseSectionId, callback) => {
	let form = new FormData();
	form.append("course_id", courseId);
	form.append("course_section_id", courseSectionId);

	api.createCart(userId, form)
		.then(response => {
			callback(response.data);
		})
		.catch(err => {
			//만들기를 시도했는데 이미 존재할 경우 추가할 필요 없다.
			if (err.data.errors.exists) callback(true);
		});
};
