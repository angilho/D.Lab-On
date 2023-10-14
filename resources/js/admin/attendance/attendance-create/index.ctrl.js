import * as api from "@common/api";

export const createAttendaceCourses = (createAttendanceInfo, callback) => {
	api.createAttendaceCourses(createAttendanceInfo)
		.then(res => {
			callback(res);
		})
		.catch(err => {
			console.log(err);
			alert("출결 등록에 실패하였습니다.");
		});
};
