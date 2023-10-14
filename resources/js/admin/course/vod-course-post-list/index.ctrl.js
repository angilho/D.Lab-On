import * as api from "@common/api";

export const getVodCoursePosts = (keyword, callback) => {
	api.getVodCoursePosts(keyword)
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

export const navigateAdminVodCoursePost = (history, postId) => {
	history.push({ pathname: `/admin/vod_course_posts/${postId}` });
};
