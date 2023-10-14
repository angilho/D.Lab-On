import * as api from "@common/api";
import Cookies from "js-cookie";

export const getChildren = (parentId, callback) => {
	api.getChildren(parentId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const deleteChild = (parentId, childId, callback) => {
	api.deleteChild(parentId, childId)
		.then(response => {
			if (response.status == 204) {
				callback(true);
			}
		})
		.catch(err => console.error(err));
};

export const masqueradeLogin = childId => {
	api.csrfCookie().then(res => {
		api.masqueradeLogin(childId)
			.then(response => {
				if (response.status === 200) {
					Cookies.set("api_token", response.data.api_token, { expires: 365 });
					window.location.href = "/";
					return;
				}
			})
			.catch(err => {
				console.warn(err);
			});
	});
};
