import * as api from "@common/api";

export const getOrganizationUser = (userId, callback) => {
	api.getOrganizationUser(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getUserEnrollments = (userId, callback) => {
	api.getUserEnrollments(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleUserDelete = (user, callback) => {
	if (confirm("이 회원의 정보를 영구 삭제하시겠습니까?")) {
		api.deleteUser(user.id)
			.then(response => {
				if (response.status != 204) {
					alert("삭제 중 오류가 발생하였습니다.");
				}

				callback();
			})
			.catch(err => console.error(err));
	}
};
