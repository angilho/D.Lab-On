import * as api from "@common/api";

export const getDefaultChapter = () => ({
	title: "",
	description: "",
	vods: [getDefaultVod()],
	resources: [getDefaultResource()],
	quiz: getDefaultQuiz(),
	need_quiz_pass: false
});

export const getDefaultVod = () => ({
	title: "",
	vod_url: "",
	description: "",
	description_url: ""
});

export const getDefaultResource = () => ({
	file: null,
	filename: "",
	resource_password: ""
});

export const getDefaultQuiz = () => ({
	required_correct_count: 1,
	questions: [getDefaultQuizQuestion()]
});

export const getDefaultQuizQuestion = () => ({
	question: "",
	question_image_file: null,
	question_image_filename: "",
	answers: [getDefaultQuestionAnswer()]
});

export const getDefaultQuestionAnswer = () => ({
	answer: "",
	answer_image_file: null,
	answer_image_filename: "",
	commentary: "",
	correct: false
});

/**
 * 과목에 연결된 챕터 정보를 얻어온다.
 * @param {int} courseId
 * @param {func} callbackExist
 * @param {func} callbackNotExist
 */
export const getCourseChapters = (courseId, callbackExist, callbackNotExist) => {
	api.getCourseChaptersAdmin(courseId)
		.then(response => {
			if (response.status === 404 || response.data.length === 0) {
				callbackNotExist();
			} else {
				callbackExist(response.data);
			}
		})
		.catch(err => console.error(err));
};

/**
 * 과목에 연결된 챕터 정보를 생성한다.
 * @param {int} courseId
 * @param {array} chapters
 * @param {func} callback
 * @returns
 */
export const handleCreate = (courseId, chapters, callback) => {
	if (!validateChapter(chapters)) return;

	api.createCourseChapters(courseId, chapters)
		.then(response => {
			if (response.status !== 201) {
				alert("과목 설계 저장에 실패하였습니다.");
				return;
			}

			alert("과목 설계를 저장하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("과목 설계 저장에 실패하였습니다.");
		});
};

/**
 * 과목에 연결된 챕터 정보를 갱신한다.
 * @param {int} courseId
 * @param {array} chapters
 * @returns
 */
export const handleUpdate = (courseId, chapters, callback) => {
	if (!validateChapter(chapters)) return;

	api.updateCourseChapters(courseId, chapters)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("과목 설계 저장에 실패하였습니다.");
				return;
			}

			alert("과목 설계를 저장하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("과목 설계 저장에 실패하였습니다.");
		});
};

/**
 * 챕터에 있는 정보가 제대로 되어 있는지 확인한다.
 * @param {array} chapters
 * @returns
 */
export const validateChapter = chapters => {
	for (let i = 0; i < chapters.length; i++) {
		let chapter = chapters[i];
		if (!chapter.title) {
			alert("강의의 제목이 없습니다.");
			return false;
		}

		for (let j = 0; j < chapter.vods.length; j++) {
			let vod = chapter.vods[j];
			if (!vod.title) {
				alert("동영상 제목이 없습니다.");
				return false;
			}
			if (!vod.vod_url) {
				alert("동영상 강의 URL이 없습니다.");
				return false;
			}
		}
	}

	return true;
};
