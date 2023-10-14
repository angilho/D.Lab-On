import * as api from "@common/api";
import RoleType from "@constants/RoleType";

export const getUsers = (keyword, callback) => {
	api.getUsers({
		"filter[role]": `${RoleType.ADMIN}`,
		"filter[search]": keyword
	})
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

export const handleSearchUser = keyword => {};

export const handleExport = keyword => {
	window.location.href = `/admin/export/users?keyword=${keyword}`;
};
