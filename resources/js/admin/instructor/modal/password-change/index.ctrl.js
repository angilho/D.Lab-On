import * as api from "@common/api";

export const updateUser = (user, callback) => {
	api.updateUser(user.id, user)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};
