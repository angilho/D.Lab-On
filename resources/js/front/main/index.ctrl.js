import * as api from "@common/api";

export const getCourses = (courses, callback) => {
	let query = {
		"filter[id]": courses
	};
	api.getCourses(query)
		.then(res => {
			if (res.data) {
				callback(res.data);
			}
		})
		.catch(err => console.error(err));
};

export const getPopup = callback => {
	api.getPopup()
		.then(res => {
			if (res.data) {
				callback(res.data);
			}
		})
		.catch(err => {
			console.log(err);
		});
};
