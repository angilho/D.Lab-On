import * as api from "@common/api";

export const getDefaultUser = () => ({
	role: 1, // 일반 사용자
	name: "",
	phone: "",
	user_login: "",
	password: "",
	email: "",
	birthday: { year: 1950, month: 1, day: 1 },
	address: "",
	address_detail: "",
	inflow_path: "",
	agreements: {
		dlab_on: false,
		privacy: false,
		promotion: false
	}
});

export const registerEnable = user => {
	return (
		user.name &&
		user.phone &&
		user.user_login &&
		user.password &&
		user.password &&
		user.email &&
		user.address &&
		user.address_detail &&
		user.inflow_path
	);
};

export const handleCreate = (user, callback) => {
	api.createUser(user).then(response => {
		callback(response.data);
	});
};
