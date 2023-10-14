import * as api from "@common/api";

export const getDefaultCurriculumCategory = () => ({
	title: "",
	subtitle: "",
	description: "",
	curriculum_courses: []
});

export const getCurriculumCategory = (curriculumCategoryId, callback) => {
	api.getCurriculumCategory(curriculumCategoryId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleCreate = (curriculumCategory, callback) => {
	if (!validateCurriculumCategory(curriculumCategory)) return;

	api.createCurriculumCategory(curriculumCategory)
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
	if (!validateCurriculumCategory(curriculumCategory)) return;

	api.updateCurriculumCategory(curriculumCategory.id, curriculumCategory)
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

export const validateCurriculumCategory = curriculumCategory => {
	if (!curriculumCategory.title) {
		alert("커리큘럼 제목이 없습니다.");
		return false;
	}
	if (!curriculumCategory.subtitle) {
		alert("커리큘럼 소제목이 없습니다.");
		return false;
	}
	if (!curriculumCategory.description) {
		alert("커리큘럼 소개가 없습니다.");
		return false;
	}

	return true;
};
