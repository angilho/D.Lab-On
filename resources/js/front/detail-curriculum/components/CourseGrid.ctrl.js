import * as api from "@common/api";

export const getCourses = (courses, callback) => {
	// 구할 과목이 없는 경우에는 API 요청하지 않고 바로 callback을 부른다.
	if (courses.length == 0) {
		callback([]);
		return;
	}

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
