import * as api from "@common/api";

export const findUserIdByEmail = (email, callback, failedCallback) => {
	let body = new FormData();
	body.append("email", email);

	api.findUserIdByEmail(body)
		.then(res => {
			if (res.status === 204) {
				callback();
			}
		})
		.catch(err => {
			console.warn(err);
			failedCallback();
		});
};
