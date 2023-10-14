import * as api from "@common/api";

export const getVodCoursePost = (postId, callback) => {
	api.getVodCoursePost(postId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};
