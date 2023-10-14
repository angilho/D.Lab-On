import * as api from "@common/api";

export const getDefaultChild = () => ({
	parent_id: null,
	role: 2, // 자녀
	name: "",
	gender: "m", // 성별
	grade: 1, // 학년
	school: "", // 학교
	phone: "",
	user_login: "",
	password: "",
	email: "",
	birthday: {
		year: 1950,
		month: 1,
		day: 1
	},
	address: "",
	address_detail: "",
	campus: 0
});

export const registerEnable = child => {
	return (
		child.name &&
		child.gender &&
		child.grade &&
		child.school &&
		child.phone &&
		child.user_login &&
		child.password &&
		child.address &&
		child.address_detail
	);
};

export const getUser = (user_id, callback) => {
	api.getUser(user_id).then(response => {
		callback(response.data);
	});
};

export const handleCreate = (parent_id, child, callback) => {
	// school_etc가 있는 경우 school에 기타로 입력한 값을 넣어준다.
	if (child.school_etc) {
		child.school = child.school_etc;
	}
	api.createChild(parent_id, child).then(response => {
		callback(response.data);
	});
};
