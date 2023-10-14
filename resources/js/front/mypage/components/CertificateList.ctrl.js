import * as api from "@common/api";

export const getUserCertificateEnrollments = (userId, callback) => {
	api.getUserCertificateEnrollments(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.warn(err));
};
