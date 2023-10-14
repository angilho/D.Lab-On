import * as api from "@common/api";

export const getEnrollments = (query, callback) => {
	api.getEnrollments(query)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getPaginationLink = (link, callback) => {
	api.getPaginationLink(link)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};

export const searchEnrollmentByDate = (startAt, endAt, callback) => {
	api.getEnrollments(startAt, endAt)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleExport = () => {
	window.location.href = "/admin/export/enrollments";
};
