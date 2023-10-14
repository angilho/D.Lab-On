import * as api from "@common/api";

export const getDefaultNotice = () => ({
	title: "",
	description: ""
});

export const getNotice = (noticeId, callback) => {
	api.getNotice(noticeId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleCreate = (notice, callback) => {
	if (!validate(notice)) return;

	api.createNotice(notice)
		.then(response => {
			if (response.status !== 201) {
				alert("공지사항 작성에 실패하였습니다.");
				return;
			}

			alert("공지사항을 작성하였습니다.");
			callback();
		})
		.catch(err => {
			alert("공지사항 작성에 실패하였습니다.");
			console.error(err);
		});
};

export const handleUpdate = (noticeId, notice, callback) => {
	if (!validate(notice)) return;

	api.updateNotice(noticeId, notice)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("공지사항 수정에 실패하였습니다.");
				return;
			}

			alert("공지사항을 수정하였습니다.");
			callback();
		})
		.catch(err => {
			alert("공지사항 수정에 실패하였습니다.");
			console.error(err);
		});
};

export const handleDelete = (noticeId, callback) => {
	if (confirm("정말 삭제하시겠습니까?")) {
		api.deleteNotice(noticeId)
			.then(response => {
				if (response.status !== 204) {
					alert("공지사항 삭제에 실패하였습니다.");
					return;
				}

				alert("공지사항을 삭제하였습니다.");
				callback();
			})
			.catch(err => {
				alert("공지사항 삭제에 실패하였습니다.");
				console.error(err);
			});
	}
};

export const validate = notice => {
	if (!notice.title) {
		alert("공지사항 제목이 없습니다.");
		return false;
	}
	if (!notice.description) {
		alert("공지사항 내용이 없습니다.");
		return false;
	}
	return true;
};
