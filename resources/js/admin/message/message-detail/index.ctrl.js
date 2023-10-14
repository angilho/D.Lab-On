import * as api from "@common/api";

export const getMessage = (messageId, callback) => {
	api.getMessage(messageId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};
