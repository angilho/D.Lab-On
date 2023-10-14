import * as api from "@common/api";

export const updateUserPassword = (password, newPassword, newPasswordConfirm, callback) => {
	let body = new FormData();
	body.append("password", password);
	body.append("new_password", newPassword);
	body.append("new_password_confirm", newPasswordConfirm);

	api.updateUserPassword(body)
		.then(res => {
			if (res.data) {
				callback(res.data);
			}
		})
		.catch(err => {
			console.warn(err);
		});
};
