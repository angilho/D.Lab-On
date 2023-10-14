import * as api from "@common/api";

export const getCourse = (courseId, callback) => {
	api.getCourse(courseId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getEnrollments = (query, callback) => {
	api.getEnrollments(query)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};
