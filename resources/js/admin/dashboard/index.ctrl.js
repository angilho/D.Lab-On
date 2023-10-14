import * as api from "@common/api";

export const getCoursesEnrollments = callback => {
	api.getCoursesEnrollments()
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getDashboard = callback => {
	api.getDashboard()
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getCourseEnrollments = (courseId, callback) => {
	api.getCourseEnrollments(courseId)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};
