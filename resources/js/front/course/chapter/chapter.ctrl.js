import * as api from "@common/api";
import LearningStatus from "@constants/LearningStatus";
import CoursePostType from "@constants/CoursePostType";

export const getCourse = (courseId, callback) => {
	api.getCourse(courseId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getCourseLearnings = (userId, courseId, callback) => {
	api.getCourseLearnings(userId, courseId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const completeVodLearing = (userId, courseId, chapterId, vodId, status) => {
	api.createVodLearning(userId, courseId, chapterId, vodId, status)
		.then(response => {
			if (response.status !== 201) {
				alert("동영상 학습 기록에 실패하였습니다.");
			}
		})
		.catch(err => console.error(err));
};

export const submitQuiz = (userId, courseId, chapterId, quizId, answers, callback) => {
	api.submitQuizAnswer(userId, courseId, chapterId, quizId, answers)
		.then(response => {
			if (response.status !== 201) {
				alert("퀴즈 제출에 실패하였습니다.");
			}
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getQuizSubmissions = (userId, courseId, chapterId, quizId, callback) => {
	api.getQuizSubmissions(userId, courseId, chapterId, quizId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getCoursePosts = (courseId, keyword, callback) => {
	api.getCoursePosts(courseId, keyword)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getCoursePost = (courseId, postId, callback) => {
	api.getCoursePost(courseId, postId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const createPost = (userId, courseId, type, title, description, isPrivate, attachmentFile, status, callback) => {
	api.createCoursePost(courseId, {
		user_id: userId,
		type,
		title,
		description,
		attachment_file: attachmentFile,
		private: isPrivate,
		status,
		order: type === CoursePostType.NOTICE ? 1 : 0
	})
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const updatePost = (courseId, postId, type, title, description, isPrivate, attachmentFile, callback) => {
	api.updateCoursePost(courseId, postId, {
		type,
		title,
		description,
		attachment_file: attachmentFile,
		private: isPrivate
	})
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const deletePost = (courseId, postId, callback) => {
	api.deleteCoursePost(courseId, postId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const createComment = (userId, courseId, postId, comment, commentFile, callback) => {
	api.createCoursePostComment(courseId, postId, {
		user_id: userId,
		comment,
		attachment_file: commentFile
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

/**
 * 챕터에 속한 동영상 강의의 학습 완료 여부를 얻는다.
 * @param {int} chapterId
 * @param {int} vodId
 * @returns
 */
export const getVodCompleted = (courseLearnings, chapterId, vodId) => {
	// 과목의 학습 결과가 없으면 false
	if (courseLearnings.length === 0) return false;

	// 대상 챕터의 학습 결과를 얻는다.
	let chapterLearnings = courseLearnings.filter(chapterLearning => chapterLearning.id === chapterId);
	// 대상 챕터의 학습 결과가 없으면 false
	if (chapterLearnings.length === 0) return false;

	// 대상 챕터의 동영상 학습 결과가 없으면 false
	if (chapterLearnings[0].vod_learnings.length === 0) return false;
	// 대상 챕터의 대상 동영상의 학습 결과를 얻는다.
	let vodLearnings = chapterLearnings[0].vod_learnings.filter(vodLearning => vodLearning.vod_id === vodId);
	// 대상 챕터의 동영상 학습 결과가 없으면 false
	if (vodLearnings.length === 0) return false;

	return vodLearnings[0].status === LearningStatus.COMPLETE;
};

/**
 * 챕터에 속한 퀴즈 강의의 학습 완료 여부를 얻는다.
 * @param {int} chapterId
 * @param {int} vodId
 * @returns
 */
export const getQuizCompleted = (courseLearnings, chapterId, quizId) => {
	// 과목의 학습 결과가 없으면 false
	if (courseLearnings.length === 0) return false;

	// 대상 챕터의 학습 결과를 얻는다.
	let chapterLearnings = courseLearnings.filter(chapterLearning => chapterLearning.id === chapterId);
	// 대상 챕터의 학습 결과가 없으면 false
	if (chapterLearnings.length === 0) return false;

	// 대상 챕터의 퀴즈 학습 결과가 없으면 false
	if (chapterLearnings[0].quiz_learnings.length === 0) return false;
	// 대상 챕터의 대상 퀴즈의 학습 결과를 얻는다.
	let quizLearnings = chapterLearnings[0].quiz_learnings.filter(quizLearning => quizLearning.quiz_id === quizId);
	// 대상 챕터의 퀴즈 학습 결과가 없으면 false
	if (quizLearnings.length === 0) return false;

	return quizLearnings[0].status === LearningStatus.COMPLETE;
};

/**
 * 이전 챕터의 퀴즈가 완료되었는지 판단한다.
 * @param {array} courseLearnings
 * @param {int} chapterIdx
 */
export const checkBeforeChapterQuizCompleted = (courseLearnings, chapterIdx) => {
	let completed = true;
	courseLearnings.forEach((courseLearning, idx) => {
		if (idx < chapterIdx && courseLearning.need_quiz_pass) {
			if (courseLearning.quiz_learnings.length === 0) {
				completed = false;
			} else {
				if (courseLearning.quiz_learnings[0].status !== LearningStatus.COMPLETE) {
					completed = false;
				}
			}
		}
	});

	return completed;
};

/**
 * 전체 챕터 목록 페이지로 이동한다.
 */
export const navigateChapterList = (history, courseId) => {
	history.push({ pathname: `/courses/${courseId}/chapters` });
};

/**
 * 챕터 상세 페이지로 이동한다.
 */
export const navigateChapter = (history, courseId, chapterId) => {
	history.push({ pathname: `/courses/${courseId}/chapters/${chapterId}` });
};

/**
 * 교안 다운로드 페이지로 이동한다.
 */
export const navigateDownloadResource = (history, courseId, chapterId) => {
	history.push({ pathname: `/courses/${courseId}/chapters/${chapterId}/resources` });
};

/**
 * 동영상 강의 페이지로 이동한다.
 */
export const navigateVod = (history, courseId, chapterId, vodId) => {
	history.push({ pathname: `/courses/${courseId}/chapters/${chapterId}/vods/${vodId}` });
};

/**
 * 퀴즈 페이지로 이동한다.
 */
export const navigateQuiz = (history, courseId, chapterId) => {
	history.push({ pathname: `/courses/${courseId}/chapters/${chapterId}/quiz` });
};

/**
 * 과목의 퀴즈 통계 페이지로 이동한다.
 */
export const navigateQuizStatistics = (history, courseId) => {
	history.push({ pathname: `/courses/${courseId}/statistics/quiz` });
};

/**
 * 과목의 강좌 게시판 페이지로 이동한다.
 */
export const navigatePostList = (history, courseId) => {
	history.push({ pathname: `/courses/${courseId}/posts` });
};

/**
 * 운영자의 강좌 게시판 글 목록 페이지로 이동한다.
 */
export const navigateAdminPostList = (history, courseId) => {
	history.push({ pathname: `/admin/courses/${courseId}/posts` });
};

/**
 * 운영자의 VOD 과목 게시판 글 목록 페이지로 이동한다.
 */
export const navigateAdminVodCoursePostList = history => {
	history.push({ pathname: `/admin/vod_course_posts` });
};

/**
 * 운영자의 강좌 게시판 글 작성 페이지로 이동한다.
 */
export const navigateAdminPostCreate = (history, courseId) => {
	history.push({ pathname: `/admin/courses/${courseId}/posts/create` });
};

/**
 * 운영자의 강좌 게시판 글 수정 페이지로 이동한다.
 */
export const navigateAdminPostEdit = (history, courseId, postId) => {
	history.push({ pathname: `/admin/courses/${courseId}/posts/${postId}/edit` });
};

/**
 * 과목의 강좌 게시판 글 작성 페이지로 이동한다.
 */
export const navigatePostCreate = (history, courseId) => {
	history.push({ pathname: `/courses/${courseId}/posts/create` });
};

/**
 * 과목의 강좌 게시판 글 수정 페이지로 이동한다.
 */
export const navigatePostEdit = (history, courseId, postId) => {
	history.push({ pathname: `/courses/${courseId}/posts/${postId}/edit` });
};

/**
 * 과목의 강좌 게시판 글 확인 페이지로 이동한다.
 */
export const navigatePost = (history, courseId, postId) => {
	history.push({ pathname: `/courses/${courseId}/posts/${postId}` });
};

/**
 * 운영자의 강좌 게시판 글 확인 페이지로 이동한다.
 */
export const navigateAdminPost = (history, courseId, postId) => {
	history.push({ pathname: `/admin/courses/${courseId}/posts/${postId}` });
};
