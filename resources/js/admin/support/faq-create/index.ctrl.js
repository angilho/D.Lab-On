import * as api from "@common/api";

export const getDefaultFaq = () => ({
	faq_category_id: null,
	name: "",
	description: ""
});

export const getFaq = (faqId, callback) => {
	api.getFaq(faqId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getFaqCategories = callback => {
	api.getFaqCategories()
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleCreate = (faq, callback) => {
	if (!validate(faq)) return;

	api.createFaq(faq)
		.then(response => {
			if (response.status !== 201) {
				alert("FAQ 작성에 실패하였습니다.");
				return;
			}

			alert("FAQ를 작성하였습니다.");
			callback();
		})
		.catch(err => {
			alert("FAQ 작성에 실패하였습니다.");
			console.error(err);
		});
};

export const handleUpdate = (faqId, faq, callback) => {
	if (!validate(faq)) return;

	api.updateFaq(faqId, faq)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("FAQ 수정에 실패하였습니다.");
				return;
			}

			alert("FAQ를 수정하였습니다.");
			callback();
		})
		.catch(err => {
			alert("FAQ 수정에 실패하였습니다.");
			console.error(err);
		});
};

export const handleDelete = (faqId, callback) => {
	if (confirm("정말 삭제하시겠습니까?")) {
		api.deleteFaq(faqId)
			.then(response => {
				if (response.status !== 204) {
					alert("FAQ 삭제에 실패하였습니다.");
					return;
				}

				alert("FAQ를 삭제하였습니다.");
				callback();
			})
			.catch(err => {
				alert("FAQ 삭제에 실패하였습니다.");
				console.error(err);
			});
	}
};

export const validate = faq => {
	if (!faq.name) {
		alert("FAQ 제목이 없습니다.");
		return false;
	}
	if (!faq.description) {
		alert("FAQ 내용이 없습니다.");
		return false;
	}
	return true;
};
