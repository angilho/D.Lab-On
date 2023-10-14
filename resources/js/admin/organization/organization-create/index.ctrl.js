import * as api from "@common/api";

export const getDefaultOrganization = () => ({
	name: "",
	start_at: "",
	start_at_date: null,
	end_at: "",
	end_at_date: null,
	path: "",
	memo: ""
});

export const getOrganization = (organizationId, callback) => {
	api.getOrganization(organizationId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleCreate = (organization, callback) => {
	if (!validateOrganization(organization)) return;

	api.createOrganization(organization)
		.then(response => {
			if (response.status !== 201) {
				alert("B2B 회원 추가에 실패하였습니다.");
				return;
			}

			alert("B2B 회원을 추가하였습니다.");
			callback();
		})
		.catch(err => {
			alert("B2B 회원 추가에 실패하였습니다.");
			console.error(err);
		});
};

export const handleUpdate = (organization, callback) => {
	if (!validateOrganization(organization)) return;

	api.updateOrganization(organization.id, organization)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("B2B 회원 수정에 실패하였습니다.");
				return;
			}

			alert("B2B 회원을 수정하였습니다.");
			callback();
		})
		.catch(err => {
			alert("B2B 회원 수정에 실패하였습니다.");
			console.error(err);
		});
};

export const handleDelete = (organizationId, callback) => {
	if (confirm("정말 삭제하시겠습니까?")) {
		api.deleteOrganization(organizationId)
			.then(response => {
				if (response.status !== 204) {
					alert("B2B 회원 삭제에 실패하였습니다.");
					return;
				}

				alert("B2B 회원을 삭제하였습니다.");
				callback();
			})
			.catch(err => {
				alert("B2B 회원 삭제에 실패하였습니다.");
				console.error(err);
			});
	}
};

export const validateOrganization = organization => {
	if (!organization.name) {
		alert("기업명이 없습니다.");
		return false;
	}
	if (!organization.start_at) {
		alert("사용 시작기간이 잘못되었습니다.");
		return false;
	}
	if (!organization.end_at) {
		alert("사용 종료기간이 잘못되었습니다.");
		return false;
	}
	if (!organization.path) {
		alert("접속링크가 없습니다.");
		return false;
	}

	return true;
};
