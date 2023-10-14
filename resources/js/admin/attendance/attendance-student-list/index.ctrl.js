import * as api from "@common/api";

export const getAttendanceStudents = (attendanceCourseId, attendanceSectionId, callback) => {
	api.getAttendanceSectionInfo(attendanceCourseId, attendanceSectionId)
		.then(res => {
			if (res.status == 200) {
				const courseId = res.data.attendance_course.course_id;
				const sectionId = res.data.attendance_course.section_id;
				const attendanceData = res.data;
				api.getCourseSectionEnrollments(courseId, sectionId)
					.then(res => {
						if (res.status == 200) {
							const erollmentData = res.data;
							callback(attendanceData, erollmentData);
						} else {
							alert("수강생 정보를 불러오는데 실패했습니다.");
						}
					})
					.catch(err => console.log(err));
			} else {
				alert("수강생 정보를 불러오는데 실패했습니다.");
			}
		})
		.catch(err => {
			console.log(err);
			alert("수강생 정보를 불러오는데 실패했습니다.");
		});
};

export const updateAttendanceStudents = (attendanceCourseId, attendanceSectionId, students, callback) => {
	api.updateAttendanceStudents(attendanceCourseId, attendanceSectionId, students)
		.then(res => {
			if (res.status == 201) {
				alert("출석 완료되었습니다.");
				callback(res);
			} else {
				alert("수강생 출석정보 갱신에 실패했습니다.");
			}
		})
		.catch(err => {
			console.log(err);
			alert("수강생 출석정보 갱신에 실패했습니다.");
		});
};

export const getAttendanceStudentHistory = (attendanceCourseId, studentId, callback) => {
	api.getAttendanceStudentHistory(attendanceCourseId, studentId)
		.then(res => {
			if (res.status == 200) {
				callback(res.data);
			} else {
				alert("수강생별 수강 정보를 불러오는데 실패했습니다.");
			}
		})
		.catch(err => {
			console.log(err);
			alert("수강생별 수강 정보를 불러오는데 실패했습니다.");
		});
};

export const updateAttendanceStudent = (studentAttendances, attendanceCourseId, studentId, callback) => {
	api.updateAttendanceStudent(studentAttendances, attendanceCourseId, studentId)
		.then(res => {
			if (res.status == 201) {
				alert("수강생 출석정보가 갱신되었습니다.");
				callback(res);
			} else {
				alert("수강생 출석정보 갱신에 실패했습니다.");
			}
		})
		.catch(err => {
			console.log(err);
			alert("수강생 출석정보 갱신에 실패했습니다.");
		});
};
