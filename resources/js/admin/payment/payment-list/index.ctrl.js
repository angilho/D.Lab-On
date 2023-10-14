import * as api from "@common/api";

export const getAllPayments = (query, callback) => {
	api.getAllPayments(query)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getPaginationLink = (link, callback) => {
	api.getPaginationLink(link)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};

export const updatePayment = (userId, paymentId, payment, callback) => {
	api.updatePayment(userId, paymentId, payment)
		.then(response => {
			callback();
		})
		.catch(err => {
			console.error(err);
			callback();
		});
};
