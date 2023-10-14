import * as api from "@common/api";

export const getDefaultUser = () => ({
	name: "",
	email: "",
	role: 1,
	user_login: "",
	password: "",
	phone: "",
	address: "",
	address_detail: "",
	birthday: {
		year: "1990",
		month: "1",
		day: "1"
	},
	agreements: {
		dlab_on: true,
		privacy: true,
		promotion: false
	},
	inflow_path: "운영자 페이지에서 가입",
	campus: 0
});

export const handleCreate = (user, callback_url) => {
	api.createUser(user).then(response => {
		if (response.status !== 201) {
			alert("사용자 추가에 실패하였습니다.");
			return;
		}

		alert("사용자를 추가하였습니다.");
		if (callback_url) {
			window.location.href = callback_url;
		} else {
			window.location.href = "/admin/users";
		}
	});
};
