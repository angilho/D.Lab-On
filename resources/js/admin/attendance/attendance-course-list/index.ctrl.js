import * as api from "@common/api";

export const getAttendanceCourses = (query, callback) => {
	api.getAttendanceCourses(query)
		.then(response => {
			if (response.status == 200) {
				callback(response.data);
			} else {
				alert("출결관리 정보를 불러오는데 실패했습니다.");
			}
		})
		.catch(err => {
			console.error(err);
			alert("출결관리 정보를 불러오는데 실패했습니다.");
		});
};

export const handleExport = attendanceCourseId => {
	window.location.href = `/admin/export/course_attendances/${attendanceCourseId}`;
};
