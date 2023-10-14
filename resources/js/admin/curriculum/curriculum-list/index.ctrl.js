import * as api from "@common/api";

export const getCurriculumCategories = (query, callback) => {
	api.getCurriculumCategories(query)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleReorder = (curriculumCategories, callback) => {
	api.reorderCurriculumCategory({ curriculum_categories: curriculumCategories })
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("커리큘럼 순서 조절에 실패하였습니다.");
				return;
			}
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("커리큘럼 순서 조절에 실패하였습니다.");
		});
};

export const handleDelete = async (curriculumCategoryIds, callback) => {
	if (curriculumCategoryIds.length === 0) {
		alert("선택한 커리큘럼이 없습니다.");
		return;
	}

	if (confirm("선택한 커리큘럼을 삭제하시겠습니까?")) {
		await Promise.all(
			curriculumCategoryIds.map(curriculumCategoryId => {
				return api.deleteCurriculumCategory(curriculumCategoryId);
			})
		)
			.then(resArr => {
				if (resArr.some(response => response.status !== 204)) {
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
