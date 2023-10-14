import * as api from "@common/api";

export const getUser = (userId, callback) => {
	api.getUser(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getChildren = (userId, callback) => {
	api.getChildren(userId)
		.then(response => {
			if (response.data.children) callback(response.data.children);
		})
		.catch(err => console.error(err));
};
