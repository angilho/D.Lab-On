import * as api from "@common/api";

export const getDefaultChild = () => ({
	name: "",
	gender: "f",
	birth: {
		year: new Date().getFullYear(),
		month: 1,
		day: 1
	}
});

export const handleCreate = (userId, child) => {
	// TODO: input validation
	api.createChild(userId, child).then(response => {
		if (response.status !== 201) {
			alert("사용자 추가에 실패하였습니다.");
			return;
		}

		window.location.href = `/admin/users/${userId}`;
	});
};
