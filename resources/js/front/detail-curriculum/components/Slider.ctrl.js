import * as api from "@common/api";

export const getCarousels = callback => {
	api.getCarousels()
		.then(res => {
			if (res.data) {
				callback(res.data);
			}
		})
		.catch(err => console.error(err));
};
