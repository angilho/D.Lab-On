import * as api from "@common/api";
import RoleType from "@constants/RoleType";

export const getUsers = (filterRole, filterCampus, keyword, callback) => {
	let filter = {};
	if (filterRole == -1) {
		filter["filter[role]"] = `${RoleType.MEMBER},${RoleType.CHILD}`;
	} else {
		filter["filter[role]"] = filterRole;
	}
	if (filterCampus != -1) {
		filter["filter[campus]"] = filterCampus;
	}
	if (keyword) {
		filter["filter[search]"] = keyword;
	}
	api.getUsers(filter)
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

export const handleExport = (role, campus, keyword) => {
	window.location.href = `/admin/export/parents?role=${role}&campus=${campus}&keyword=${keyword}`;
};
