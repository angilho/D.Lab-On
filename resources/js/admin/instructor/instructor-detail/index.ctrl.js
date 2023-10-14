import * as api from "@common/api";

export const getInstructor = (userId, callback) => {
	api.getUser(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getUserEnrollments = (userId, callback) => {
	api.getUserEnrollments(userId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleUserDelete = (user, callback) => {
	if (confirm("이 회원의 정보를 영구 삭제하시겠습니까?")) {
		api.deleteUser(user.id)
			.then(response => {
				if (response.status != 204) {
					alert("삭제 중 오류가 발생하였습니다.");
				}

				callback();
			})
			.catch(err => console.error(err));
	}
};

export const createInstructorEnrollment = (userId, courseId, sectionId, callback) => {
	api.createInstructorEnrollment(userId, { course_id: courseId, section_id: sectionId })
		.then(response => {
			if (response.status !== 201) {
				alert("과목 추가에 실패하였습니다.");
				return;
			}

			alert("과목을 추가하였습니다.");
			callback();
		})
		.catch(err => {
			alert("과목 추가에 실패하였습니다.");
			console.error(err);
		});
};

export const deleteInstructorEnrollment = (userId, enrollmentId, callback) => {
	if (confirm("이 과목을 삭제하시겠습니까?")) {
		api.deleteInstructorEnrollment(userId, enrollmentId)
			.then(response => {
				if (response.status !== 204) {
					alert("과목 삭제에 실패하였습니다.");
					return;
				}

				alert("과목을 삭제하였습니다.");
				callback();
			})
			.catch(err => {
				alert("과목 삭제에 실패하였습니다.");
				console.error(err);
			});
	}
};
