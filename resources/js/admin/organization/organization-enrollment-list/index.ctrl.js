import * as api from "@common/api";

export const getOrganizationEnrollments = (query, callback) => {
	api.getOrganizationEnrollments(query)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};

export const deleteOrganizationEnrollments = (enrollmentIds, callback) => {
	api.deleteOrganizationEnrollments(enrollmentIds)
		.then(response => {
			if (response.status !== 204) {
				alert("B2B 회원 수강신청 삭제에 실패하였습니다.");
				return;
			}

			alert("B2B 회원 수강신청을 삭제하였습니다.");
			callback();
		})
		.catch(err => {
			alert("B2B 회원 수강신청 삭제에 실패하였습니다.");
			console.error(err);
		});
};

export const getPaginationLink = (link, callback) => {
	api.getPaginationLink(link)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};
