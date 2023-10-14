import * as api from "@common/api";

export const getOrganizationPosts = (organizationId, keyword, callback) => {
	api.getOrganizationPosts(organizationId, keyword)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getOrganizationPost = (organizationId, postId, callback) => {
	api.getOrganizationPost(organizationId, postId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const createOrganizationPost = (organizationId, post, callback) => {
	api.createOrganizationPost(organizationId, post)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const updateOrganizationPost = (organizationId, postId, post, callback) => {
	api.updateOrganizationPost(organizationId, postId, post)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const deleteOrganizationPost = (organizationId, postId, callback) => {
	api.deleteOrganizationPost(organizationId, postId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const createComment = (userId, organizationId, postId, comment, commentFile, callback) => {
	api.createOrganizationPostComment(organizationId, postId, {
		user_id: userId,
		comment,
		attachment_file: commentFile
	})
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const deleteComment = (organizationId, postId, commentId, callback) => {
	api.deleteOrganizationPostComment(organizationId, postId, commentId)
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

/**
 * B2B 게시판 목록 페이지로 이동한다.
 */
export const navigatePostList = (history, organizationId) => {
	history.push({ pathname: `/organizations/${organizationId}/posts` });
};

/**
 * 게시판 글 작성 페이지로 이동한다.
 */
export const navigatePostCreate = (history, organizationId) => {
	history.push({ pathname: `/organizations/${organizationId}/posts/create` });
};

/**
 * 게시판 글 편집 페이지로 이동한다.
 */
export const navigatePostEdit = (history, organizationId, postId) => {
	history.push({ pathname: `/organizations/${organizationId}/posts/${postId}/edit` });
};

/**
 * 글 확인 페이지로 이동한다.
 */
export const navigatePost = (history, organizationId, postId) => {
	history.push({ pathname: `/organizations/${organizationId}/posts/${postId}` });
};

/**
 * 운영자의 B2B 게시판 글 목록 페이지로 이동한다.
 */
export const navigateAdminPostList = (history, organizationId) => {
	history.push({ pathname: `/admin/organizations/${organizationId}/posts` });
};

/**
 * 운영자의 게시판 글 작성 페이지로 이동한다.
 */
export const navigateAdminPostCreate = (history, organizationId) => {
	history.push({ pathname: `/admin/organizations/${organizationId}/posts/create` });
};

/**
 * 운영자의 게시판 글 수정 페이지로 이동한다.
 */
export const navigateAdminPostEdit = (history, organizationId, postId) => {
	history.push({ pathname: `/admin/organizations/${organizationId}/posts/${postId}/edit` });
};

/**
 * 운영자의 글 확인 페이지로 이동한다.
 */
export const navigateAdminPost = (history, organizationId, postId) => {
	history.push({ pathname: `/admin/organizations/${organizationId}/posts/${postId}` });
};
