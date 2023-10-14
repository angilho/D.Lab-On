import * as api from "@common/api";

export const getPayments = (userId, query, callback) => {
	api.getPayments(userId, query)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};
