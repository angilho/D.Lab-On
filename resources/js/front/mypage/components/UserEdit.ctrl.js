import * as api from "@common/api";

export const getUser = (userId, callback) => {
	api.getUser(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const updateUser = (userId, user, callback) => {
	// school_etc가 있는 경우 school에 기타로 입력한 값을 넣어준다.
	if (user.school_etc) {
		user.school = user.school_etc;
	}
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

export const validateUser = (user, isChild) => {
	// 자식이 아닌 경우에는 email은 항상 존재해야 한다.
	if (!isChild && !user.email) {
		alert("이메일을 입력하여 주십시오.");
		return false;
	}

	return true;
};
