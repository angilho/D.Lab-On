import * as api from "@common/api";

export const getUserEnrollments = (userId, query, callback) => {
	api.getUserEnrollments(userId, query)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.warn(err));
};
