import * as api from "@common/api";

export const getDefaultDetailCurriculumCategory = () => ({
	title: "",
	description: "",
	tag: "",
	curriculum_courses: []
});

export const getDetailCurriculumCategory = (curriculumCategoryId, callback) => {
	api.getDetailCurriculumCategory(curriculumCategoryId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleCreate = (curriculumCategory, callback) => {
	if (!validateDetailCurriculumCategory(curriculumCategory)) return;

	api.createDetailCurriculumCategory(curriculumCategory)
		.then(response => {
			if (response.status !== 201) {
				alert("커리큘럼 추가에 실패하였습니다.");
				return;
			}

			alert("커리큘럼을 추가하였습니다.");
			callback();
		})
		.catch(err => {
			alert("커리큘럼 추가에 실패하였습니다.");
			console.error(err);
		});
};

export const handleUpdate = (curriculumCategory, callback) => {
	if (!validateDetailCurriculumCategory(curriculumCategory)) return;

	api.updateDetailCurriculumCategory(curriculumCategory.id, curriculumCategory)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("커리큘럼 수정에 실패하였습니다.");
				return;
			}

			alert("커리큘럼을 수정하였습니다.");
			callback();
		})
		.catch(err => {
			alert("커리큘럼 수정에 실패하였습니다.");
			console.error(err);
		});
};

export const handleDelete = (curriculumCategoryId, callback) => {
	if (confirm("정말 삭제하시겠습니까?")) {
		api.deleteCurriculumCategory(curriculumCategoryId)
			.then(response => {
				if (response.status !== 204) {
					alert("커리큘럼 삭제에 실패하였습니다.");
					return;
				}

				alert("커리큘럼을 삭제하였습니다.");
				callback();
			})
			.catch(err => {
				alert("커리큘럼 삭제에 실패하였습니다.");
				console.error(err);
			});
	}
};

export const validateDetailCurriculumCategory = curriculumCategory => {
	if (!curriculumCategory.title) {
		alert("커리큘럼 제목이 없습니다.");
		return false;
	}
	if (!curriculumCategory.description) {
		alert("커리큘럼 소개가 없습니다.");
		return false;
	}
	if (!curriculumCategory.tag) {
		alert("커리큘럼 해시태그가 없습니다.");
		return false;
	}
	if (!curriculumCategory.curriculum_courses || curriculumCategory.curriculum_courses.length === 0) {
		alert("커리큘럼 과목이 없습니다.");
		return false;
	}

	return true;
};
