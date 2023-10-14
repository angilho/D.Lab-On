import * as api from "@common/api";

export const getEnrollments = (userId, query, callback) => {
	api.getUserEnrollments(userId, query)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const openEliceCourse = eliceId => {
	api.getEliceCourseSsoUrl(eliceId)
		.then(response => {
			window.open(response.data);
		})
		.catch(err => console.error(err));
};
