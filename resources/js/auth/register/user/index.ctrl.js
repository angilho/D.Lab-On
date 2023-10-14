import * as api from "@common/api";
import Cookies from "js-cookie";

export const getDefaultUser = isParent => ({
	role: isParent ? 1 : 2, // 일반 사용자 1, 학생등록 2
	name: "",
	phone: "",
	user_login: "",
	password: "",
	email: "",
	birthday: { year: 1950, month: 1, day: 1 },
	address: "",
	address_detail: "",
	inflow_path: "지인 소개",
	inflow_path_etc: "",
	agreements: {
		dlab_on: false,
		privacy: false,
		promotion: false
	},
	school: "",
	school_etc: "",
	grade: 1,
	campus: 0
});

export const handleCreate = (user, callback) => {
	// inflow_path_etc가 있는 경우 inflow_path에 기타로 입력한 값을 넣어준다.
	if (user.inflow_path_etc) {
		user.inflow_path = user.inflow_path_etc;
	}
	// school_etc가 있는 경우 school에 기타로 입력한 값을 넣어준다.
	if (user.school_etc) {
		user.school = user.school_etc;
	}
	api.createUser(user)
		.then(response => {
			if (response.status === 201 || response.status == 200) {
				// 회원 생성 후 로그인 한다. 자녀 생성을 추가할 때 필요하다.
				api.login(user.user_login, user.password, false)
					.then(loginResponse => {
						if (loginResponse.status === 200) {
							Cookies.set("api_token", loginResponse.data.api_token, { expires: 365 });
							callback(response.data);
							return;
						}
					})
					.catch(err => {
						console.warn(err);
					});
			} else {
				alert("회원 생성에 실패했습니다.");
			}
		})
		.catch(err => {
			console.error(err);
		});
};
