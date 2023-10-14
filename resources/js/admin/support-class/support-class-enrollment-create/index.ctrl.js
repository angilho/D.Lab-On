import * as api from "@common/api";
import * as XLSX from "xlsx";

export const createSupportClassEnrollmentImport = (enrollments, callback) => {
	api.createSupportClassEnrollmentImport(enrollments)
		.then(response => {
			if (response.status === 206) {
				alert("일부 회원 보충수업 수강신청에 실패하였습니다.");
				alert("실패한 회원 아이디 : " + response.data.failed_enrollments);
				return;
			}
			if (response.status !== 201) {
				alert("회원 보충수업 수강신청에 실패하였습니다.");
				return;
			}

			alert("회원 보충수업 수강신청을 완료하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("회원 보충수업 수강신청에 실패하였습니다.");
		});
};
