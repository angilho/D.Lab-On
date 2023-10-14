import * as api from "@common/api";

export const getOrganizationUser = (userId, callback) => {
	api.getOrganizationUser(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const updateUser = (userId, user, callback) => {
	api.updateUser(userId, user)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("사용자 갱신에 실패하였습니다.");
				return;
			}

			alert("사용자 정보를 변경하였습니다.");
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const validateUser = user => {
	if (!user.name) {
		alert("이름을 입력하여 주십시오.");
		return false;
	}
	if (!user.email) {
		alert("이메일을 입력하여 주십시오.");
		return false;
	}

	return true;
};
