import * as api from "@common/api";

export const getPayment = (userId, paymentId, callback) => {
	api.getPayment(userId, paymentId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => {
			console.error(err);
			callback(false);
		});
};
