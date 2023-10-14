import * as api from "@common/api";

export const getAttendanceSections = (attendanceCourseId, callback) => {
	api.getAttendanceSections(attendanceCourseId)
		.then(response => {
			if (response.status == 200) {
				callback(response.data);
			} else {
				alert("출결 차시 정보를 가져오는데 실패했습니다.");
			}
		})
		.catch(err => {
			console.log(err);
			alert("출결 차시 정보를 가져오는데 실패했습니다.");
		});
};

export const deleteAttendanceSections = (attendanceCourseId, attendanceSectionIds, callback) => {
	api.deleteAttendanceSections(attendanceCourseId, attendanceSectionIds)
		.then(res => {
			if (res.status == 204) {
				alert("선택한 차시 수업을 삭제하였습니다.");
				callback(res);
			} else {
				alert("출결 차시 삭제에 실패했습니다.");
			}
		})
		.catch(err => {
			console.log(err);
			alert("출결 차시 삭제에 실패했습니다.");
		});
};
