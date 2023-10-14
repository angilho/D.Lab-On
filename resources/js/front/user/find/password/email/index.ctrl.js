import * as api from "@common/api";

export const passwordForgot = (email, callback, failedCallback) => {
	api.passwordForgot(email)
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
