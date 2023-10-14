import * as api from "@common/api";

export const getNotices = (keyword, callback) => {
	api.getNotices({
		keyword: keyword
	})
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getFaqs = (keyword, callback) => {
	api.getFaqs({
		keyword: keyword
	})
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getFaqCategories = callback => {
	api.getFaqCategories()
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
