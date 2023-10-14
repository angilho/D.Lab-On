import * as api from "@common/api";

export const checkUser = (email, password, callback) => {
	api.checkUser(email, password)
		.then(res => {
			if (res.status == 204) callback(true);
			else callback(false);
		})
		.catch(err => {
			console.error(err);
			callback(false);
		});
};

export const deleteUser = (userId, callback) => {
	api.deleteUser(userId)
		.then(res => {
			if (res.status == 204) callback(true);
			else callback(false);
		})
		.catch(err => {
			console.error(err);
			callback(false);
		});
};
