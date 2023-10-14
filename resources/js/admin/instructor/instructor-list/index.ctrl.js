import * as api from "@common/api";
import RoleType from "@constants/RoleType";

export const getInstructors = (keyword, callback) => {
	api.getUsers({
		"filter[role]": `${RoleType.INSTRUCTOR}`,
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
