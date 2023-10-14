import * as api from "@common/api";

export const getMenuPermissions = (keyword, callback) => {
	api.getMenuPermissions({
		keyword: keyword
	})
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};
