import * as api from "@common/api";

export const createOrganizationEnrollmentImport = (enrollments, callback) => {
	api.createOrganizationEnrollmentImport(enrollments)
		.then(response => {
			if (response.status === 206) {
				alert("일부 B2B 회원 수강신청에 실패하였습니다.");
				alert("실패한 회원 아이디 : " + response.data.failed_enrollments);
				return;
			}
			if (response.status !== 201) {
				alert("B2B 회원 수강신청에 실패하였습니다.");
				return;
			}

			alert("B2B 회원 수강신청을 완료하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("B2B 회원 수강신청에 실패하였습니다.");
		});
};
