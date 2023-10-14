import * as api from "@common/api";

export const getMenuPermission = (menuId, callback) => {
	api.getMenuPermission(menuId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleUpdate = (menuId, permissionUsers, callback) => {
	api.updateMenuPermissions(menuId, permissionUsers)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("사용자 권한 저장에 실패하였습니다.");
				return;
			}

			alert("사용자 권한을 저장하였습니다.");
			callback();
		})
		.catch(err => {
			alert("사용자 권한 저장에 실패하였습니다.");
			console.error(err);
		});
};
