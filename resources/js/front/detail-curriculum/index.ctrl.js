import * as api from "@common/api";

export const getDetailCurriculumCategories = callback => {
	api.getDetailCurriculumCategories()
		.then(res => {
			if (res.data) {
				callback(res.data);
			}
		})
		.catch(err => console.error(err));
};
