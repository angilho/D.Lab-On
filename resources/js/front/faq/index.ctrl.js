import * as api from "@common/api";

export const getNotices = callback => {
	api.getNotices("")
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getNotice = (noticeId, callback) => {
	api.getNotice(noticeId)
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
