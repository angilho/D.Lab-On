import * as api from "@common/api";

export const getSupportClassEnrollments = (query, callback) => {
	api.getSupportClassEnrollments(query)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};

export const deleteSupportClassEnrollments = (enrollmentIds, callback) => {
	api.deleteSupportClassEnrollments(enrollmentIds)
		.then(response => {
			if (response.status !== 204) {
				alert("회원 보충수업 수강신청 삭제에 실패하였습니다.");
				return;
			}

			alert("회원 보충수업 수강신청을 삭제하였습니다.");
			callback();
		})
		.catch(err => {
			alert("회원 보충수업 수강신청 삭제에 실패하였습니다.");
			console.error(err);
		});
};

export const handleExportHistory = () => {
	window.location.href = `/admin/export/support_class_histories`;
};

export const getPaginationLink = (link, callback) => {
	api.getPaginationLink(link)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};

export const supportClassEnrollmentExtend = (enrollemnt_ids, callback) => {
	api.supportClassEnrollmentExtend(enrollemnt_ids)
		.then(response => {
			if (response.status == 200) {
				callback(response.data);
			} else {
				alert("회원 보충수업 기간연장을 실패하였습니다.");
			}
		})
		.catch(err => {
			console.error(err);
			alert("회원 보충수업 기간연장을 실패하였습니다.");
		});
};
