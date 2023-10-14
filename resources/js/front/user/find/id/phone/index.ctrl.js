import * as api from "@common/api";

export const findUserIdByPhone = (name, phone, callback) => {
	let body = new FormData();
	body.append("name", name);
	body.append("phone", phone);

	api.findUserIdByPhone(body)
		.then(res => {
			if (res.data) {
				callback(res.data);
			}
		})
		.catch(err => {
			console.warn(err);
		});
};
