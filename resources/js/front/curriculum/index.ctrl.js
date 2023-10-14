import * as api from "@common/api";

export const getCurriculumCategories = callback => {
	api.getCurriculumCategories()
		.then(res => {
			if (res.data) {
				callback(res.data);
			}
		})
		.catch(err => console.error(err));
};
