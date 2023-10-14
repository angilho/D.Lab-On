import * as api from "@common/api";

export const getSmsNotifications = (keyword, callback) => {
	api.getSmsNotifications({
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
